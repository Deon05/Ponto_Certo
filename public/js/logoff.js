import { Date } from "ponto-certo/shared/type/date.js";
import { Time } from "ponto-certo/shared/type/time.js";
import { chronometer } from "./chronometer.js";

const today = Date.now().value();

const logoffBtn = document.getElementById("botao_vermelho");

const employeeID = document.getElementById("employeeID").textContent;

const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

logoffBtn.addEventListener("click", async () => {
  clearInterval(chronometer);

  const todayWorkHourFetch = await fetch(`/workhour/${employeeID}/${today}`);

  if (!todayWorkHourFetch.ok) {
    console.log(await todayWorkHourFetch.json());

    return;
  }

  const workHour = await todayWorkHourFetch.json();
  const workedHours = Time.fromString(`${hours.textContent}:${minutes.textContent}:${seconds.textContent}`);

  const res = await fetch(`/workhour/${employeeID}/${today}`, {
    method: "PUT",
    body: JSON.stringify({
      exit_hour: workedHours
        .operate(
          workHour.entryHour,
          workHour.break
        )((a, b, c) => a + b + c)
        .value(),
    }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.log(await res.json());

    return;
  }

  const success = await fetch("/auth/logout", { method: "POST" });

  if (!success.ok) {
    console.log(await success.json());
    return;
  }

  window.location.assign("/");
});
export {};
