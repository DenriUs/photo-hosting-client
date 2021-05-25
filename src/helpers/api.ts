import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';
import { jwtAsyncStorageKeyName, mainAxiosRequestConfig } from '../other/constants';

export class AxiosHelper {
  private static axiosInstance: AxiosInstance;

  public static async updateAxiosInstance(): Promise<void> {
    this.axiosInstance = axios.create({
      ...mainAxiosRequestConfig,
      headers: {
        Authorization: `Bearer ${await AsyncStorage.getItem(jwtAsyncStorageKeyName)}`,
      },
    });
  }

  public static async getAxiosInstance(): Promise<AxiosInstance> {
    if (!this.axiosInstance) {
      await this.updateAxiosInstance();
    }
    return this.axiosInstance;
  }
}
