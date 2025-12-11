import { createError } from "ponto-certo/shared/func/error.js";
export class Time {
  hour;
  constructor(hour) {
    Time.ensure(hour);
    this.hour = hour;
    return this;
  }
  value() {
    return this.toString();
  }
  operate(...bind) {
    return (operation) => {
      const result = operation(this.hour, ...bind.map((time) => time.hour));
      return new Time(result);
    };
  }
  compare(...bind) {
    return (operation) => {
      const result = operation(this.hour, ...bind.map((time) => time.hour));
      return result;
    };
  }
  toString() {
    const hour = Math.floor(this.hour);
    const minute = Math.floor(Number.parseFloat((60 * (this.hour - hour)).toFixed(3)));
    const second = Math.round(Number.parseFloat((3600 * (this.hour - hour)).toFixed(3)) - Number.parseFloat((60 * minute).toFixed(3)));
    const strHour = hour < 10 ? `0${hour}` : `${hour}`;
    const strMinute = minute < 10 ? `0${minute}` : `${minute}`;
    const strSecond = second < 10 ? `0${second}` : `${second}`;
    return `${strHour}:${strMinute}:${strSecond}`;
  }
  static now() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    return new Time(hour + minute / 60 + second / 3600);
  }
  static range(bounds) {
    if (bounds.max) Time.ensure(bounds.max);
    if (bounds.min) Time.ensure(bounds.min);
    const usableBounds = {
      min: bounds.min ? (typeof bounds.min === "string" ? Time.fromString(bounds.min).hour : bounds.min) : 0,
      max: bounds.max ? (typeof bounds.max === "string" ? Time.fromString(bounds.max).hour : bounds.max) : Time.fromString("23:59:59").hour,
    };
    return { includes: (time) => usableBounds.min <= time.hour && time.hour <= usableBounds.max };
  }
  static fromString(timestring) {
    if (typeof timestring !== "string") throw Time.Error.INVALID_TYPE;
    Time.ensure(timestring);
    const [hour, minute, second] = timestring.split(":").map((segment) => Number.parseInt(segment));
    return new Time(hour + minute / 60 + second / 3600);
  }
  static ensure(object) {
    if (typeof object !== "number" && typeof object !== "string") throw Time.Error.INVALID_TYPE;
    if (typeof object === "string") {
      if (!/^(?:2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]$/.test(object)) throw Time.Error.INVALID_TIMESTRING;
    }
    if (typeof object === "number") {
      if (Number.isNaN(object)) throw Time.Error.INVALID_NUMBER;
    }
  }
}
(function (Time) {
  const TimeError = createError("TimeError");
  Time.Error = {
    INVALID_TYPE: TimeError("Invalid 'Time' conversion: Expected a 'string' or a 'number'"),
    INVALID_TIMESTRING: TimeError("Invalid 'Time' conversion: Expected a string with the format 'HH:MM:SS'"),
    INVALID_NUMBER: TimeError("Invalid 'Time' conversion: NaN was not expected"),
  };
})(Time || (Time = {}));
