import {
    Communities,
    CommunityActivities,
} from '@prisma/clients/nex-community';
export interface MergeCommunityDTO extends Communities, CommunityActivities {
    id: number;
    uuid: string;
    title: string;
    description: string;
    path: string;
    personalNumber: string;
}
