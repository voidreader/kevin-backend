import { ValueTransformer } from 'typeorm';

export class LocalDateTimeTransformer implements ValueTransformer {
  changeDateFormat(date: Date) {
    let month: number | string = date.getMonth() + 1;
    let day: number | string = date.getDate();
    let hour: number | string = date.getHours();
    let minute: number | string = date.getMinutes();
    let second: number | string = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    return (
      date.getFullYear() +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hour +
      ':' +
      minute +
      ':' +
      second
    );
  }

  to(entityValue: Date): Date {
    return entityValue;
  }

  from(databaseValue: Date): string {
    return this.changeDateFormat(databaseValue);
  }
}
