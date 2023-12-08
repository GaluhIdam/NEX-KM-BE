import { Module } from '@nestjs/common';
import { UserListService } from './services/user-list.service';
import { UserListController } from './controllers/user-list.controller';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';
import { PointModule } from 'src/modules/nex-level/point/point.module';

@Module({
    providers: [UserListService, PrismaHomepageService],
    controllers: [UserListController],
    imports: [
      PointModule
    ],
})
export class UserListModule {}
