import { createError } from "ponto-certo/shared/func/error.js";
export class Name {
  name;
  constructor(str) {
    Name.ensure(str);
    this.name = str;
    return this;
  }
  value() {
    return this.name;
  }
  static ensure(object) {
    if (typeof object !== "string") throw Name.Error.INVALID_TYPE;
    if (!/^(?:[a-zA-Z]| |\d)+$/.test(object)) throw Name.Error.INVALID_CHARACTERS;
  }
}
(function (Name) {
  const NameError = createError("NameError");
  Name.Error = {
    INVALID_TYPE: NameError("Invalid 'Name' conversion: Expected a string"),
    INVALID_CHARACTERS: NameError("Invalid 'Name' conversion: Expected a aplhabetical string"),
  };
})(Name || (Name = {}));
