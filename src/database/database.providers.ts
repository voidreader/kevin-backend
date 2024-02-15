import { PRODUCE_DATASOURCE } from 'src/common/common.const';
import { DataSource } from 'typeorm';
import { Project } from './produce_entity/project.entity';
import { Account } from './produce_entity/account.entity';
import { ProjectDetail } from './produce_entity/project-detail.entity';
import { Verification } from 'src/database/produce_entity/verification.entity';
import { ProjectAuth } from 'src/database/produce_entity/projectAuth.entity';

export const databaseProviders = [
  {
    provide: PRODUCE_DATASOURCE,
    useFactory: async () => {
      console.log('### produce datasource init start');

      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: +process.env.MYSQL_PORT,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PWD,
        database: process.env.MYSQL_DB_NAME,
        entities: [Account, Verification, ProjectAuth, Project, ProjectDetail],
        synchronize: process.env.NODE_ENV !== 'prod',
        //logging: process.env.NODE_ENV !== 'prod',
        logging: false,
      });

      //  __dirname + '/../../src/database/produce_entity/*.entity{.ts,.js}',
      // console.log(
      //   __dirname + '/../src/database/produce_entity/*.entity{.ts,.js}',
      // );

      console.log(dataSource.entityMetadatas);

      // ,
      return dataSource
        .initialize()
        .then(() => {
          console.log('Data Source has been initialized!');
        })
        .catch((err) => {
          console.error('Error during Data Source initialization', err);
        });
    },
  },
];
