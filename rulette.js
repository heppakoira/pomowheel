/*

TODO
- Test with 1 sec ticking sound
- Jos pomo on yli 30 min saattaa olla pieni mahdollisuus, että saa uuden pyörityksen
  > 1/20 tms

* Jos breikin pituus on erityisen huono saattaa olla pieni mahdollisuus, että saa uuden pyörityksen
* Taistelujaska mahdollisuus 1/10
* Jos tulee paskin mahdollinen pituus pomodorolle (36) saa instant treatin, ja spinnataan automaattisesti uudestana!
* Disable clicking the canvas when a timer is running
* Make the GET STUFF DONE TEXT disappear on click (and replace with other text)
* Make the transition to break time
* Spin automagically when the user hits 36
* Set up Chrome Dev tools Workspaces
* Set up a linux box to work as a shell
* Set pomodoro time to the title
* Refactor the whole code to use functions
- ?
- PROFIT

*/

var spinning;
var isTreat;
var isBreak;
var pomodoroNumberMins = [];

rulettePomodoro();

function rulettePomodoro () {
  pomodoroNumberMins = [];
  for (i = 0; i < 12; i++) {
    pomodoroNumberMins.push(Math.floor(Math.random() * (36 - 20 + 1) + 20));
    // pomodoroNumberMins.push(0.1);
  }
}

function spin() {
  spinning = true;  // taikuuksia

  // Preload sounds
  fanfareSound = new buzz.sound("sounds/Final Fantasy 6 Victory Fanfare.mp3", {
    preload: true,
  });
  alarmSound = new buzz.sound("sounds/alarm.mp3", {
    preload: true,
  });
  taisteluJaskaSound = new buzz.sound("sounds/taistelujaska.mp3", {
    preload: true,
  });

// määrittää millaisia arvoja käytetään ruletin täyttämiseen
if (isTreat === true) {
  pomodoroNumberMins = [];
  for (i = 0; i < 12; i++) {
    pomodoroNumberMins.push(Math.floor(Math.random() * (6 - 1 + 1) + 1));
    // pomodoroNumberMins.push(0.1);
    console.log("isTreat = true!");
  }
}
else if (isBreak === true) {
  pomodoroNumberMins = [];
  for (i = 0; i < 12; i++) {
    pomodoroNumberMins.push(Math.floor(Math.random() * (18 - 3 + 1) + 3));
    // pomodoroNumberMins.push(0.1);
    console.log("isBreak = true!");
  }
} else {
  rulettePomodoro();
}

spinAngleStart = Math.random() * 30 + 85;
spinTime = 0;
spinTimeTotal = Math.random() * 3 + 5 * 1500;
rotateWheel();
}

var colors = ["#B8D430", "#3AB745", "#029990", "#3501CB",
"#2E2C75", "#673A7E", "#CC0071", "#F80120",
"#F35B20", "#FB9A00", "#FFCC00", "#FEF200"];

var startAngle = 200;
var arc = Math.PI / 6;
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

function draw() {
  drawRouletteWheel();
}

