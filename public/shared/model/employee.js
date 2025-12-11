import { ID } from "ponto-certo/shared/type/id.js";
import { Name } from "ponto-certo/shared/type/name.js";
import { Password } from "ponto-certo/shared/type/password.js";
import { createError } from "ponto-certo/shared/func/error.js";

export class Employee {
  id;
  name;
  password;
  constructor(data) {
    Employee.ensure(data);

    this.id = new ID(data.id);
    this.name = new Name(data.name);
    this.password = new Password(data.password);

    return this;
  }
  struct() {
    return {
      id: this.id.value(),
      name: this.name.value(),
      password: this.password.value(),
    };
  }
  static ensure(object) {
    if (!object.id) throw Employee.Error.UNDEFINED_ID;
    if (!object.name) throw Employee.Error.UNDEFINED_NAME;
    if (!object.password) throw Employee.Error.UNDEFINED_PASSWORD;
    ID.ensure(object.id);
    Name.ensure(object.name);
    Password.ensure(object.password);
  }
}
(function (Employee) {
  const EmployeeError = createError("EmployeeError");
  Employee.Error = {
    UNDEFINED_ID: EmployeeError("Invalid 'Employee' creation: Unknown ID"),
    UNDEFINED_NAME: EmployeeError("Invalid 'Employee' creation: Unknown name"),
    UNDEFINED_PASSWORD: EmployeeError("Invalid 'Employee' creation: Unknown password"),
  };
})(Employee || (Employee = {}));
