import { Response } from 'express';

export interface AuthControllerInterface {
  checkToken(res: Response, token: string): Promise<Response>;

  tokenGenerate(
    res: Response,
    personalNumber: string,
    personalEmail: string,
  ): Promise<Response>;

  destroyToken(res: Response, personalNumber: string): Promise<Response>;
}
