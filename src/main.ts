import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as https from 'https';
import * as http from 'http';
import bodyParser, { urlencoded, json } from 'body-parser';
import { HttpExceptionFilter } from './util/http-exception.filter';

import { winstonLogger } from './util/winston.config';

console.log(`__dirname :: `, __dirname);

const httpsOptions = {
  ca: fs.readFileSync(`./secret/ca-chain-bundle.pem`),
  key: fs.readFileSync('./secret/key.pem'),
  cert: fs.readFileSync('./secret/crt.pem'),
};

async function bootstrap() {
  // http
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: winstonLogger,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.use(bodyParser.text({ type: 'text/html' }));
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.init();

  // await app.listen(3000);

  http.createServer(server).listen(3000);
  https.createServer(httpsOptions, server).listen(7603);
}

bootstrap();
