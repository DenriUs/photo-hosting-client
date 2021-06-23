import { AxiosRequestConfig } from 'axios';
import logo from '../../assets/logo.png';

export const appLogo = logo;

export const FORM_ICON_SIZE = 20;
export const MODAL_ICON_SIZE = 60;

export const MODAL_ICON_SUCCESS_COLOR = '#fef1cb';
export const MODAL_ICON_ERROR_COLOR = '#f7623c';

export const jwtAsyncStorageKeyName = 'jwt';

export const maxProfileLoginLength = 25;
export const maxProfileEmailLength = 30;

const serverURL = 'https://4d725a2eef0e.ngrok.io';
const axiosTimeoutSeconds = 20;

export const mainAxiosRequestConfig: AxiosRequestConfig = {
  baseURL: serverURL,
  timeout: axiosTimeoutSeconds * 1000,
};
