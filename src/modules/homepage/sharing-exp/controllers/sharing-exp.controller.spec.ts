import { Test, TestingModule } from '@nestjs/testing';
import { SharingExpController } from './sharing-exp.controller';
import { SharingExpService } from '../services/sharing-exp.service';

describe('SharingExpController', () => {
  let controller: SharingExpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharingExpController],
      providers: [SharingExpService],
    }).compile();

    controller = module.get<SharingExpController>(SharingExpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
