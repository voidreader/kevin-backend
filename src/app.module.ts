import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import * as winston from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';

import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { ProjectModule } from './project/project.module';

import { FileModule } from './file/file.module';
import { CommonModule } from './common/common.module';

import { ResourceUploaderModule } from './resource-uploader/resource-uploader.module';
import { ResourceManagerModule } from './resource-manager/resource-manager.module';
import { MigrationModule } from './migration/migration.module';
import { ProfileModule } from './profile/profile.module';
import { AssetStockModule } from './asset-stock/asset-stock.module';
import { ItemModule } from './item/item.module';
import { DeployModule } from './deploy/deploy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
      envFilePath: '.env.dev',
    }),

    // 개발서버 produce(디폴트)
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

    // 개발서버 game
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

    // 로그 서버 (로그DB로 설정)
    TypeOrmModule.forRoot({
      name: 'log',
      type: 'mysql',
      host: process.env.LIVE_LOG_MYSQL_HOST,
      port: +process.env.LIVE_LOG_MYSQL_PORT,
      username: process.env.LIVE_LOG_MYSQL_USER,
      password: process.env.LIVE_LOG_MYSQL_PWD,
      database: 'gamelog',
      entities: [__dirname + '/logdb/*.entity.*'],
      synchronize: process.env.NODE_ENV !== 'prod', // 자동으로 entity를 읽어서 migration..
      logging: process.env.NODE_ENV !== 'prod',
      timezone: 'local',
    }),

    // 라이브 서버 game
    TypeOrmModule.forRoot({
      name: 'live-game',
      type: 'mysql',
      host: process.env.LIVE_MYSQL_HOST,
      port: +process.env.LIVE_MYSQL_PORT,
      username: process.env.LIVE_MYSQL_USER,
      password: process.env.LIVE_MYSQL_PWD,
      database: 'game',
      entities: [__dirname + '/gamedb/**/*.entity.*'],
      synchronize: false,
      logging: false,
      timezone: 'local',
    }),

    // 라이브 Produce
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

    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('Kevin', {
              prettyPrint: true,
              colors: true,
            }),
          ),
        }),
      ],
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
