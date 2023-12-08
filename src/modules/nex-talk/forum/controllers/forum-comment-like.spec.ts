import { Test, TestingModule } from '@nestjs/testing';
import { ForumCommentLikeController } from './forum-comment-like';

describe('ForumCommentLikeController', () => {
    let controller: ForumCommentLikeController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ForumCommentLikeController],
        }).compile();

        controller = module.get<ForumCommentLikeController>(
            ForumCommentLikeController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
