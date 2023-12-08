import { Article, BestPractice } from '@prisma/clients/nex-learning';
export interface MergeLearningDTO extends Article, BestPractice {
    id: null,
    uuid: string,
    title: string,
    description: string,
    path: string,
    unit: string,
    personalNumber: string,
}