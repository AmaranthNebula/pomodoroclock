$(document).ready(function() {
    //function to creat time object
   var  Time = function (m, s) {
        var minutes = m;
        var seconds = s;  
        var milliseconds = ((minutes*60) + seconds) * 1000;
        var originalTime = milliseconds;
        this.getTime = function() {
            var current = "";
            if (minutes < 10) {
                current += "0";
            }
            current += minutes + ":";
            if (seconds < 10) {
                current += "0";
            }
            current += seconds;
            return current;
        }
        function convertFromMS() {
            var current = Math.round(milliseconds/1000);
            if (current >= 60) {
                minutes = Math.floor(current/60);
                seconds = current % 60;
            } else {
                minutes = 0;
                seconds = current;
            }  
        }
        this.decrement = function() {
            milliseconds -= 1000;
            convertFromMS();          
        }
        this.setTime = function(m, s) {
            minutes = m;
            seconds = s;
        }
        this.getMilliseconds = function() {
            return milliseconds;
        }
        //returns percent in decimal form
        this.getPercent = function() {
            return 1 - (milliseconds / originalTime);
        }
        this.resetClock = function() {
            milliseconds = originalTime;
            convertFromMS();
        }
} // end of Time function name(params) 
//says how many pomodoros have been completed
var pomodorosCompleted = 0;
var workMinutes;
var breakMinutes;
var takingBreak = false;
//variable to hold time; default time: 5 seconds
var customTime = new Time(0,5);


//setup Timer
    //arrow buttons event handlers to select work and break times
    //max values 60 and min value 1
    function increaseValue(num) {
        if (num >= 60) {
            num = 1;
        }else {
            num++;
        }
        return num;
    }
    function decreaseValue(num) {
        if (num <= 1) {
            num = 60;
        }else {
            num--;
        }
        return num;       
    }
    $("#workUp").click(function(e) {
       e.preventDefault();
       var workTime = parseInt($("#workLength").text());
        //if not on mobile
        if ($("#setTimerPanel").css("display") !== "block") {
            workTime = increaseValue(workTime);
        }else {
            workTime = decreaseValue(workTime);
        }
       
        $("#workLength").html(workTime);
    });
    
    $("#workDown").click(function(e) {
       e.preventDefault();
       var workTime = parseInt($("#workLength").text());
        //if not on mobile
        if ($("#setTimerPanel").css("display") !== "block") {
            workTime = decreaseValue(workTime);
        }else {
            workTime = increaseValue(workTime);
        }

        
        $("#workLength").html(workTime);       
    });
    $("#breakUp").click(function(e) {
       e.preventDefault();
       var breakTime = parseInt($("#breakLength").text());
        
        //if not on mobile        
        if ($("#setTimerPanel").css("display") !== "block") {
            breakTime = increaseValue(breakTime);
        }else {
            breakTime = decreaseValue(breakTime);
        }
        
        $("#breakLength").html(breakTime);
    });
    
    $("#breakDown").click(function(e) {
       e.preventDefault();
       var breakTime = parseInt($("#breakLength").text());
        
        //if not on mobile
        if ($("#setTimerPanel").css("display") !== "block") {
            breakTime = decreaseValue(breakTime);
        }else {
            breakTime = increaseValue(breakTime);
        }
        
        $("#breakLength").html(breakTime);       
    });    

    //start POMODORO
    $("#startButton").click(function(e) {
       e.preventDefault();
       //get values selectd for pomodoro
       workMinutes = parseInt($("#workLength").text());
       breakMinutes = parseInt($("#breakLength").text());

       //call timer function
       activateTimerPanel(workMinutes, 0);
       
    });
    
//end of setup TIMER
//
//
//
// start of start timer

//create timer object
// the timer function will edit this object dynamically
    var activeTimer = new ProgressBar.Circle(container, {
        strokeWidth: 3,
        easing: 'easeInOut',
        duration: 1,
        color: '#49a154',
        text: {
            value: "00:00"
        },
        svgStyle: null
    });

function activateTimerPanel(min, sec) {
    if (min !== undefined || sec !== undefined) {
        customTime = new Time(min, sec);
    }
    //update Timer object display
    activeTimer.setText(customTime.getTime());
    activeTimer.set(customTime.getPercent());     
    //hide panels
    $("#setTimerPanel").hide();
    $("#timerEndsPanel").hide();    
    //show countdown timer panel
    $("#timerPanel").show();    

    controlTimer(true);
}
function displayCountDown() {
    customTime.decrement();
    activeTimer.setText(customTime.getTime());
    activeTimer.set(customTime.getPercent());
    if (customTime.getTime() === "00:00") {
        end();
    }
    
}
// after timer reaches zero
// show results panel and if not on a break add one to pomodoro total 
function end () {
    controlTimer(false);
    if (!takingBreak) {
        pomodorosCompleted++;
    }
    // call function and show panel to show results of pomodoro
    $("#timerEndsPanel").css("display" ,"flex");
    $("#timerEndsPanel").css("display" ,"-webkit-flex");
    timesUP();

}  
//this functions starts and stops the timer
// true = start timer
// false = stop timer
var timer;
function controlTimer(start) {
    if (start) {
       timer = setInterval(function() {
            displayCountDown();
        },1000);    
    }
    else {
        clearInterval(timer);
        timer =0;
    }
    
}

var paused = false;
$("#pauseButton").click(function(e) {
    e.preventDefault();
    var pause = "<i class='fa fa-pause'></i> PAUSE</a>";
    var play = "<i class='fa fa-play'></i> CONTINUE</a>";
    
    if(paused) {
        controlTimer(true);
        paused = false;
        $("#pauseButton").html(pause);
    }
    // if not currently paused
    else {
        controlTimer(false);
        paused = true;
        $("#pauseButton").html(play);
    }
    
});

$("#restartButton").click(function(e) {
    e.preventDefault();
    //stop timer
    controlTimer(false);
    //reset time back to original and update display
    customTime.resetClock();
    activeTimer.setText(customTime.getTime());
    activeTimer.set(customTime.getPercent());
    //reset pause data
    paused = false;
    $("#pauseButton").html("<i class='fa fa-pause'></i> PAUSE</a>");
    
    controlTimer(true);
});

//
// end of start timer actions
// 
//
// start of times up actions

function timesUP() {
    // setup info displayed
    // offer longer break every four pomodoros
    if (takingBreak) {
        $("#pomodoroResult").html("BREAK IS NOW OVER: GET BACK TO WORK");
    }
    else if(pomodorosCompleted % 4 === 0) {
        $("#pomodoroResult").html("POMODORO " + pomodorosCompleted + " COMPLETE!!"
                    + "<p>GOOD WORK! YOU CAN NOW TAKE A LONGER BREAK!</P>");
    }
    else {
        $("#pomodoroResult").html("POMODORO " + pomodorosCompleted + " COMPLETE!!");
    }
    
    // call sound alarm function
    controlSound(true);
}
//control playback of alarm sound
// if true: play alarm
// if false: stop alarm
function controlSound(play) {
    var audioObject = document.getElementsByTagName("audio")[0];
    if (play) {
        audioObject.play();
    } else {
        audioObject.pause();
    }
    
    
    
}
    
    //button handlers
    $("#takeBreakButton").click(function(e) {
       e.preventDefault();
       //stop alarm sound 
       controlSound(false);
       // hide times up panel //reveal timerPanel behind times up panel
       $("#timerEndsPanel").hide();
      
      // if a multiple of four pomodoros have been completed 
      // break timer is 3 times longer
      if (pomodorosCompleted % 4 === 0) {
          activateTimerPanel(breakMinutes*3, 0);
      }else {
        activateTimerPanel(breakMinutes, 0);
      }
      
      takingBreak = true;
    });
    $("#keepWorkingButton").click(function(e) {
       e.preventDefault();
       //stop alarm sound
       controlSound(false);
        // hide times up panel //reveal timerPanel behind times up panel
 
       $("#timerEndsPanel").hide();
      //call method to start timer
      activateTimerPanel(workMinutes, 0);
             
        takingBreak = false;
    });
    
    //when quit button is clicked reload the window to clear all settings
    $("#quitButton").click(function(e) {
       e.preventDefault();
       returnToHome(); 
    });
function returnToHome() {
    //stop timer
    controlTimer(false);
    //stop sound
    controlSound(false);
    
    //hide panels
    $("#timerPanel").hide();
    $("#timerEndsPanel").hide();
    
    //view set timer panel
    $("#setTimerPanel").show();
    //reset pomodoro counter and other values
    pomodorosCompleted = 0;
    paused = false;
    takingBreak = false;
    resizeElements();
}    

//
// LOGO button reload page
//
$("header > h1").click(function(e) {
   e.preventDefault();
//    location.reload(); 
    returnToHome();

});


//
// RESIZE EVENT HANDLERS
//

function resizeElements() {
    // height of header and footer
    var headerHeight = $("header").outerHeight(true) + $("footer").outerHeight(true);
    
    // if on mobile, add height of restart panel to header and footer heights
    if (($("#timerControllerPanel").css("position") !== "absolute")) {
        headerHeight += $("#timerControllerPanel").outerHeight(true);
    }
    var panelHeight = $(window).outerHeight() - headerHeight;
    var timerDiameter = panelHeight;    
    
    if ($(window).outerWidth() < panelHeight) {
       timerDiameter = $(window).outerWidth();
    }
    
    var timerDiameter = timerDiameter * 0.6; 
 
   $("#dialContainer").css("height",panelHeight + "px");
    $("#dialBorder").css("height", timerDiameter + "px");
    $("#dialBorder").css("width", timerDiameter + "px");
}
//call function when page first loads
resizeElements();
$(window).resize(function() {
   resizeElements(); 
});
    
});