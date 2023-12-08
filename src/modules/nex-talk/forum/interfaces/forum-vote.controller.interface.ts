import { Response } from 'express';

export interface ForumVoteControllerInterface {
    getForumVote(res: Response, forumId: number): Promise<Response>;
}
