import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import * as moment from 'moment-timezone';

const logDir = 'logs'; // logs 디렉토리 하위에 로그 파일 저장

const logFormat = winston.format.printf(
  (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
);

const dailyOptions = (
  level: string,
): winstonDaily.DailyRotateFileTransportOptions => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir,
    filename: `%DATE%.log`,
    maxFiles: 30,
    json: true,
    zippedArchive: true,
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      // winston.format.json(),
      //   winston.format.printf((info) => JSON.stringify(info.message)),
      utilities.format.nestLike('Kevin', { prettyPrint: true }),
    ),
  };
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        // winston.format.json(),
        utilities.format.nestLike('Kevin', { prettyPrint: true, colors: true }),
      ),
    }),

    new winstonDaily(dailyOptions('error')),
  ],
  //   format: winston.format.combine(
  //     winston.format.timestamp(),
  //     logFormat,
  //     // winston.format.printf((info) => JSON.stringify(info.message)),
  //     utilities.format.nestLike('Kevin', { prettyPrint: true }),
  //   ),
});
