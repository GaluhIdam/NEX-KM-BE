import { Module } from '@nestjs/common';
import { PrismaTalkService } from 'src/core/services/prisma-nex-talk.service';
import { ForumService } from './services/forum.service';
import { ForumController } from './controllers/forum.controller';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';
import { ElasticModule } from 'src/modules/elasticsearch/elastic/elastic.module';
import { ForumsearchService } from './services/forum-search.service';
import { ForumVoteController } from './controllers/forum-vote.controller';
import { ForumVoteService } from './services/forum-vote.service';
import { ForumCommentLikeService } from './services/forum-comment-like.service';
import { ForumCommentLikeController } from './controllers/forum-comment-like';

@Module({
    imports: [ElasticModule],
    providers: [
        PrismaTalkService,
        ForumService,
        CommentService,
        ForumsearchService,
        ForumVoteService,
        ForumCommentLikeService,
    ],
    controllers: [
        ForumController,
        CommentController,
        ForumVoteController,
        ForumCommentLikeController,
    ],
})
export class ForumModule {}
