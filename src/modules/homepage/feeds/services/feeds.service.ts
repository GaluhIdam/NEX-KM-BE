/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { FeedsServiceInterface } from '../interfaces/feeds.service.interface';
import {
    FeedsBoolQuery,
    FeedsResultDTO,
    QueryParams,
} from '../dtos/feeds.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchHitsMetadata } from '@elastic/elasticsearch/lib/api/types';
import { EsIndex } from 'src/core/enums';

@Injectable()
export class FeedsService implements FeedsServiceInterface {
    constructor(private esService: ElasticsearchService) { }

    async getFeeds(
        personnelNumber: string,
        query: QueryParams,
    ): Promise<SearchHitsMetadata<FeedsResultDTO>> {
        const { EBOOKS_INDEX, ALBUMS_INDEX, ARTICLES_INDEX, PODCAST_INDEX } =
            EsIndex;
        const { approvalStatus, approvalStatusBool, bannedStatus, status, page, size } =
            query;

        let bool: FeedsBoolQuery; // Query for elasticsearch

        const isApproved: boolean = ['Approved'].includes(approvalStatus);
        const isNotBanned = !bannedStatus;
        const isApprovedBool: boolean = approvalStatusBool;

        // Jika feeds dilihat oleh user lain maka tampilkan yg status = true, bannedStatus = false, approvalStatus = 'Approved'/true
        if (isApproved && isNotBanned && isApprovedBool) {
            bool = {
                should: [
                    {
                        bool: {
                            must: [
                                { match: { personalNumber: personnelNumber } },
                                {
                                    match: {
                                        'approvalStatus.keyword':
                                            approvalStatus,
                                    },
                                },
                                { term: { status: status } },
                            ],
                        },
                    },
                    {
                        bool: {
                            must: [
                                { match: { personalNumber: personnelNumber } },
                                {
                                    term: {
                                        approvalStatus: approvalStatusBool,
                                    },
                                },
                                { term: { bannedStatus: bannedStatus } },
                            ],
                        },
                    },
                ],
            };
        } else {
            bool = {
                must: [{ match: { personalNumber: personnelNumber } }],
            };
        }

        const { hits } = await this.esService.search<FeedsResultDTO>({
            index: [EBOOKS_INDEX, ALBUMS_INDEX, ARTICLES_INDEX, PODCAST_INDEX],
            from: (page - 1) * size,
            size,
            query: {
                bool,
            },
            sort: [
                {
                    createdAt: {
                        order: 'desc',
                        format: 'strict_date_optional_time_nanos',
                    },
                },
            ],
        });

        return hits;
    }
}
