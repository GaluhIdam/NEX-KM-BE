import { Module } from '@nestjs/common';
import { ArticleCategoryService } from './services/article-category.service';
import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';
import { ArticleCategoryController } from './controllers/article-category.controller';
import { ArticleService } from './services/article.service';
import { ArticleController } from './controllers/article.controller';
import { ArticleCommentController } from './controllers/article-comment.controller';
import { ArticleCommentService } from './services/article-comment.service';
import { ArticleCommentLikeService } from './services/article-comment-like.service';
import { ArticleCommentLikeController } from './controllers/article-comment-like.controller';
import { ArticlesearchService } from './services/articlesearch.service';
import { ElasticModule } from 'src/modules/elasticsearch/elastic/elastic.module';
import { LearningFuseModule } from '../fuse/learning.fuse.module';
import { LearningFuseService } from '../fuse/learning.fuse.service';
import { ForYourPageService } from 'src/modules/homepage/for-your-page/services/for-your-page.service';
import { PrismaHomepageService } from 'src/core/services/prisma-homepage.service';

@Module({
    imports: [ElasticModule, LearningFuseModule],
    controllers: [
        ArticleCategoryController,
        ArticleController,
        ArticleCommentController,
        ArticleCommentLikeController,
    ],
    providers: [
        ArticleCategoryService,
        PrismaLearningService,
        ArticleService,
        ArticleCommentService,
        ArticleCommentLikeService,
        ArticlesearchService,
        LearningFuseService,
        ForYourPageService,
        PrismaHomepageService,
    ],
})
export class ArticlesModule {}
