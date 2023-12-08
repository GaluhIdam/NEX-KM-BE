import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { BaseController } from 'src/core/controllers/base.controller';
import { Response } from 'express';
import { ForumVoteService } from '../services/forum-vote.service';
import { ForumVoteControllerInterface } from '../interfaces/forum-vote.controller.interface';
import { ForumVoteDTO } from '../dtos/forum-vote.dto';

@Controller({ path: 'api/forum-vote', version: '1' })
export class ForumVoteController
    extends BaseController
    implements ForumVoteControllerInterface
{
    constructor(private readonly forumVote: ForumVoteService) {
        super(ForumVoteController.name);
    }

    //Get All Forum Vote by Forum ID
    @Get('/:forum_id')
    async getForumVote(
        @Res() res: Response<any, Record<string, any>>,
        @Param('forum_id') forumId: number,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            const forumVotes = await this.forumVote.getForumVote(forumId);
            return res
                .status(200)
                .send(
                    this.responseMessage('Forum Vote', 'Get', 201, forumVotes),
                );
        } catch (error) {
            throw error;
        }
    }

    //Check & Create & Update
    @Post('/updates')
    async updateForumVote(
        @Res() res: Response<any, Record<string, any>>,
        @Body() dto: ForumVoteDTO,
    ): Promise<Response<any, Record<string, any>>> {
        try {
            await this.errorsValidation(ForumVoteDTO, dto);
            const result = await this.forumVote.bulkUpdateForumVote(dto);
            return res
                .status(200)
                .send(
                    this.responseMessage(
                        'Forum Vote',
                        'Bulk Update',
                        200,
                        result,
                    ),
                );
        } catch (error) {
            throw error;
        }
    }
}
