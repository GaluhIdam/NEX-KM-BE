import { VoteForum } from '@prisma/clients/nex-talk';

export interface ForumVoteServiceInterface {
    getForumVote(forumId: number): Promise<VoteForum[]>;
}
