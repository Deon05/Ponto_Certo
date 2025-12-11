import { createError } from "ponto-certo/shared/func/error.js";
export class ID {
  id;
  constructor(n) {
    ID.ensure(n);
    this.id = n;
    return this;
  }
  value() {
    return this.id;
  }
  static ensure(object) {
    if (typeof object !== "number") throw ID.Error.INVALID_TYPE;
    if (Number.isNaN(object)) throw ID.Error.IS_NOT_A_NUMBER;
    if (object <= 0) throw ID.Error.IS_NOT_POSITIVE;
  }
}
(function (ID) {
  const IdError = createError("IdError");
  ID.Error = {
    INVALID_TYPE: IdError("Invalid 'ID' conversion: Expected a number"),
    IS_NOT_A_NUMBER: IdError("Invalid 'ID' conversion: NaN was not expected"),
    IS_NOT_POSITIVE: IdError("Invalid 'ID' conversion: Expected a positive number"),
  };
})(ID || (ID = {}));
