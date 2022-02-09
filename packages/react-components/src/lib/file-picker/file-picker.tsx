/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ChonkyActions,
  ChonkyFileActionData,
  FileAction,
  FileArray,
  FileBrowserProps,
  FileData,
  FileHelper,
  FullFileBrowser,
  I18nConfig,
  setChonkyDefaults,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '../box';
import { SupportedLocales } from '../models';
import localization from './localization';
import FsMap from './fs-map.json';

import './file-picker.css';

// IMPLEMENTATION NOTES: Currently FilePicker component works with his own icon set.
// In future might be tweaked.
setChonkyDefaults({ iconComponent: ChonkyIconFA });

interface CustomFileData extends FileData {
  parentId?: string;
  childrenIds?: string[];
}
interface CustomFileMap {
  [fileId: string]: CustomFileData;
}

const prepareCustomFileMap = () => {
  const baseFileMap = (FsMap.fileMap as unknown) as CustomFileMap;
  const rootFolderId = FsMap.rootFolderId;
  return { baseFileMap, rootFolderId };
};

// Sets up files map and actions
const useCustomFileMap = () => {
  const { baseFileMap, rootFolderId } = useMemo(prepareCustomFileMap, []);

  const [fileMap, setFileMap] = useState(baseFileMap);
  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);

  const resetFileMap = useCallback(() => {
    setFileMap(baseFileMap);
    setCurrentFolderId(rootFolderId);
  }, [baseFileMap, rootFolderId]);

  const currentFolderIdRef = useRef(currentFolderId);
  useEffect(() => {
    currentFolderIdRef.current = currentFolderId;
  }, [currentFolderId]);

  const deleteFiles = useCallback((files: CustomFileData[]) => {
    setFileMap((currentFileMap) => {
      const newFileMap = { ...currentFileMap };

      files.forEach((file) => {
        delete newFileMap[file.id];

        if (file.parentId) {
          const parent = newFileMap[file.parentId];
          const newChildrenIds = parent.childrenIds?.filter(
            (id) => id !== file.id
          );
          newFileMap[file.parentId] = {
            ...parent,
            childrenIds: newChildrenIds,
            childrenCount: newChildrenIds?.length,
          };
        }
      });

      return newFileMap;
    });
  }, []);

  const moveFiles = useCallback(
    (
      files: CustomFileData[],
      source: CustomFileData,
      destination: CustomFileData
    ) => {
      setFileMap((currentFileMap) => {
        const newFileMap = { ...currentFileMap };
        const moveFileIds = new Set(files.map((f) => f.id));

        // Delete files from their source folder.
        const newSourceChildrenIds = source.childrenIds?.filter(
          (id) => !moveFileIds.has(id)
        );
        newFileMap[source.id] = {
          ...source,
          childrenIds: newSourceChildrenIds,
          childrenCount: newSourceChildrenIds?.length,
        };

        // Add the files to their destination folder.
        const newDestinationChildrenIds = [
          ...(destination.childrenIds as string[]),
          ...files.map((f) => f.id),
        ];
        newFileMap[destination.id] = {
          ...destination,
          childrenIds: newDestinationChildrenIds,
          childrenCount: newDestinationChildrenIds.length,
        };

        // Finally, update the parent folder ID on the files - from source folder
        // ID to the destination folder ID.
        files.forEach((file) => {
          newFileMap[file.id] = {
            ...file,
            parentId: destination.id,
          };
        });

        return newFileMap;
      });
    },
    []
  );

  // TODO: in production we should use UUIDs or MD5 hashes for file paths
  const idCounter = useRef(0);
  const createFolder = useCallback((folderName: string) => {
    setFileMap((currentFileMap) => {
      const newFileMap = { ...currentFileMap };

      // Create the new folder.
      const newFolderId = `new-folder-${idCounter.current++}`;
      newFileMap[newFolderId] = {
        id: newFolderId,
        name: folderName,
        isDir: true,
        modDate: new Date(),
        parentId: currentFolderIdRef.current,
        childrenIds: [],
        childrenCount: 0,
      };

      // Update parent folder to reference the new folder.
      const parent = newFileMap[currentFolderIdRef.current];
      newFileMap[currentFolderIdRef.current] = {
        ...parent,
        childrenIds: [...(parent.childrenIds as string[]), newFolderId],
      };

      return newFileMap;
    });
  }, []);

  return {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    resetFileMap,
    deleteFiles,
    moveFiles,
    createFolder,
  };
};

export const useFiles = (
  fileMap: CustomFileMap,
  currentFolderId: string
): FileArray => {
  return useMemo(() => {
    const currentFolder = fileMap[currentFolderId];
    const files = currentFolder.childrenIds
      ? currentFolder.childrenIds.map(
          (fileId: string) => fileMap[fileId] ?? null
        )
      : [];
    return files;
  }, [currentFolderId, fileMap]);
};

export const useFolderChain = (
  fileMap: CustomFileMap,
  currentFolderId: string
): FileArray => {
  return useMemo(() => {
    const currentFolder = fileMap[currentFolderId];
    const folderChain = [currentFolder];
    let parentId = currentFolder.parentId;
    while (parentId) {
      const parentFile = fileMap[parentId];
      if (parentFile) {
        folderChain.unshift(parentFile);
        parentId = parentFile.parentId;
      } else {
        break;
      }
    }
    return folderChain;
  }, [currentFolderId, fileMap]);
};

