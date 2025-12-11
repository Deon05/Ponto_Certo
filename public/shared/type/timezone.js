import { createError } from "ponto-certo/shared/func/error.js";
export class Timezone {
  tz;
  constructor(timezone) {
    Timezone.ensure(timezone);
    this.tz = timezone;
    return this;
  }
  value() {
    return this.tz;
  }
  operate(...bind) {
    return (operation) => {
      const result = operation(this.tz, ...bind.map((time) => time.tz));
      return new Timezone(result % 12);
    };
  }
  compare(...bind) {
    return (operation) => {
      const result = operation(this.tz, ...bind.map((time) => time.tz));
      return result;
    };
  }
  static range(bounds) {
    if (bounds.max) Timezone.ensure(bounds.max);
    if (bounds.min) Timezone.ensure(bounds.min);
    const usableBounds = {
      min: bounds.min ?? -12,
      max: bounds.max ?? 12,
    };
    return { includes: (timezone) => usableBounds.min <= timezone.tz && timezone.tz <= usableBounds.max };
  }
  static ensure(object) {
    if (typeof object !== "number") throw Timezone.Error.INVALID_TYPE;
    if (Math.abs(object) > 12) throw Timezone.Error.INVALID_TIMEZONE_RANGE;
  }
}
(function (Timezone) {
  const TimezoneError = createError("TimezoneError");
  Timezone.Error = {
    INVALID_TYPE: TimezoneError("Invalid 'Timezone' conversion: Expected a number"),
    INVALID_TIMEZONE_RANGE: TimezoneError("Invalid 'Timezone' conversion: Expected a number between -12 and 12"),
  };
})(Timezone || (Timezone = {}));
