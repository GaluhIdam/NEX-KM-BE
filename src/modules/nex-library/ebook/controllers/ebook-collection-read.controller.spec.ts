import { Test, TestingModule } from '@nestjs/testing';
import { EbookCollectionController } from './ebook-collection-read.controller';

describe('EbookCollectionController', () => {
  let controller: EbookCollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EbookCollectionController],
    }).compile();

    controller = module.get<EbookCollectionController>(EbookCollectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
