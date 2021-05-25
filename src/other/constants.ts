import { AxiosRequestConfig } from 'axios';
import logo from '../../assets/logo.png';

export const appLogo = logo;

export const FORM_ICON_SIZE = 20;

export const jwtAsyncStorageKeyName = 'jwt';

const serverURL = 'https://5f07ae9a30c0.ngrok.io';
const axiosTimeoutSeconds = 20;

export const mainAxiosRequestConfig: AxiosRequestConfig = {
  baseURL: serverURL,
  timeout: axiosTimeoutSeconds * 1000,
}
