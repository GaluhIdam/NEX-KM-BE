import {
    INestApplication,
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/clients/nex-learning';

@Injectable()
export class PrismaLearningService extends PrismaClient implements OnModuleInit {
    private logger: Logger;

    constructor() {
        super({ log: ['info'] });
        this.logger = new Logger();
    }
    async onModuleInit() {
        this.logger.log(`Database connection occured ${Math.random()}`);
        await this.$connect();
    }

    async enableShutdownHook(app: INestApplication): Promise<void> {
        this.$on('beforeExit', async () => {
            this.logger.log('Prisma Nex Library shutting down...');
            await app.close();
        });
    }
}
