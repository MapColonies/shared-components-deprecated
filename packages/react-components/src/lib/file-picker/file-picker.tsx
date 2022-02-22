import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChonkyActions,
  ChonkyFileActionData,
  FileAction,
  FileArray as ChonkyFileArray,
  FileBrowserHandle,
  FileBrowserProps,
  FileData as ChonkyFileData,
  FileHelper as ChonkyFileHelper,
  FullFileBrowser,
  I18nConfig,
  setChonkyDefaults,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '../box';
import { SupportedLocales } from '../models';
import localization from './localization';

import './file-picker.css';

export type FilePickerHandle = FileBrowserHandle;

export type FileActionData = ChonkyFileActionData;

export type FileArray = ChonkyFileArray;

export type FileData = ChonkyFileData;

export type FilePickerAction = FileAction;

export class FileHelper extends ChonkyFileHelper {}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const FilePickerActions = ChonkyActions;

export type FilePickerView = typeof FilePickerView[keyof typeof FilePickerView];
// eslint-disable-next-line @typescript-eslint/naming-convention
export const FilePickerView = {
  listView: ChonkyActions.EnableListView.id,
  gridView: ChonkyActions.EnableGridView.id,
} as const;

export interface FilePickerTheme {
  primary: string;
  background: string;
  surface: string;
  textOnBackground: string;
  selectionBackground: string;
}

// IMPLEMENTATION NOTES: Currently FilePicker component works with his own icon set.
// In future might be tweaked.
setChonkyDefaults({ iconComponent: ChonkyIconFA });

export interface FilePickerProps extends Partial<FileBrowserProps> {
  theme?: FilePickerTheme;
  styles?: Record<string, string>;
  defaultView?: FilePickerView;
  readOnlyMode?: boolean;
  locale?: SupportedLocales;
}

export const FilePicker = React.memo(
  React.forwardRef<FileBrowserHandle, FilePickerProps>(
    (
      {
        theme,
        styles = { height: '100%', minWidth: '600px' },
        defaultView = FilePickerView.listView,
        readOnlyMode = false,
        locale,
        files,
        folderChain,
        onFileAction,
        ...props
      },
      ref
    ) => {
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

      const toDashCase = (str: string): string => {
        return str.replace(/([A-Z])/g, ($1) => '-' + $1.toLowerCase());
      };

      const themeObject = useMemo((): Record<string, string> => {
        if (theme !== undefined) {
          const processedColors = Object.keys(theme).reduce(
            (acc: Record<string, string>, key) => {
              const val = ((theme as unknown) as Record<string, string>)[key];
              key = key.startsWith('--')
                ? key
                : `--fp-theme-${toDashCase(key)}`;
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
      const [fileActions, setFileActions] = useState<FilePickerAction[]>();
      const [i18n, setI18n] = useState<I18nConfig>();
      useEffect(() => {
        if (theme) {
          setDarkMode(true);
        }

        setDefaultFileViewActionId(defaultView);

        if (readOnlyMode) {
          setDisableDragAndDrop(true);
        } else {
          setFileActions([
            ChonkyActions.CreateFolder,
            ChonkyActions.DeleteFiles,
          ]);
        }

        if (locale !== undefined) {
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
            ref={ref}
            files={files ?? []}
            folderChain={folderChain}
            onFileAction={(data: FileActionData): void => {
              if (typeof onFileAction === 'function') {
                void onFileAction(data);
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
  )
);
