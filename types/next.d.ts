import { NextApiRequest } from 'next';

export interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}
