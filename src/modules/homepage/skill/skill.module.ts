import { Module } from '@nestjs/common';
import { SkillService } from './services/skill.service';
import { SkillController } from './controllers/skill.controller';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
  controllers: [SkillController],
  providers: [SkillService, PrismaHomepageService],
})
export class SkillModule { }
