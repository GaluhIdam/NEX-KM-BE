import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  Put,
  Query,
  Body,
  Delete,
} from '@nestjs/common';

import { BaseController } from 'src/core/controllers/base.controller';
import { Response } from 'express';
import { AuthService } from './auth..service';
import { AuthDTO } from './auth.dto';

@Controller({ path: 'api/auth', version: '1' })
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super(AuthController.name);
  }

  @Post('login')
  async tokenGenerate(
    @Res() res: Response,
    @Body() dto: AuthDTO,
  ): Promise<Response> {
    try {
      const user = await this.authService.tokenGenerate(
        dto.personalNumber,
        dto.personalEmail,
      );
      return res
        .status(200)
        .send(this.responseMessage('generate token', 'Create', 200, user));
    } catch (error) {
      throw error;
    }
  }

  @Get('check/:token')
  async checkToken(
    @Res() res: Response,
    @Param('token') token: string,
  ): Promise<Response> {
    try {
      if (!token) {
        return res.status(401).send({
          error: 'Unauthorized',
          message: 'Please fill token',
        });
      }
      const isValid = await this.authService.checkToken(token);
      return res
        .status(200)
        .send(this.responseMessage('checking token', 'Get', 200, isValid));
    } catch (error) {
      return res.status(400).send({ error: 'Failed to check token' });
    }
  }

  @Delete('logout/:token')
  async destroyToken(
    @Res() res: Response,
    @Param('token') token: string,
  ): Promise<Response> {
    try {
      const success = await this.authService.destroyToken(token);
      return res
        .status(200)
        .send(this.responseMessage('delete token', 'Delete', 200, success));
    } catch (error) {
      return res.status(400).send({ error: 'Failed to destroy token' });
    }
  }
}
