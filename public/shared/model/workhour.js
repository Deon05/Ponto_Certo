import { Date } from "ponto-certo/shared/type/date.js";
import { ID } from "ponto-certo/shared/type/id.js";
import { Time } from "ponto-certo/shared/type/time.js";
import { Timezone } from "ponto-certo/shared/type/timezone.js";
import { createError } from "ponto-certo/shared/func/error.js";
export class WorkHour {
  static overtimeThreshold = 8;
  employee;
  date;
  timezone;
  entryHour;
  exitHour;
  break;
  workedHours;
  overtime;
  constructor(data) {
    WorkHour.ensure(data);
    this.employee = new ID(data.employee);
    this.date = Date.fromString(data.date);
    this.timezone = new Timezone(data.timezone);
    this.entryHour = Time.fromString(data.entry_hour);
    this.exitHour = Time.fromString(data.exit_hour);
    this.break = Time.fromString(data.break);
    if (data.worked_hours) {
      this.workedHours = Time.fromString(data.worked_hours);
    } else {
      this.workedHours = this.exitHour.operate(this.entryHour, this.break)((exit, entry, recess) => Math.max(0, exit - (entry + recess)));
    }
    if (data.overtime) {
      this.overtime = Time.fromString(data.overtime);
    } else {
      this.overtime = this.exitHour.operate(this.workedHours)((exit, worked) => Math.max(0, exit - (worked + WorkHour.overtimeThreshold)));
    }
    return this;
  }
  struct() {
    return {
      employee: this.employee.value(),
      date: this.date.value(),
      timezone: this.timezone.value(),
      entry_hour: this.entryHour.value(),
      exit_hour: this.exitHour.value(),
      break: this.break.value(),
    };
  }
  static ensure(object) {
    if (!object.employee) throw WorkHour.Error.UNKNOWN_EMPLOYEE;
    if (!object.date) throw WorkHour.Error.UNKNOWN_DATE;
    if (!object.timezone) throw WorkHour.Error.UNKNOWN_TIMEZONE;
    if (!object.entry_hour) throw WorkHour.Error.UNKNOWN_ENTRY_HOUR;
    if (!object.exit_hour) throw WorkHour.Error.UNKNONW_EXIT_HOUR;
    if (!object.break) throw WorkHour.Error.UNKNOWN_BREAK;
    ID.ensure(object.employee);
    Date.ensure(object.date);
    Timezone.ensure(object.timezone);
    Time.ensure(object.entry_hour);
    Time.ensure(object.exit_hour);
    Time.ensure(object.break);
    object.worked_hours ? Time.ensure(object.worked_hours) : 0;
    object.overtime ? Time.ensure(object.overtime) : 0;
  }
}
(function (WorkHour) {
  const WorkHourError = createError("WorkHourError");
  WorkHour.Error = {
    UNKNOWN_EMPLOYEE: WorkHourError("Invalid 'WorkHour' creation: Unknown employee"),
    UNKNOWN_DATE: WorkHourError("Invalid 'WorkHour' creation: Unknown date"),
    UNKNOWN_TIMEZONE: WorkHourError("Invalid 'WorkHour' creation: Unknown timezone"),
    UNKNOWN_ENTRY_HOUR: WorkHourError("Invalid 'WorkHour' creation: Unknown entry hour"),
    UNKNONW_EXIT_HOUR: WorkHourError("Invalid 'WorkHour' creation: Unknown exit hour"),
    UNKNOWN_BREAK: WorkHourError("Invalid 'WorkHour' creation: Unknown work break"),
  };
})(WorkHour || (WorkHour = {}));
