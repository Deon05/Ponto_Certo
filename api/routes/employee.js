import { Router } from "express";
import { ID } from "ponto-certo/shared/type/id.js";
import { employeeDao } from "ponto-certo/bin";
const employeeRouter = Router();

employeeRouter.get("/:param", async (req, res) => {
  if (/^\d+$/.test(req.params.param)) {
    if (Number.isNaN(Number.parseInt(req.params.param))) {
      res.status(400).json({ name: "EmployeeTransactionError", message: "Invalid employee ID" });
      return;
    }

    const id = new ID(Number.parseInt(req.params.param));
    const employee = await employeeDao.get([id]);
    console.log(employee);

    if (employee instanceof Error) {
      res.status(500).json({ name: employee.name, message: employee.message });
      return;
    }

    res.status(200).json(employee);
  } else {
    const name = req.params.param;
    const employees = await employeeDao.get();
    if (employees instanceof Error) {
      res.status(500).json({ name: employees.name, message: employees.message });
      return;
    }
    res.status(200).json(employees.find((employee) => employee.name.value() === name) || {});
  }
});

employeeRouter.post("/", async (req, res) => {
  const posted = await employeeDao.post(req.body);
  if (posted instanceof Error) {
    res.status(500).json({ name: posted.name, message: posted.message });
    return;
  }

  res.cookie("session", posted.id.value(), {
    httpOnly: true, // cannot be accessed by JS (recommended)
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });

  return res.status(201).redirect(303, "/");
});
export { employeeRouter };
