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
setUpTimer();
function setUpTimer() {
    
    $("#workUp").click(function(e) {
       e.preventDefault();
       var workTime = parseInt($("#workLength").text());
        
        if (workTime >= 60) {
            workTime = 1;
        }else {
            workTime++;
        }
        
        $("#workLength").html(workTime);
    });
    
    $("#workDown").click(function(e) {
       e.preventDefault();
       var workTime = parseInt($("#workLength").text());
        
        if (workTime <= 1) {
            workTime = 60;
        }else {
            workTime--;
        }
        
        $("#workLength").html(workTime);       
    });
    $("#breakUp").click(function(e) {
       e.preventDefault();
       var breakTime = parseInt($("#breakLength").text());
        
        if (breakTime >= 60) {
            breakTime = 1;
        }else {
            breakTime++;
        }
        
        $("#breakLength").html(breakTime);
    });
    
    $("#breakDown").click(function(e) {
       e.preventDefault();
       var breakTime = parseInt($("#breakLength").text());
        
        if (breakTime <= 1) {
            breakTime = 60;
        }else {
            breakTime--;
        }
        
        $("#breakLength").html(breakTime);       
    });    

    $("#startButton").click(function(e) {
       e.preventDefault();
       //get values selectd for pomodoro
       var workTime = parseInt($("#workLength").text());
       //hide panel
       $("#setTimerPanel").css("display", "none");
       
       //show timer panel
       $("#timerPanel").css("display", "block");
       
       //call timer function
       activateTimerPanel(workTime, 0);
       
    });
    
}


//TODO NOTE
//this should be moved to start pomodoro event handle
// activateTimerPanel(1,0);    
    
function activateTimerPanel(min, sec) {    
    // display timerPanel
    $("#timerPanel").css("display", "block");
    
    
    //this variable holds the time set in the setTimer Panel
    // default time is set to 5 minutes
    var customTime = new Time(min,sec);
    
    
    
    var activeTimer = new ProgressBar.Circle(container, {
        strokeWidth: 3,
        easing: 'easeInOut',
        duration: customTime.getMilliseconds(),
        color: '#49a154',
        text: {
            value: customTime.getTime()
        },
        svgStyle: null
    });
    
    function displayCountDown() {
        customTime.decrement();
        activeTimer.setText(customTime.getTime());
        activeTimer.set(customTime.getPercent());
        if (customTime.getTime() === "00:00") {
            end();
        }
        
    }; 
        var timer = setInterval(function() {
            displayCountDown();
        },1000);

    function end () {
        console.log("called");
        clearInterval(timer);
        timer =0;
        // TODO NOTE
        // call function/panel to show results of pomodoro
    }  

    //
    // button handlers
    //
    var paused = false;
    $("#pauseButton").click(function(e) {
        e.preventDefault();
        var pause = "<i class='fa fa-pause'></i> PAUSE</a>";
        var play = "<i class='fa fa-play'></i> CONTINUE</a>";
        
        if(paused) {
            //restart counter
            timer = setInterval(function() {
                displayCountDown();
            },1000);
            paused = false;
            $("#pauseButton").html(pause);
        }
        // if not currently paused
        else {
            clearInterval(timer);
            paused = true;
            $("#pauseButton").html(play);
        }
        
    });
    
    $("#restartButton").click(function(e) {
    e.preventDefault();
    //stop prev counter
    clearInterval(timer);
    //reset time back to original and update display
    customTime.resetClock();
    activeTimer.setText(customTime.getTime());
    activeTimer.set(customTime.getPercent());
    //reset pause data
    paused = false;
    $("#pauseButton").html("<i class='fa fa-pause'></i> PAUSE</a>");
    
    
    //restart counter
    timer = setInterval(function() {
            displayCountDown();
        },1000);

    });

}; // end of activateTimer Panel

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
    
    //if the timerup panel is visible
   // if ($("#timerEndsPanel").css("display") !== "none") {
        
        var timerUpPanelHeight = $("#timerEndsPanel").outerHeight(true);
        var resultsHeight = $("#timerEndsPanel > div").outerHeight(true);
        var paddingNeeded = (timerUpPanelHeight - resultsHeight)/2;
        
        //apply padding to div containing results
        $("#timerEndsPanel > div").css("padding-top", paddingNeeded + "px");
        
    //}
    
}
//call function when page first loads
resizeElements();
$(window).resize(function() {
   resizeElements(); 
});
    
});