import { Test, TestingModule } from '@nestjs/testing';
import { ForumCommentLikeService } from './forum-comment-like.service';

describe('ForumCommentLikeService', () => {
    let service: ForumCommentLikeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ForumCommentLikeService],
        }).compile();

        service = module.get<ForumCommentLikeService>(ForumCommentLikeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
