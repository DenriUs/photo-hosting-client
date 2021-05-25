import { ServerResponse } from './types';
import { AxiosHelper } from '../helpers/api';

enum Methods {
  GET = 'GET',
  POST = 'POST',
};

const sendRequest = async (
  method: Methods,
  endpoint: string,
  data?: {},
): Promise<ServerResponse> => {
  const axiosInstance = await AxiosHelper.getAxiosInstance();
  try {
    const responseData = (await axiosInstance.request({method, url: endpoint, data})).data;
    return { data: responseData };
  } catch (error) {
    return { error: error.response.data.message || error.response.data };
  }
};

export const sendGetRequest = (endpoint: string, data?: {}): Promise<ServerResponse> => {
  return sendRequest(Methods.GET, endpoint, data);
};
  
export const sendPostRequest = (endpoint: string, data?: {}): Promise<ServerResponse> => {
  return sendRequest(Methods.POST, endpoint, data);
};
