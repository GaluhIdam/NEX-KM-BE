import { AggregationsMultiBucketAggregateBase } from "@elastic/elasticsearch/lib/api/types";

export interface Aggregations {
    top_keywords: AggregationsMultiBucketAggregateBase<{ key: string }>
}