import { ServerResponse } from './types';
import { AxiosHelper } from '../helpers/api';

enum Methods {
  GET = 'GET',
  POST = 'POST',
}

const httpServerErrorFirstDigit = 5;

const unauthrorizedStatusCode = 401;

const sendRequest = async (
  method: Methods,
  endpoint: string,
  data?: {},
  headers?: {},
): Promise<ServerResponse> => {
  const axiosInstance = await AxiosHelper.getAxiosInstance();
  try {
    const response = await axiosInstance.request({ method, url: endpoint, data, headers });
    return { data: response.data };
  } catch (error) {
    return {
      error: {
        message:
          error.response.status !== unauthrorizedStatusCode
            ? error.response.data.message || error.response.data
            : '',
        isServerError: Math.floor(error.response.status / 100) === httpServerErrorFirstDigit,
      },
    };
  }
};

export const sendGetRequest = (
  endpoint: string,
  data?: {},
  headers?: {},
): Promise<ServerResponse> => {
  return sendRequest(Methods.GET, endpoint, data, headers);
};

export const sendPostRequest = (
  endpoint: string,
  data?: {},
  headers?: {},
): Promise<ServerResponse> => {
  return sendRequest(Methods.POST, endpoint, data, headers);
};
