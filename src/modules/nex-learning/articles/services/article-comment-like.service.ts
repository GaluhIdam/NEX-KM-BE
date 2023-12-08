import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { ArticleCommentLikeServiceInterface } from '../interfaces/article-comment-like.service.interface';
import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';
import { CommentLikeArticle } from '@prisma/clients/nex-learning';
import { ArticleCommentLikeDTO } from '../dtos/article-comment-like.dto';

@Injectable()
export class ArticleCommentLikeService
  extends AppError
  implements ArticleCommentLikeServiceInterface {
  constructor(private readonly prisma: PrismaLearningService) {
    super(ArticleCommentLikeService.name);
  }

  async likeDislikeComment(
    articleId: number,
    commentArticleId: number,
    personalNumber: string,
    dto: ArticleCommentLikeDTO,
  ): Promise<CommentLikeArticle> {
    const findData = await this.prisma.commentLikeArticle.findFirst({
      where: {
        articleId: Number(articleId),
        commentArticleId: Number(commentArticleId),
        personalNumber: personalNumber,
      },
    });

    if (findData) {
      const total = await this.prisma.commentArticle.findFirst({
        where: {
          id: Number(commentArticleId),
        },
      });
      if (findData.likeOrdislike == dto.likeOrdislike) {
        if (findData.likeOrdislike == true) {
          await this.prisma.commentArticle.update({
            where: {
              id: Number(commentArticleId),
            },
            data: {
              like: total.like - 1,
              // dislike: total.dislike - 1
            },
          });
          return await this.prisma.commentLikeArticle.delete({
            where: {
              id: findData.id,
            },
          });
        }
        if (findData.likeOrdislike == false) {
          await this.prisma.commentArticle.update({
            where: {
              id: Number(commentArticleId),
            },
            data: {
              // like: total.like - 1,
              dislike: total.dislike - 1
            },
          });
          return await this.prisma.commentLikeArticle.delete({
            where: {
              id: findData.id,
            },
          });
        }
      }
      if (findData.likeOrdislike != dto.likeOrdislike) {
        if (dto.likeOrdislike == true) {
          await this.prisma.commentArticle.update({
            where: {
              id: Number(commentArticleId),
            },
            data: {
              like: total.like + 1,
              dislike: total.dislike - 1
            },
          });
          return await this.prisma.commentLikeArticle.update({
            where: {
              id: findData.id,
            },
            data: {
              ...dto,
            },
          });
        }
        if (dto.likeOrdislike == false) {
          await this.prisma.commentArticle.update({
            where: {
              id: Number(commentArticleId),
            },
            data: {
              like: total.like - 1,
              dislike: total.dislike + 1
            },
          });
          return await this.prisma.commentLikeArticle.update({
            where: {
              id: findData.id,
            },
            data: {
              ...dto,
            },
          });
        }
      }
    }

    if (!findData) {
      const total = await this.prisma.commentArticle.findFirst({
        where: {
          id: Number(commentArticleId),
        },
      });
      if (dto.likeOrdislike == true) {
        await this.prisma.commentArticle.update({
          where: {
            id: Number(commentArticleId),
          },
          data: {
            like: total.like + 1,
            // dislike: total.dislike - 1
          },
        });
        return await this.prisma.commentLikeArticle.create({
          data: {
            ...dto,
          },
        });
      }
      if (dto.likeOrdislike == false) {
        await this.prisma.commentArticle.update({
          where: {
            id: Number(commentArticleId),
          },
          data: {
            // like: total.like - 1,
            dislike: total.dislike + 1
          },
        });
        return await this.prisma.commentLikeArticle.create({
          data: {
            ...dto,
          },
        });
      }
    }
  }
}