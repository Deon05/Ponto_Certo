import { Employee } from "ponto-certo/shared/model/employee.js";
import { createError } from "ponto-certo/shared/func/error.js";

export class EmployeeDAO {
  database;
  constructor(database) {
    this.database = database;
    return this;
  }
  async get(primaryKey) {
    if (!primaryKey) {
      const res = await this.database.select("employee");

      const employees = [];

      res.forEach((element) => {
        const employee = new Employee(element);

        employees.push({ id: employee.id, name: employee.name, password: employee.password });
      });

      if (res instanceof Error) return res;

      return employees;
    }

    const [employeeID] = primaryKey;

    const res = await this.database.select("employee", [["id", employeeID.value()]]);

    if (res instanceof Error) return res;
    if (res.length === 0) return EmployeeDAO.Error.NOT_FOUND;

    return new Employee(res[0]);
  }
  async post(value) {
    const res = await this.database.insert("employee", value);
    if (res instanceof Error) return res;

    return new Employee(res);
  }
  async put(value, primaryKey) {
    const [employeeID] = primaryKey;
    const res = await this.database.update("employee", value, [["id", employeeID.value()]]);
    if (res instanceof Error) return res;
    if (res.length === 0) return EmployeeDAO.Error.NOT_FOUND;
    return new Employee(res[0]);
  }
  async delete(primaryKey) {
    const [employeeID] = primaryKey;
    const res = await this.database.delete("employee", [["id", employeeID.value()]]);
    if (res instanceof Error) return res;
    if (res.length === 0) return EmployeeDAO.Error.NOT_FOUND;
    return new Employee(res[0]);
  }
}
(function (EmployeeDAO) {
  const EmployeeDAOError = createError("EmployeeDAOError");
  EmployeeDAO.Error = {
    NOT_FOUND: EmployeeDAOError("Failure at querying 'Employee': Not found"),
  };
})(EmployeeDAO || (EmployeeDAO = {}));
