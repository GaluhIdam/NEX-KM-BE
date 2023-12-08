import { ClientOptions } from '@elastic/elasticsearch';
import { ElasticsearchOptionsFactory } from '@nestjs/elasticsearch';

export class ElasticsearchConfigService implements ElasticsearchOptionsFactory {
  createElasticsearchOptions(): ClientOptions | Promise<ClientOptions> {
    return {
      node: 'http://172.16.41.107:9200',
    };
  }
}
