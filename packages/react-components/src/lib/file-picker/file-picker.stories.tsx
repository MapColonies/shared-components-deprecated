/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { Story } from '@storybook/react/types-6-0';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { Box } from '../box';
import { SupportedLocales } from '../models';
import {
  FileActionData,
  FilePicker,
  FileArray,
  FileData,
  FileHelper,
  FilePickerActions,
  FilePickerHandle,
} from './file-picker';
import FsMap from './fs-map.json';

export default {
  title: 'File Picker',
  component: FilePicker,
};

interface CustomFileData extends FileData {
  parentId?: string;
  childrenIds?: string[];
}
interface CustomFileMap {
  [fileId: string]: CustomFileData;
}

const prepareCustomFileMap = (): Record<string, unknown> => {
  const baseFileMap = (FsMap.fileMap as unknown) as CustomFileMap;
  const rootFolderId = FsMap.rootFolderId;
  return { baseFileMap, rootFolderId };
};

// Sets up files map and actions
// eslint-disable-next-line
const useCustomFileMap = () => {
  const { baseFileMap, rootFolderId } = useMemo(prepareCustomFileMap, []);

  const [fileMap, setFileMap] = useState<CustomFileMap>(
    baseFileMap as CustomFileMap
  );
  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);

  const resetFileMap = useCallback(() => {
    setFileMap(baseFileMap as CustomFileMap);
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

      const parentId = currentFolderIdRef.current as string;
      // Create the new folder.
      const newFolderId = `new-folder-${idCounter.current++}`;
      newFileMap[newFolderId] = {
        id: newFolderId,
        name: folderName,
        isDir: true,
        modDate: new Date(),
        parentId: parentId,
        childrenIds: [],
        childrenCount: 0,
      };

      // Update parent folder to reference the new folder.
      const parent = newFileMap[parentId];
      newFileMap[parentId] = {
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

const useFiles = (
  fileMap: CustomFileMap,
  currentFolderId: string
): FileArray => {
  return useMemo(() => {
    const currentFolder = fileMap[currentFolderId];
    const files = currentFolder.childrenIds
      ? currentFolder.childrenIds.map((fileId: string) => fileMap[fileId])
      : [];
    return files;
  }, [currentFolderId, fileMap]);
};

const useFolderChain = (
  fileMap: CustomFileMap,
  currentFolderId: string
): FileArray => {
  return useMemo(() => {
    const currentFolder = fileMap[currentFolderId];
    const folderChain = [currentFolder];
    let parentId = currentFolder.parentId;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    while (parentId) {
      const parentFile = fileMap[parentId];
      // eslint-disable-next-line
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

const useFileActionHandler = (
  setCurrentFolderId: (folderId: string) => void,
  deleteFiles: (files: CustomFileData[]) => void,
  moveFiles: (
    files: FileData[],
    source: FileData,
    destination: FileData
  ) => void,
  createFolder: (folderName: string) => void
): ((data: FileActionData) => void) => {
  return useCallback(
    (data: FileActionData) => {
      if (data.id === FilePickerActions.OpenFiles.id) {
        const { targetFile, files } = data.payload;
        const fileToOpen = targetFile ?? files[0];
        // eslint-disable-next-line
        if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
          setCurrentFolderId(fileToOpen.id);
          return;
        }
      } else if (data.id === FilePickerActions.DeleteFiles.id) {
        deleteFiles(data.state.selectedFilesForAction);
      } else if (data.id === FilePickerActions.MoveFiles.id) {
        moveFiles(
          data.payload.files,
          data.payload.source as FileData,
          data.payload.destination
        );
      } else if (data.id === FilePickerActions.CreateFolder.id) {
        const folderName = prompt('Provide the name for your new folder:');
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (folderName) createFolder(folderName);
      }
    },
    [createFolder, deleteFiles, moveFiles, setCurrentFolderId]
  );
};

export const ReadOnlyMode: Story = () => {
  const {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    // resetFileMap,
    deleteFiles,
    moveFiles,
    createFolder,
  } = useCustomFileMap();
  const files = useFiles(fileMap, currentFolderId as string);
  const folderChain = useFolderChain(fileMap, currentFolderId as string);
  const handleFileAction = useFileActionHandler(
    setCurrentFolderId,
    deleteFiles,
    moveFiles,
    createFolder
  );
  return (
    <Box style={{ height: '600px' }}>
      <FilePicker
        files={files}
        folderChain={folderChain}
        onFileAction={handleFileAction}
        readOnlyMode={true}
      />
    </Box>
  );
};

export const DarkTheme: Story = () => {
  const {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    // resetFileMap,
    deleteFiles,
    moveFiles,
    createFolder,
  } = useCustomFileMap();
  const files = useFiles(fileMap, currentFolderId as string);
  const folderChain = useFolderChain(fileMap, currentFolderId as string);
  const handleFileAction = useFileActionHandler(
    setCurrentFolderId,
    deleteFiles,
    moveFiles,
    createFolder
  );
  return (
    <Box style={{ height: '600px' }}>
      <FilePicker
        files={files}
        folderChain={folderChain}
        onFileAction={handleFileAction}
        theme={{
          primary: 'blue',
          background: 'black',
          surface: 'gray',
          textOnBackground: 'white',
          selectionBackground: '#455570',
        }}
      />
    </Box>
  );
};

export const Localized: Story = () => {
  const {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    // resetFileMap,
    deleteFiles,
    moveFiles,
    createFolder,
  } = useCustomFileMap();
  const files = useFiles(fileMap, currentFolderId as string);
  const folderChain = useFolderChain(fileMap, currentFolderId as string);
  const handleFileAction = useFileActionHandler(
    setCurrentFolderId,
    deleteFiles,
    moveFiles,
    createFolder
  );
  const [locale, setLocale] = useState<SupportedLocales>(SupportedLocales.HE);
  const handleLocaleChange = useCallback(
    (event) => setLocale(event.target.value),
    []
  );
  return (
    <>
      <FormControl component="fieldset" style={{ marginBottom: 15 }}>
        <FormLabel component="legend">Pick a language:</FormLabel>
        <RadioGroup
          aria-label="locale"
          name="locale"
          value={locale}
          onChange={handleLocaleChange}
        >
          <FormControlLabel
            value={SupportedLocales.HE}
            control={<Radio />}
            label="עברית"
          />
          <FormControlLabel
            value={SupportedLocales.RU}
            control={<Radio />}
            label="Русский"
          />
          <FormControlLabel
            value={SupportedLocales.EN}
            control={<Radio />}
            label="English"
          />
        </RadioGroup>
      </FormControl>
      <br />
      <Box style={{ height: '600px' }}>
        <FilePicker
          files={files}
          folderChain={folderChain}
          onFileAction={handleFileAction}
          locale={locale}
        />
      </Box>
    </>
  );
};

export const FilesSelection: Story = () => {
  const {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    // resetFileMap,
    deleteFiles,
    moveFiles,
    createFolder,
  } = useCustomFileMap();
  const files = useFiles(fileMap, currentFolderId as string);
  const folderChain = useFolderChain(fileMap, currentFolderId as string);
  const handleFileAction = useFileActionHandler(
    setCurrentFolderId,
    deleteFiles,
    moveFiles,
    createFolder
  );
  const fileBrowserRef = useRef<FilePickerHandle>(null);

  const logSelection = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!fileBrowserRef.current) return;
      console.log(fileBrowserRef.current.getFileSelection());
    },
    [fileBrowserRef]
  );

  const randomizeSelection = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!fileBrowserRef.current) return;
      const randomFileIds = new Set<string>();
      for (const file of files) {
        if (file && Math.random() > 0.5) randomFileIds.add(file.id);
      }
      fileBrowserRef.current.setFileSelection(randomFileIds);
    },
    [files, fileBrowserRef]
  );

  return (
    <Box style={{ height: '600px' }}>
      <button type="button" onClick={randomizeSelection}>
        Select files
      </button>
      <button type="button" onClick={logSelection}>
        Log selection
      </button>
      <FilePicker
        ref={fileBrowserRef}
        files={files}
        folderChain={folderChain}
        onFileAction={handleFileAction}
      />
    </Box>
  );
};
