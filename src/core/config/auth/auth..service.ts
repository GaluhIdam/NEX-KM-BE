import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { UserList } from '@prisma/clients/homepage';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthService extends AppError {
  constructor(private readonly prisma: PrismaHomepageService) {
    super(AuthService.name);
  }

  //Check Token
  async checkToken(token: string): Promise<boolean> {
    const result = await this.prisma.userList.findFirst({
      where: {
        token: token,
      },
    });
    const decodeToken = jwt.verify(result.token, 'nex-km', {
      algorithm: 'HS256',
    });
    if (decodeToken) {
      return true;
    } else {
      return false;
    }
  }

  // Generate Token
  async tokenGenerate(
    personalNumber: string,
    personalEmail: string,
  ): Promise<UserList> {
    const findData = await this.prisma.userList.findFirst({
      where: { personalNumber },
    });
    this.handlingErrorNotFound(
      findData,
      `${personalNumber} & ${personalEmail}`,
      'user',
    );
    const payload = { personalNumber, personalEmail };
    const secretKey = 'nex-km';

    const token = jwt.sign(payload, secretKey, { algorithm: 'HS256' });
    return await this.prisma.userList.update({
      where: {
        personalNumber: personalNumber,
      },
      data: {
        token: token,
      },
    });
  }

  // Delete Token
  async destroyToken(token: string): Promise<boolean> {
    const destroyed = await this.prisma.userList.update({
      where: {
        token: token,
      },
      data: {
        token: null,
      },
    });

    if (destroyed.token === null) {
      return true;
    } else {
      return false;
    }
  }
}
