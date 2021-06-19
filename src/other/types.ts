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

export type ExifData = {
  cameraModel: string,
  apertureValue: number,
  exposureTime: number,
  focalLenght: number,
  iso: number,
  creationDate: string,
  width: number,
  height: number,
  latitude: number,
  longitude: number,
}
