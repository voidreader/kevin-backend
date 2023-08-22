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
        Account,
        Verification,
        ProjectAuth,
        Project,
        ProjectDetail,
        TextLocalize,
        StandardInfo,
      ],
      synchronize: process.env.NODE_ENV !== 'prod', // 자동으로 entity를 읽어서 migration..
      logging: process.env.NODE_ENV !== 'prod',
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

    DatabaseModule,

    JwtModule.forRoot({
      privateKey: process.env.SECRET_KEY,
    }),

    ProjectModule,

    FileModule,

    CommonModule,
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
