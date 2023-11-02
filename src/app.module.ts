import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoticeModule } from './notice/notice.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { Account } from './database/produce_entity/account.entity';
import { Verification } from './account/entities/verification.entity';
import { ProjectAuth } from './account/entities/projectAuth.entity';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { ProjectModule } from './project/project.module';
import { Project } from './database/produce_entity/project.entity';
import { ProjectDetail } from './database/produce_entity/project-detail.entity';
import { FileModule } from './file/file.module';
import { CommonModule } from './common/common.module';
import { TextLocalize } from './common/entities/text-localize.entity';
import { StandardInfo } from './common/entities/standard-info.entity';
import { ResourceUploaderModule } from './resource-uploader/resource-uploader.module';
import { ResourceManagerModule } from './resource-manager/resource-manager.module';

import { ResourceManagerService } from './resource-manager/resource-manager.service';
import { DiscardResource } from './resource-manager/entities/discard-resource.entity';

import { ImageLocalization } from './resource-manager/entities/image-localization.entity';
import { StoryStaticImage } from './resource-manager/entities/story-static-image.entity';
import { PublicExtension } from './resource-manager/entities/public-extension.entity';
import { LiveResource } from './resource-manager/entities/live-resource.entity';
import { MigrationModule } from './migration/migration.module';
import { LiveResourceDetail } from './resource-manager/entities/live-resource-detail.entity';
import { ProfileModule } from './profile/profile.module';
import { AssetStockModule } from './asset-stock/asset-stock.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
      envFilePath: '.env.dev',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PWD,
      database: process.env.MYSQL_DB_NAME,
      entities: [
        Verification,
        ProjectAuth,
        TextLocalize,
        StandardInfo,
        DiscardResource,
        ImageLocalization,
        StoryStaticImage,
        PublicExtension,
        LiveResource,
        LiveResourceDetail,
        __dirname + '/database/**/*.entity.*',
      ],
      synchronize: process.env.NODE_ENV !== 'prod', // 자동으로 entity를 읽어서 migration..
      logging: false,
      timezone: 'local',
    }),
    TypeOrmModule.forRoot({
      name: 'game',
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PWD,
      database: 'game',
      entities: [__dirname + '/gamedb/**/*.entity.*'],
      synchronize: process.env.NODE_ENV !== 'prod', // 자동으로 entity를 읽어서 migration..
      logging: process.env.NODE_ENV !== 'prod',
      timezone: 'local',
    }),

    // TypeOrmModule.forRoot({
    //   name: 'live-db',
    //   type: 'mysql',
    //   host: process.env.MYSQL_HOST,
    //   port: +process.env.MYSQL_PORT,
    //   username: process.env.MYSQL_USER,
    //   password: process.env.MYSQL_PWD,
    //   database: process.env.MYSQL_DB_NAME,
    //   entities: [Account, Verification, ProjectAuth, Project, ProjectDetail],
    //   synchronize: process.env.NODE_ENV !== 'prod', // 자동으로 entity를 읽어서 migration..
    //   logging: false,
    // }),

    NoticeModule,

    AccountModule,

    // DatabaseModule,

    JwtModule.forRoot({
      privateKey: process.env.SECRET_KEY,
    }),

    ProjectModule,

    FileModule,

    CommonModule,

    ResourceUploaderModule,

    ResourceManagerModule,

    MigrationModule,

    ProfileModule,

    AssetStockModule,

    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
