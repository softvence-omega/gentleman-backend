// src/common/types/raw-body-request.ts
import { Request } from 'express';

export interface RawBodyRequest<T = Request> extends Request {
  rawBody: Buffer;
}
