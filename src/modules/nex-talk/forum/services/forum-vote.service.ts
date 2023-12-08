import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppError } from 'src/core/errors/app.error';
import { PrismaTalkService } from 'src/core/services/prisma-nex-talk.service';
import { VoteForum } from '@prisma/clients/nex-talk';
import { ForumVoteServiceInterface } from '../interfaces/forum-vote.service.interface';
import { ForumVoteDTO } from '../dtos/forum-vote.dto';

@Injectable()
export class ForumVoteService
    extends AppError
    implements ForumVoteServiceInterface
{
    constructor(private readonly prisma: PrismaTalkService) {
        super(ForumVoteService.name);
    }

    //Get Forum Vote
    async getForumVote(forumId: number): Promise<VoteForum[]> {
        const findForum = await this.prisma.forum.findFirst({
            where: {
                id: forumId,
            },
        });
        this.handlingErrorNotFound(findForum, forumId, 'Forum');

        const result = await this.prisma.voteForum.findMany({
            where: {
                forumId: forumId,
            },
        });

        this.handlingErrorEmptyData(result, 'Forum Vote');
        return result;
    }

    // Check & Create & Update
    async bulkUpdateForumVote(dto: ForumVoteDTO): Promise<VoteForum> {
        const forumData = await this.prisma.forum.findFirst({
            where: {
                id: dto.forumId,
            },
        });
        this.handlingErrorNotFound(forumData, dto.forumId, 'Forum');

        const forumVoteData = await this.prisma.voteForum.findFirst({
            where: {
                forumId: dto.forumId,
                personalNumber: dto.personalNumber,
            },
        });

        if (forumVoteData === null) {
            // Create
            const voteForum: VoteForum = await this.prisma.voteForum.create({
                data: {
                    forumId: dto.forumId,
                    personalNumber: dto.personalNumber,
                    isUpvote: dto.isUpvote,
                },
            });

            return voteForum;
        } else {
            // Update
            this.handlingSameVoteBeforeUpdate(
                forumVoteData.uuid,
                forumVoteData.isUpvote,
                dto.isUpvote,
            );

            const voteForum: VoteForum = await this.prisma.voteForum.update({
                where: {
                    uuid: forumVoteData.uuid,
                },
                data: {
                    isUpvote: dto.isUpvote,
                },
            });

            return voteForum;
        }
    }

    handlingSameVoteBeforeUpdate(
        uuidData: string,
        isUpVoteData: boolean,
        isUpvoteRequest: boolean,
    ) {
        if (isUpVoteData === isUpvoteRequest) {
            const errors_message = {
                code: 406,
                'UUID/ID': uuidData,
                message: `Sorry, you have already given ${
                    isUpvoteRequest ? 'up vote' : 'down vote'
                } on the selected forum!`,
                data: null,
            };
            throw new HttpException(errors_message, HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
