import { Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { ArticleCommentServiceInterface } from '../interfaces/article-comment.service.interface';
import { PrismaLearningService } from 'src/core/services/prisma-nex-learning.service';
import { CommentArticle } from '@prisma/clients/nex-learning';
import { ArticleCommentDTO } from '../dtos/article-comment.dto';
import { ResponseDTO } from 'src/core/dtos/response.dto';

@Injectable()
export class ArticleCommentService
  extends AppError
  implements ArticleCommentServiceInterface
{
  constructor(private readonly prisma: PrismaLearningService) {
    super(ArticleCommentService.name);
  }

  //Get Comment
  async getComments(
    id_article: number,
    page: number,
    limit: number,
    sortBy: string,
  ): Promise<ResponseDTO<CommentArticle[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const by_order = [];

    if (sortBy === 'trending') {
      by_order.push({
        like: 'desc',
      });
      by_order.push({
        childComment: {
          _count: 'desc',
        },
      });
      by_order.push({
        createdAt: 'desc',
      });
    }

    if (sortBy === 'desc') {
      by_order.push({
        createdAt: 'desc',
      });
    }
    const findData = await this.prisma.article.findFirst({
      where: {
        id: id_article,
      },
    });
    this.handlingErrorNotFound(findData, id_article, 'Comment');
    const result = await this.prisma.commentArticle.findMany({
      where: {
        articleId: id_article,
        parentId: null,
      },
      orderBy: by_order,
      take: take,
      skip: skip,
      include: {
        commentLikeArticle: true,
        _count: {
          select: {
            childComment: true,
          },
        },
      },
    });

    this.handlingErrorEmptyData(result, 'Comment');
    const total = await this.prisma.commentArticle.count({
      where: {
        articleId: id_article,
        parentId: null,
      },
    });
    const data: ResponseDTO<CommentArticle[]> = {
      result: result,
      total: total,
    };
    return data;
  }

  //Get Child Comments
  async getChildComments(
    id_article: number,
    parentId: number,
    page: number,
    limit: number,
    sortBy: string,
  ): Promise<ResponseDTO<CommentArticle[]>> {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const by_order = [];

    if (sortBy === 'trending') {
      by_order.push({
        like: 'desc',
      });
      by_order.push({
        dislike: 'desc',
      });
      by_order.push({
        createdAt: 'desc',
      });
    }

    if (sortBy == 'recent') {
      by_order.push({
        createdAt: 'desc',
      });
    }
    const result = await this.prisma.commentArticle.findMany({
      where: {
        articleId: id_article,
        parentId: parentId,
      },
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
      take: take,
      skip: skip,
      include: {
        commentLikeArticle: true,
        _count: {
          select: {
            commentLikeArticle: true,
          },
        },
      },
    });
    this.handlingErrorEmptyData(result, 'Child Comment');
    const total = await this.prisma.commentArticle.count({
      where: {
        articleId: id_article,
        parentId: parentId,
      },
    });
    const data: ResponseDTO<CommentArticle[]> = {
      result: result,
      total: total,
    };
    return data;
  }

  //Create Comment
  async createComments(dto: ArticleCommentDTO): Promise<CommentArticle> {
    const findData = await this.prisma.article.findFirst({
      where: {
        id: dto.articleId,
      },
    });
    this.handlingErrorNotFound(findData, dto.articleId, 'Article Comment');
    return await this.prisma.commentArticle.create({
      data: {
        articleId: dto.articleId,
        comment: dto.comment,
        parentId: dto.parentId,
        personalName: dto.personalName,
        personalNumber: dto.personalNumber,
        like: 0,
        dislike: 0,
        personalNameMention: dto.personalNameMention,
        personalNumberMention: dto.personalNumberMention,
      },
    });
  }

  //Update Comment
  async updateComments(
    uuid: string,
    dto: ArticleCommentDTO,
  ): Promise<CommentArticle> {
    const findData = await this.prisma.commentArticle.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Comment');
    return await this.prisma.commentArticle.update({
      where: {
        uuid: uuid,
      },
      data: {
        comment: dto.comment,
      },
    });
  }

  //Delete Comment
  async deleteComments(uuid: string): Promise<CommentArticle> {
    const findData = await this.prisma.commentArticle.findFirst({
      where: {
        uuid: uuid,
      },
    });
    this.handlingErrorNotFound(findData, uuid, 'Comment');
    return await this.prisma.commentArticle.delete({
      where: {
        uuid: uuid,
      },
    });
  }
}
