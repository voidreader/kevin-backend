import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { Account } from './database/produce_entity/account.entity';
import { Verification } from './database/produce_entity/verification.entity';
import { ProjectAuth } from './database/produce_entity/projectAuth.entity';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { ProjectModule } from './project/project.module';
import { Project } from './database/produce_entity/project.entity';
import { ProjectDetail } from './database/produce_entity/project-detail.entity';
import { FileModule } from './file/file.module';
import { CommonModule } from './common/common.module';
import { TextLocalize } from './database/produce_entity/text-localize.entity';
import { StandardInfo } from './database/produce_entity/standard-info.entity';
import { ResourceUploaderModule } from './resource-uploader/resource-uploader.module';
import { ResourceManagerModule } from './resource-manager/resource-manager.module';

import { ResourceManagerService } from './resource-manager/resource-manager.service';
import { DiscardResource } from './database/produce_entity/discard-resource.entity';

import { ImageLocalization } from './database/produce_entity/image-localization.entity';
import { StoryStaticImage } from './database/produce_entity/story-static-image.entity';
import { PublicExtension } from './database/produce_entity/public-extension.entity';
import { LiveResource } from './database/produce_entity/live-resource.entity';
import { MigrationModule } from './migration/migration.module';
import { LiveResourceDetail } from './database/produce_entity/live-resource-detail.entity';
import { ProfileModule } from './profile/profile.module';
import { AssetStockModule } from './asset-stock/asset-stock.module';
import { ItemModule } from './item/item.module';
import { DeployService } from './deploy/deploy.service';
import { DeployModule } from './deploy/deploy.module';

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
      entities: [__dirname + '/database/**/*.entity.*'],
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

    TypeOrmModule.forRoot({
      name: 'live-produce',
      type: 'mysql',
      host: process.env.LIVE_MYSQL_HOST,
      port: +process.env.LIVE_MYSQL_PORT,
      username: process.env.LIVE_MYSQL_USER,
      password: process.env.LIVE_MYSQL_PWD,
      database: 'produce',
      entities: [__dirname + '/database/**/*.entity.*'],
      synchronize: false,
      logging: false,
      timezone: 'local',
    }),

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

    DeployModule,
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
