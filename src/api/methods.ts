import { ServerResponse } from './types';
import { AxiosHelper } from '../helpers/api';

enum Methods {
  GET = 'GET',
  POST = 'POST',
};

const httpServerErrorFirstDigit = 5;

const sendRequest = async (
  method: Methods,
  endpoint: string,
  data?: {},
): Promise<ServerResponse> => {
  const axiosInstance = await AxiosHelper.getAxiosInstance();
  try {
    const response = await axiosInstance.request({method, url: endpoint, data});
    return { data: response.data };
  } catch (error) {
    return {
      error: error.response.data.message || error.response.data,
      isServerError: Math.floor(error.response.status / 100) === httpServerErrorFirstDigit,
    };
  }
};

export const sendGetRequest = (endpoint: string, data?: {}): Promise<ServerResponse> => {
  return sendRequest(Methods.GET, endpoint, data);
};
  
export const sendPostRequest = (endpoint: string, data?: {}): Promise<ServerResponse> => {
  return sendRequest(Methods.POST, endpoint, data);
};
