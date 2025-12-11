export class MemoryAuth {
  dao;
  _currentUser;
  _logged;
  constructor(dao) {
    this.dao = dao;
    this._logged = false;
    return this;
  }
  get currentUser() {
    return this._currentUser;
  }
  get logged() {
    return this._logged;
  }
  async authenticate(data) {
    if (this._logged) return false;
    const res = await this.dao.get();
    if (res instanceof Error) return false;
    const employee = res.filter((employee) => employee.name.value() === data.name);
    if (employee.length === 0) return false;
    if (employee.length > 1) return false;
    if (employee[0].password.value() !== data.password) return false;
    this._currentUser = employee[0];
    this._logged = true;
    return true;
  }
  async leave() {
    if (!this._logged) return;
    this._currentUser = undefined;
    this._logged = false;
    return;
  }
}
