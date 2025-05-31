import { HttpStatus } from '@nestjs/common';

type TResponse<T> = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data: T;
};

export const sendResponse = <T>({
  statusCode = HttpStatus.OK,
  success = true,
  message = '',
  data,
}: TResponse<T>) => {
  return {
    statusCode,
    success,
    message,
    data,
  };
};
