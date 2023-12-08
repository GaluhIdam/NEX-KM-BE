import { RedeemModule } from './modules/nex-level/redeem/redeem.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './modules/nex-library/album/album.module';
import { PrismaLibraryService } from './core/services/prisma-nex-library.service';
import { EbookModule } from './modules/nex-library/ebook/ebook.module';
import { BullModule } from '@nestjs/bull';
import { GetFileModule } from './core/get-file/get-file.module';
import { NexRoleModule } from './modules/homepage/nex-role/nex-role.module';
import { NexTeamModule } from './modules/homepage/nex-team/nex-team.module';
import { SliderModule } from './modules/homepage/slider/slider.module';
import { CommunityActivityModule } from './modules/nex-community/community-activity/community-activity.module';
import { CommunityFollowModule } from './modules/nex-community/community-follow/community-follow.module';
import { CommunityMemberModule } from './modules/nex-community/community-member/community-member.module';
import { CommunityRoleModule } from './modules/nex-community/community-role/community-role.module';
import { CommunityModule } from './modules/nex-community/community/community.module';
import { MerchandiseModule } from './modules/nex-level/merchandise/merchandise.module';
import { MilesModule } from './modules/nex-level/miles/miles.module';
import { PointConfigModule } from './modules/nex-level/point-config/point-config.module';
import { PrismaCommunityService } from './core/services/prisma-nex-community.service';
import { PrismaLevelService } from './core/services/prisma-nex-level.service';
import { WebDirectoryModule } from './modules/nex-library/web-directory/web-directory.module';
import { ForumModule } from './modules/nex-talk/forum/forum.module';
import { PrismaTalkService } from './core/services/prisma-nex-talk.service';
import { PodcastModule } from './modules/nex-talk/podcast/podcast.module';
import { StreamModule } from './modules/nex-talk/stream/stream.module';
import { ArticlesModule } from './modules/nex-learning/articles/articles.module';
import { PrismaLearningService } from './core/services/prisma-nex-learning.service';
import { VideoUploadModule } from './core/utility/video-upload/video-upload.module';
import { AudioUploadModule } from './core/utility/audio-upload/audio-upload.module';
import { StoriesModule } from './modules/nex-learning/stories/stories.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharingExpModule } from './modules/homepage/sharing-exp/sharing-exp.module';
import { NotificationModule } from './modules/homepage/notification/notification.module';
import { InterestModule } from './modules/homepage/interest/interest.module';
import { SkillModule } from './modules/homepage/skill/skill.module';
import { PointModule } from './modules/nex-level/point/point.module';
import { BestPracticeModule } from './modules/nex-learning/best-practice/best-practice.module';
import { PrismaHomepageService } from './core/services/prisma-homepage.service';
import { UserListModule } from './modules/homepage/user-list/user-list.module';
import { GlobalSearchHomepageModule } from './modules/elasticsearch/global-search-homepage/global-search-homepage.module';
import { PermissionGuard } from './core/config/permission-guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './core/config/auth/auth..service';
import { AuthController } from './core/config/auth/auth.controller';
import { RolePermissionModule } from './modules/homepage/roles/role-permission.module';
import { PermissionModule } from './modules/homepage/permission/permission.module';
import { EurekaModule } from 'nestjs-eureka';
import { FeedsModule } from './modules/homepage/feeds/feeds.module';
import { LearningFuseModule } from './modules/nex-learning/fuse/learning.fuse.module';
import { CommunityActivityCommentModule } from './modules/nex-community/community-activity-comment/community-activity-comment.module';
import { CommunityActivityLikeModule } from './modules/nex-community/community-activity-like/community-activity-like.module';
import { CommunityFuseModule } from './modules/nex-community/fuse/community-fuse.module';
import { ForYourPageModule } from './modules/homepage/for-your-page/for-your-page.module';
import { HomepageFuseModule } from './modules/fuse/homepage-fuse.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                },
            }),
            inject: [ConfigService],
        }),
        // EurekaModule.forRoot({
        //   disable: false,
        //   disableDiscovery: false,
        //   eureka: {
        //     host: process.env.EUREKA_HOST || 'localhost',
        //     port: Number(process.env.EUREKA_PORT) || 8761,
        //     registryFetchInterval: Number(process.env.EUREKA_INTERVAL) || 1000,
        //     servicePath: '/eureka/apps',
        //     maxRetries: 3,
        //   },
        //   service: {
        //     host: 'localhost',
        //     name: process.env.APPLICATION_NAME,
        //     port: Number(process.env.APPLICATION_PORT) || 8000,
        //   },
        // }),

        AlbumModule,
        EbookModule,
        GetFileModule,
        NexRoleModule,
        NexTeamModule,
        SliderModule,
        CommunityModule,
        CommunityActivityModule,
        CommunityFollowModule,
        CommunityMemberModule,
        CommunityRoleModule,
        MerchandiseModule,
        MilesModule,
        PointConfigModule,
        RedeemModule,
        WebDirectoryModule,
        ForumModule,
        PodcastModule,
        StreamModule,
        ArticlesModule,
        VideoUploadModule,
        AudioUploadModule,
        StoriesModule,
        SharingExpModule,
        NotificationModule,
        InterestModule,
        SkillModule,
        PointModule,
        BestPracticeModule,
        UserListModule,
        GlobalSearchHomepageModule,
        RolePermissionModule,
        PermissionModule,
        FeedsModule,
        LearningFuseModule,
        CommunityActivityCommentModule,
        CommunityActivityLikeModule,
        CommunityFuseModule,
        ForYourPageModule,
        HomepageFuseModule,
    ],
    controllers: [AppController, AuthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: PermissionGuard,
        },
        AppService,
        PrismaLibraryService,
        PrismaCommunityService,
        PrismaLevelService,
        PrismaTalkService,
        PrismaLearningService,
        PrismaLevelService,
        PrismaHomepageService,
        AuthService,
    ],
})
export class AppModule { }
