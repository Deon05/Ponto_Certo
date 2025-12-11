import { Router } from "express";
import { workHourDao } from "ponto-certo/bin";
import { ID } from "ponto-certo/shared/type/id.js";
import { Date } from "ponto-certo/shared/type/date.js";
import { WorkHour } from "ponto-certo/shared/model/workhour.js";
const workHourRouter = Router();
workHourRouter.get("/:employee", async (req, res) => {
  if (Number.isNaN(Number.parseInt(req.params.employee))) {
    res.status(400).json({ name: "WorkHourTransactionError", message: "Invalid employee ID" });
    return;
  }
  const employeeID = new ID(Number.parseInt(req.params.employee));
  const workHours = await workHourDao.get([employeeID]);
  if (workHours instanceof Error) {
    res.status(500).json({ name: workHours.name, message: workHours.message });
    return;
  }
  res.status(200).json({ workHours: workHours });
});
workHourRouter.get("/:employee/:date", async (req, res) => {
  if (Number.isNaN(Number.parseInt(req.params.employee))) {
    res.status(400).json({ name: "WorkHourTransactionError", message: "Invalid employee ID" });
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(req.params.date)) {
    res.status(400).json({ name: "WorkHourTransactionError", message: "Invalid work hour date" });
    return;
  }
  const employeeID = new ID(Number.parseInt(req.params.employee));
  const workHourDate = Date.fromString(req.params.date);
  const workHour = await workHourDao.get([employeeID, workHourDate]);
  if (workHour instanceof Error) {
    res.status(500).json({ name: workHour.name, message: workHour.message });
    return;
  }
  res.status(200).json(workHour);
});
workHourRouter.post("/", async (req, res) => {
  try {
    new WorkHour(req.body);
  } catch (err) {
    res.status(500).json({ name: err.name, message: err.message });
    return;
  }
  const newWorkHour = await workHourDao.post(new WorkHour(req.body));
  if (newWorkHour instanceof Error) {
    res.status(500).json({ name: newWorkHour.name, message: newWorkHour.message });
    return;
  }
  res.status(201).end();
});
workHourRouter.put("/:employee/:date", async (req, res) => {
  if (Number.isNaN(Number.parseInt(req.params.employee))) {
    res.status(400).json({ name: "WorkHourTransactionError", message: "Invalid employee ID" });
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(req.params.date)) {
    res.status(400).json({ name: "WorkHourTransactionError", message: "Invalid work hour date" });
    return;
  }
  const employeeID = new ID(Number.parseInt(req.params.employee));
  const date = Date.fromString(req.params.date);
  const updated = await workHourDao.put(req.body, [employeeID, date]);
  if (updated instanceof Error) {
    res.status(500).json({ name: updated.name, message: updated.message });
    return;
  }
  res.status(200).json(updated);
});
export { workHourRouter };