function drawRouletteWheel() {
  var canvas = document.getElementById("wheelcanvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 125;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.font = 'bold 24pt sans-serif';
    ctx.textAlign = "center";


    // WHAT TO DO DURING SPIN
      if (isBreak === true) {
        ctx.fillText("Spinning for", 250, 240);
        ctx.fillText("break duration", 250, 280);
      }
      else {
        ctx.fillText("GET STUFF", 250, 240);
        ctx.fillText("DONE!", 250, 280);
      }

      ctx.textAlign = "left";
      for(var i = 0; i < 12; i++) {
        var angle = startAngle + i * arc;
        ctx.fillStyle = colors[i];

        ctx.beginPath();
        ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
        ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
        ctx.stroke();
        ctx.fill();

        ctx.save();
        ctx.shadowOffsetX = -1;
        ctx.shadowOffsetY = -1;
        ctx.shadowBlur    = 0;
        ctx.shadowColor   = "rgb(220,220,220)";
        ctx.fillStyle     = "black";
        ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 250 + Math.sin(angle + arc / 2) * textRadius);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        var text = pomodoroNumberMins[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      }
        //Arrow
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();
      }
    }


    function rotateWheel() {
      spinTime += 30;
      if(spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
      }
      var spinAngle = spinAngleStart - easeOut(spinTime, 5, spinAngleStart, spinTimeTotal);
      startAngle += (spinAngle * Math.PI / 180);
      drawRouletteWheel();
      spinTimeout = setTimeout(rotateWheel, 30);
    }

    function stopRotateWheel() {
      clearTimeout(spinTimeout);
      var degrees = startAngle * 180 / Math.PI + 90;
      var arcd = arc * 180 / Math.PI;
      var index = Math.floor((360 - degrees % 360) / arcd);
      ctx.textAlign = "center";
      ctx.font = 'bold 30pt sans-serif';
      ctx.save();
      text = pomodoroNumberMins[index];

      // harvinainen taukoboonus
      if (isBreak === true) {
        if (text <= 5)
          if (Math.floor((Math.random() * 20) + 1) === 2) {
            clearInnerCircle();
            ctx.fillText("Blessed", 250, 240);
            ctx.fillText("Free spin!", 250, 280);
        setTimeout(spin, 10000); // automaagisesti spinnaa 10 sek kuluttua
        return;
      }

      // 36 min pomon boonus
      if (text === 36) {
        clearInnerCircle();
        ctx.fillText("Treat!", 250, 260);
        if (Math.floor((Math.random() * 10) + 1) === 10) {
          taisteluJaskaSound.play();
        }
        else {
          fanfareSound.play();
        }
        setTimeout(spin, 10000); // automaagisesti spinnaa 10 sek kuluttua
        return;
      }
    }
    ctx.restore();

            if (isTreat === true) {
              isTreatFunction();  // firing function for treat phase
              return;
            }

            var countdownTimer = setInterval(secondPassed, 1000);
            text = pomodoroNumberMins[index];
            console.log(pomodoroNumberMins[index] + " mins hit");
            var seconds = text * 60;
            function secondPassed() {
              var minutes = Math.round((seconds - 30)/60);
              var remainingSeconds = seconds % 60;
              if (remainingSeconds < 10) {
                remainingSeconds = "0" + remainingSeconds;
              }
              clearInnerCircle();
              ctx.fillText(minutes + ":" + remainingSeconds, 250, 260);
              document.title = (minutes + ":" + remainingSeconds);
              if (seconds === 0) {
                clearInterval(countdownTimer);
                if (isBreak === true) {
                isBreakFunction();  // firing function for break phase
              }
              else {
              isPomodoroFunction(); // firing function for pomodoro phase
            }
          } else {
            seconds--;
          }
        }
      }

      function easeOut(t, b, c, d) {
        var ts = (t/=+d)*t;
        var tc = ts*t-0.046;
        return b+c*(tc + -3*ts + 3*t);
      }

      function clearInnerCircle() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(250, 250, 120, 0, 2*Math.PI);
        ctx.clip();
        ctx.clearRect(0,0,500,500);
        ctx.restore();
      }

      // WHAT TO DO AFTER SPIN
      function isTreatFunction() {
        clearInnerCircle();
        ctx.fillText(text, 250, 200);
        if (text > 4) {
          ctx.fillText("Treat!", 250, 260);
        }
        else {
          ctx.fillText("Start", 250, 240);
          ctx.fillText("break", 250, 280);
        }
        isTreat = false;
        isBreak = true;
        spinning = false;
        return;
      }

      function isBreakFunction() {
        alarmSound.play();
        clearInnerCircle();
        ctx.fillText("New", 250, 240);
        ctx.fillText("pomodoro", 250, 280);
        isTreat = false;
        isBreak = false;
        spinning = false;
        return;
      }

      function isPomodoroFunction() {
        // 1/10 random taistelujaskabileet!
        if (Math.floor((Math.random() * 10) + 1) === 10) {
          taisteluJaskaSound.play();
        }
        else {
          fanfareSound.play();
        }
        clearInnerCircle();
        ctx.fillText("Spin for", 250, 240);
        ctx.fillText("treat", 250, 280);
        isTreat = true;
        isBreak = false;
        spinning = false;
        return;
      }

      draw();