export const useFileActionHandler = (
  setCurrentFolderId: (folderId: string) => void,
  deleteFiles: (files: CustomFileData[]) => void,
  moveFiles: (
    files: FileData[],
    source: FileData,
    destination: FileData
  ) => void,
  createFolder: (folderName: string) => void
) => {
  return useCallback(
    (data: ChonkyFileActionData) => {
      if (data.id === ChonkyActions.OpenFiles.id) {
        const { targetFile, files } = data.payload;
        const fileToOpen = targetFile ?? files[0];
        if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
          setCurrentFolderId(fileToOpen.id);
          return;
        }
      } else if (data.id === ChonkyActions.DeleteFiles.id) {
        deleteFiles(data.state.selectedFilesForAction);
      } else if (data.id === ChonkyActions.MoveFiles.id) {
        moveFiles(
          data.payload.files,
          data.payload.source as FileData,
          data.payload.destination
        );
      } else if (data.id === ChonkyActions.CreateFolder.id) {
        const folderName = prompt('Provide the name for your new folder:');
        if (folderName) createFolder(folderName);
      }
    },
    [createFolder, deleteFiles, moveFiles, setCurrentFolderId]
  );
};

interface FilePickerProps extends Partial<FileBrowserProps> {
  theme?: Record<string, string>;
  styles?: Record<string, string>;
  defaultView?: FilePickerView;
  readOnlyMode?: boolean;
  locale?: SupportedLocales;
}

export type FilePickerView = typeof FilePickerView[keyof typeof FilePickerView];
// eslint-disable-next-line @typescript-eslint/naming-convention
export const FilePickerView = {
  listView: ChonkyActions.EnableListView.id,
  gridView: ChonkyActions.EnableGridView.id,
} as const;

export type FileActionData = ChonkyFileActionData;

export const FilePicker: React.FC<FilePickerProps> = React.memo(
  ({
    theme,
    styles = { height: 400, minWidth: 600 },
    defaultView = FilePickerView.listView,
    readOnlyMode = false,
    locale,
    onFileAction: onPropsFileAction,
    ...props
  }) => {
    const {
      fileMap,
      currentFolderId,
      setCurrentFolderId,
      // resetFileMap,
      deleteFiles,
      moveFiles,
      createFolder,
    } = useCustomFileMap();
    const files = useFiles(fileMap, currentFolderId);
    const folderChain = useFolderChain(fileMap, currentFolderId);
    const handleFileAction = useFileActionHandler(
      setCurrentFolderId,
      deleteFiles,
      moveFiles,
      createFolder
    );

    // IMPLEMENTATION NOTES: Currently FilePicker component discards the ability to show file thumbnail.
    // In future might be tweaked.
    const thumbnailGenerator = useCallback(
      (file: FileData) => null,
      // file.thumbnailUrl ? `https://chonky.io${file.thumbnailUrl}` : null,
      []
    );

    makeStyles({
      '@global': {
        '.chonky-dropdownList': {
          backgroundColor: `${theme?.surface as string} !important`,
        },
        'li[class*="chonky-activeButton"]': {
          color: `${theme?.primary as string} !important`,
        },
      },
    })();

    const toDashCase = (str: string) => {
      return str.replace(/([A-Z])/g, ($1) => '-' + $1.toLowerCase());
    };

    const themeObject = useMemo((): Record<string, string> => {
      if (theme !== undefined) {
        const processedColors = Object.keys(theme).reduce(
          (acc: Record<string, string>, key) => {
            const val = theme[key];
            key = key.startsWith('--') ? key : `--fp-theme-${toDashCase(key)}`;
            acc[key] = val;
            return acc;
          },
          {}
        );
        return processedColors;
      }
      return {};
    }, [theme]);

    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [defaultFileViewActionId, setDefaultFileViewActionId] = useState<
      FilePickerView
    >();
    const [disableDragAndDrop, setDisableDragAndDrop] = useState<boolean>(
      false
    );
    const [fileActions, setFileActions] = useState<FileAction[]>();
    const [i18n, setI18n] = useState<I18nConfig>();
    useEffect(() => {
      if (theme) {
        setDarkMode(true);
      }
      if (defaultView) {
        setDefaultFileViewActionId(defaultView);
      }
      if (readOnlyMode === true) {
        setDisableDragAndDrop(true);
      }
      if (readOnlyMode === false) {
        setFileActions([ChonkyActions.CreateFolder, ChonkyActions.DeleteFiles]);
      }
      if (locale) {
        setI18n(localization[locale]);
      }
    }, [theme, defaultView, readOnlyMode, locale]);

    return (
      <Box
        style={{
          ...styles,
          ...themeObject,
        }}
      >
        <FullFileBrowser
          files={files}
          folderChain={folderChain}
          onFileAction={(data: ChonkyFileActionData) => {
            handleFileAction(data);
            if (typeof onPropsFileAction === 'function') {
              void onPropsFileAction(data);
            }
          }}
          thumbnailGenerator={thumbnailGenerator}
          defaultFileViewActionId={defaultFileViewActionId}
          disableDragAndDrop={disableDragAndDrop}
          fileActions={fileActions}
          darkMode={darkMode}
          i18n={i18n}
          {...props}
        />
      </Box>
    );
  }
);
