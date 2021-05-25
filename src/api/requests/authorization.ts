import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosHelper } from "../../helpers/api";
import { jwtAsyncStorageKeyName } from "../../other/constants";
import { sendGetRequest, sendPostRequest } from "../methods";
import { GetResponse, PostResponse } from "../types";

export const loginAccount = async (login: string, password: string ): Promise<PostResponse> => {
  const response = await sendPostRequest('/auth/login', { login, password });
  if (!response.error && response.data) {
    await AsyncStorage.setItem(jwtAsyncStorageKeyName, response.data.accessToken);
    await AxiosHelper.updateAxiosInstance();
  }
  return response;
}

export const registerAccount = async (
  login: string,
  email: string,
  password: string,
): Promise<PostResponse> => {
  return sendPostRequest('/auth/register', {
    login,
    email,
    password,
  });
}

export const logoutAccount = async (): Promise<void> => {
  await AsyncStorage.setItem(jwtAsyncStorageKeyName, '');
  await AxiosHelper.updateAxiosInstance();
}

export const checkAuthStatus = (): Promise<GetResponse> => {
  return sendGetRequest('/auth/checkAuthStatus');
}
