import { createError } from "ponto-certo/shared/func/error.js";
import { WorkHour } from "ponto-certo/shared/model/workhour.js";
import { ID } from "ponto-certo/shared/type/id.js";

export class WorkHourDAO {
  static tableName = "work_hour";
  database;
  constructor(database) {
    this.database = database;
    return this;
  }
  async get(primaryKey) {
    if (primaryKey.length === 1) {
      const paramName = primaryKey[0] instanceof ID ? "employee" : "date";
      const paramValue = primaryKey[0].value();
      const res = await this.database.select(WorkHourDAO.tableName, [[paramName, paramValue]]);
      if (res instanceof Error) return res;
      return res.map((entry) => new WorkHour(entry));
    }
    const [employeeID, date] = primaryKey.map((i) => i.value());
    const res = await this.database.select(WorkHourDAO.tableName, [
      ["employee", employeeID],
      ["date", date],
    ]);
    if (res instanceof Error) return res;
    if (res.length === 0) return WorkHourDAO.Error.NOT_FOUND;
    return new WorkHour(res[0]);
  }
  async post(value) {
    const res = await this.database.insert(WorkHourDAO.tableName, value.struct());

    if (res instanceof Error) return res;
    return new WorkHour(res);
  }
  async put(value, primaryKey) {
    const [employeeID, date] = primaryKey.map((i) => i.value());
    const res = await this.database.update(WorkHourDAO.tableName, value, [
      ["employee", employeeID],
      ["date", date],
    ]);
    if (res instanceof Error) return res;
    if (res.length === 0) return WorkHourDAO.Error.NOT_FOUND;
    return new WorkHour(res[0]);
  }
  async delete(primaryKey) {
    const [employeeID, date] = primaryKey.map((i) => i.value());
    const res = await this.database.delete(WorkHourDAO.tableName, [
      ["employee", employeeID],
      ["date", date],
    ]);
    if (res instanceof Error) return res;
    if (res.length === 0) return WorkHourDAO.Error.NOT_FOUND;
    return new WorkHour(res[0]);
  }
}
(function (WorkHourDAO) {
  const WorkHourDAOError = createError("WorkHourDAOError");
  WorkHourDAO.Error = {
    NOT_FOUND: WorkHourDAOError("Failure at querying 'WorkHour': Not found"),
  };
})(WorkHourDAO || (WorkHourDAO = {}));
