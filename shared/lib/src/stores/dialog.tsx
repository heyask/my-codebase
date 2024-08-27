import { atom } from 'recoil';

export const dialogState = atom<{
  show?: boolean;
  isLoading?: boolean;
  title?: string | any;
  content?: string | any;
  severity?: 'error' | 'warning' | 'info' | 'success';
  duration?: number;
  onClickYes?: () => void;
  yesText?: string;
  onClickNo?: () => void;
  noText?: string;
  onClose?: () => void;
  closeText?: string;
  hideCloseButton?: boolean;
}>({
  key: 'dialogState',
  default: {
    show: false,
    isLoading: false,
    title: undefined,
    content: undefined,
    severity: undefined,
    duration: undefined,
    onClickYes: undefined,
    yesText: undefined,
    onClickNo: undefined,
    noText: undefined,
    onClose: undefined,
    closeText: undefined,
    hideCloseButton: undefined,
  },
  effects: [
    ({ setSelf, onSet }) => {
      onSet(async (newValue, oldValue) => {
        if (!newValue.show) {
          setSelf({
            ...newValue,
            title: undefined,
            content: undefined,
            severity: undefined,
            duration: undefined,
            isLoading: undefined,
            onClickYes: undefined,
            yesText: undefined,
            onClickNo: undefined,
            noText: undefined,
            onClose: undefined,
            closeText: undefined,
            hideCloseButton: undefined,
          });
        }
      });
    },
  ],
});
