import { AuthModalState } from '../redux/types';

export type TopTabBarConfig = {
  tabName?: string;
  render: JSX.Element;
}

export type MainAuthModalStateConfig = {
  authModalState: AuthModalState;
  submitName: string;
  modalHeigh: number;
};

export type AuthModalStateConfig = MainAuthModalStateConfig & TopTabBarConfig;
