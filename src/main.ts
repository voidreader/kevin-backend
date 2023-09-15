import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as https from 'https';
import * as http from 'http';

console.log(`__dirname :: `, __dirname);

const httpsOptions = {
  ca: fs.readFileSync(`./secret/ca-chain-bundle.pem`),
  key: fs.readFileSync('./secret/key.pem'),
  cert: fs.readFileSync('./secret/crt.pem'),
};

async function bootstrap() {
  // http
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  // await app.listen(3000);

  http.createServer(server).listen(3000);
  https.createServer(httpsOptions, server).listen(7603);
}

bootstrap();
