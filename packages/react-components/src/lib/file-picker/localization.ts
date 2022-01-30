import { ChonkyActions, FileData, FileHelper, I18nConfig } from 'chonky';
import { IntlShape } from 'react-intl';

interface ILocalization {
  [key: string]: I18nConfig;
}

const russianI18n: I18nConfig = {
  locale: 'ru',
  formatters: {
    formatFileModDate: (intl: IntlShape, file: FileData | null): string | null => {
      const safeModDate = FileHelper.getModDate(file);
      if (safeModDate) {
        return `${intl.formatDate(safeModDate)}, ${intl.formatTime(
          safeModDate
        )}`;
      } else {
        return null;
      }
    },
    formatFileSize: (intl: IntlShape, file: FileData | null): string | null  => {
      if (!file || typeof file.size !== 'number') return null;
      return `Размер: ${file.size}`;
    },
  },
  messages: {
    'chonky.toolbar.searchPlaceholder': 'Поиск',
    'chonky.toolbar.visibleFileCount': `{fileCount, plural,
      one {# файл}
      few {# файла}
      many {# файлов}
    }`,
    'chonky.toolbar.selectedFileCount': `{fileCount, plural,
      =0 {}
      one {# выделен}
      other {# выделено}
    }`,
    'chonky.toolbar.hiddenFileCount': `{fileCount, plural,
      =0 {}
      one {# скрыт}
      other {# скрыто}
    }`,
    'chonky.fileList.nothingToShow': 'Здесь пусто!',
    'chonky.contextMenu.browserMenuShortcut': 'Меню браузера: {shortcut}',

    // Actions
    [`chonky.actionGroups.Actions`]: 'Действия',
    [`chonky.actionGroups.Options`]: 'Опции',
    [`chonky.actions.${ChonkyActions.OpenParentFolder.id}.button.name`]: 'Открыть родительскую папку',
    [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.name`]: 'Новая папка',
    [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.tooltip`]: 'Создать новую папку',
    [`chonky.actions.${ChonkyActions.DeleteFiles.id}.button.name`]: 'Удалить файлы',
    [`chonky.actions.${ChonkyActions.OpenSelection.id}.button.name`]: 'Открыть выделение',
    [`chonky.actions.${ChonkyActions.SelectAllFiles.id}.button.name`]: 'Выделить все',
    [`chonky.actions.${ChonkyActions.ClearSelection.id}.button.name`]: 'Сбросить выделение',
    [`chonky.actions.${ChonkyActions.EnableListView.id}.button.name`]: 'Показать список',
    [`chonky.actions.${ChonkyActions.EnableGridView.id}.button.name`]: 'Показать иконки',
    [`chonky.actions.${ChonkyActions.SortFilesByName.id}.button.name`]: 'Сорт. по имени',
    [`chonky.actions.${ChonkyActions.SortFilesBySize.id}.button.name`]: 'Сорт. по размеру',
    [`chonky.actions.${ChonkyActions.SortFilesByDate.id}.button.name`]: 'Сорт. по дате',
    [`chonky.actions.${ChonkyActions.ToggleHiddenFiles.id}.button.name`]: 'Скрытые файлы',
    [`chonky.actions.${ChonkyActions.ToggleShowFoldersFirst.id}.button.name`]: 'Папки в начале',
  },
};

const hebrewI18n: I18nConfig = {
  locale: 'he',
  formatters: {
    formatFileModDate: (intl: IntlShape, file: FileData | null): string | null => {
      const safeModDate = FileHelper.getModDate(file);
      if (safeModDate) {
        return `${intl.formatDate(safeModDate)}, ${intl.formatTime(
          safeModDate
        )}`;
      } else {
        return null;
      }
    },
    formatFileSize: (intl: IntlShape, file: FileData | null): string | null => {
      if (!file || typeof file.size !== 'number') return null;
      return `גודל: ${file.size}`;
    },
  },
  messages: {
    'chonky.toolbar.searchPlaceholder': 'חיפוש',
    'chonky.toolbar.visibleFileCount': `{fileCount, plural,
      one {# קובץ}
      few {# קבצים}
      many {# קבצים}
    }`,
    'chonky.toolbar.selectedFileCount': `{fileCount, plural,
      =0 {}
      one {# נבחר}
      other {# נבחרו}
    }`,
    'chonky.toolbar.hiddenFileCount': `{fileCount, plural,
      =0 {}
      one {# נסתר}
      other {# נסתרים}
    }`,
    'chonky.fileList.nothingToShow': 'ריק',
    'chonky.contextMenu.browserMenuShortcut': 'תפריט דפדפן: {shortcut}',

    // Actions
    [`chonky.actionGroups.Actions`]: 'פעולות',
    [`chonky.actionGroups.Options`]: 'אפשרויות',
    [`chonky.actions.${ChonkyActions.OpenParentFolder.id}.button.name`]: 'פתח סיפריית אב',
    [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.name`]: 'סיפרייה חדשה',
    [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.tooltip`]: 'צור סיפרייה חדשה',
    [`chonky.actions.${ChonkyActions.DeleteFiles.id}.button.name`]: 'מחק',
    [`chonky.actions.${ChonkyActions.OpenSelection.id}.button.name`]: 'פתח את הבחירה',
    [`chonky.actions.${ChonkyActions.SelectAllFiles.id}.button.name`]: 'בחר הכל',
    [`chonky.actions.${ChonkyActions.ClearSelection.id}.button.name`]: 'אפס את הבחירה',
    [`chonky.actions.${ChonkyActions.EnableListView.id}.button.name`]: 'תצוגת רשימה',
    [`chonky.actions.${ChonkyActions.EnableGridView.id}.button.name`]: 'תצוגת גריד',
    [`chonky.actions.${ChonkyActions.SortFilesByName.id}.button.name`]: 'מיון לפי שם',
    [`chonky.actions.${ChonkyActions.SortFilesBySize.id}.button.name`]: 'מיון לפי גודל',
    [`chonky.actions.${ChonkyActions.SortFilesByDate.id}.button.name`]: 'מיון לפי תאריך',
    [`chonky.actions.${ChonkyActions.ToggleHiddenFiles.id}.button.name`]: 'קבצים נסתרים',
    [`chonky.actions.${ChonkyActions.ToggleShowFoldersFirst.id}.button.name`]: 'הצגת תיקיות בראש הרשימה',
  },
};

const localization: ILocalization = {
  'ru': russianI18n,
  'he': hebrewI18n
};

export default localization;