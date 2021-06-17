export type ServerResponse = {
  data?: any;
  error?: {
    message: string;
    isServerError?: boolean;
  };
};

export type GetResponse = ServerResponse;

export type PostResponse = {
  error?: string;
  isServerError?: boolean;
};

export type RejectedValue = {
  error: string;
  isServerError?: boolean;
}
