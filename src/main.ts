import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaLibraryService } from './core/services/prisma-nex-library.service';
import * as Events from 'events';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
    Events.setMaxListeners(100);
    const app = await NestFactory.create(AppModule, {
        logger:
            process.env.NODE_ENV === 'prod'
                ? ['error', 'warn', 'log']
                : ['error', 'warn', 'debug', 'log'],
    });

    // Enable CORS
    app.enableCors();

    const log = new Logger(bootstrap.name);
    const PORT = Number(process.env.APPLICATION_PORT) || 3000;

    // Validate request input stream
    // Untuk Validasi DTO
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // Versioning
    app.enableVersioning({
        type: VersioningType.URI,
    });

    // Enable shutdown for prisma service
    const _prismaPublic = app.get(PrismaLibraryService);

    await Promise.all([_prismaPublic.enableShutdownHook(app)]);

    // Connection for Pub/Sub via redis
    // ini optional untuk saat ini
    // app.connectMicroservice<MicroserviceOptions>({
    //   transport: Transport.REDIS,
    //   options: {
    //     host: `${process.env.REDIS_HOST}`,
    //     port: Number(process.env.REDIS_PORT),
    //   },
    // });

    await app.startAllMicroservices();
    await app.listen(PORT);

    // Untuk hot reload
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
    log.log(
        `Nex KM (${process.env.npm_package_version}) start on port ${PORT}`,
    );
}
bootstrap();
