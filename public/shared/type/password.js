import { createError } from "ponto-certo/shared/func/error.js";
export class Password {
  password;
  constructor(pwd) {
    Password.ensure(pwd);
    this.password = pwd;
    return this;
  }
  value() {
    return this.password;
  }
  static ensure(object) {
    if (typeof object !== "string") throw Password.Error.INVALID_TYPE;
    if (!/^\w+$/.test(object)) throw Password.Error.INVALID_CHARACTERS;
  }
}
(function (Password) {
  const PasswordError = createError("PasswordError");
  Password.Error = {
    INVALID_TYPE: PasswordError("Invalid 'Password' conversion: Expected a string"),
    INVALID_CHARACTERS: PasswordError("Invalid 'Password' conversion: Expected a alphanumerical string"),
  };
})(Password || (Password = {}));
