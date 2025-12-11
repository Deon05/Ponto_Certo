import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { useTemplate } from "ponto-certo/template/engine";
import { authRouter } from "ponto-certo/routes/auth";
import { employeeRouter } from "ponto-certo/routes/employee";
import { workHourRouter } from "ponto-certo/routes/workhour";
import { WorkHour } from "ponto-certo/shared/model/workhour.js";
import { Date } from "ponto-certo/shared/type/date.js";
import { Time } from "ponto-certo/shared/type/time.js";
import { ID } from "ponto-certo/shared/type/id.js";

import { employeeDao, workHourDao } from "ponto-certo/bin";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use(express.json(), express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/employee", employeeRouter);
app.use("/workhour", workHourRouter);
app.get("/system", (req, res) => {
  if (!req.cookies.session) return res.redirect(303, "/html/entrar.html");
  return res.redirect(303, "/");
});
app.get("/", async (req, res) => {
  if (!req.cookies.session) {
    res.status(200).sendFile("index.html", { root: "public/html" });

    return;
  }

  const user = await employeeDao.get([new ID(Number.parseInt(req.cookies.session))]);

  const templateParams = {
    id: `${user.id.value()}`,
    name: user.name.value(),
    hours: "00",
    minutes: "00",
    seconds: "00",
    overtime: "00:00:00",
    day_worked_hours: "00:00:00",
  };

  const currentDate = Date.now();
  const currentTime = Time.now();

  const workHours = await workHourDao.get([user.id]);

  if (workHours instanceof Error) {
    res.status(500).json({ name: workHours.name, message: workHours.message });
    return;
  }
  const todayWorkHours = workHours.find((workHour) => workHour.date.value() === currentDate.value());
  if (!todayWorkHours) {
    const startWorkHour = new WorkHour({
      employee: user.id.value(),
      date: currentDate.value(),
      timezone: -3,
      entry_hour: currentTime.value(),
      exit_hour: "00:00:00",
      break: "00:00:00",
    });
    const success = await workHourDao.post(startWorkHour);
    if (success instanceof Error) {
      res.status(500).json({ name: success.name, message: success.message });
      return;
    }
    const indexTemplate = await useTemplate("/html/calcular.html", templateParams);
    res.status(200).contentType("text/html").send(indexTemplate);
    return;
  }
  const [hours, minutes, seconds] = todayWorkHours.workedHours.value().split(":");
  templateParams["hours"] = hours;
  templateParams["minutes"] = minutes;
  templateParams["seconds"] = seconds;
  templateParams["day_worked_hours"] = `${hours}:${minutes}:${seconds}`;
  templateParams["overtime"] = todayWorkHours.overtime.value();
  const indexTemplate = await useTemplate("/html/calcular.html", templateParams);
  res.status(200).contentType("text/html").send(indexTemplate);
});

export default function handler(req, res) {
  app.handle(req, res);
}
