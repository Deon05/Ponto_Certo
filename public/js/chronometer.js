import { Time } from "ponto-certo/shared/type/time.js";
var startBtn = document.getElementById("botao_verdebateponto");
var hours = document.getElementById("hours");
var minutes = document.getElementById("minutes");
var seconds = document.getElementById("seconds");
var chronometer;
var isTicking = false;
startBtn.addEventListener("click", function () {
  if (isTicking) {
    isTicking = false;
    clearInterval(chronometer);
    return;
  }
  isTicking = true;
  chronometer = setInterval(function () {
    var time = Time.fromString("".concat(hours.textContent, ":").concat(minutes.textContent, ":").concat(seconds.textContent));
    var newTime = time.operate(new Time(1 / 3600))(function (time, s) {
      return time + s;
    });
    var _a = newTime.value().split(":"),
      nextHour = _a[0],
      nextMinute = _a[1],
      nextSecond = _a[2];
    hours.textContent = nextHour;
    minutes.textContent = nextMinute;
    seconds.textContent = nextSecond;
    return;
  }, 1000);
});

export { chronometer };
