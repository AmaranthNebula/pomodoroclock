$(document).ready(function() {
    //function to creat time object
   var  Time = function (m, s) {
        var minutes = m;
        var seconds = s;  
        var milliseconds = ((minutes*60) + seconds) * 1000;
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

            
            
        }
        
        this.decrement = function() {
            milliseconds -= 1000;
            var current = Math.round(milliseconds/1000);
            if (current >= 60) {
                minutes = Math.floor(current/60);
                seconds = current % 60;
            } else {
                minutes = 0;
                seconds = current;
            }            
            // convertFromMS();
            // if (seconds < 0 && minutes > 0) {
            //     minutes -= 1;
            //     seconds = 59;
            // } else if (minutes < 0 || seconds < 0){
            //     minutes = 0;
            //     seconds = 0;
            // }
        }
        this.setTime = function(m, s) {
            minutes = m;
            seconds = s;
        }
        this.getMilliseconds = function() {
            return milliseconds;
        }
}
var customTime = new Time(0,5);
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
    
    
    activeTimer.animate(1.0);

    function displayCountDown() {
        customTime.decrement();
        activeTimer.setText(customTime.getTime());
        
        if (customTime.getTime() === "00:00") {
            end();
        }
        
    }; 
        var timer = setInterval(function() {
            displayCountDown();
        },900);

    function end () {
        console.log("called");
        clearInterval(timer);
        timer =0;
    }  


function resizeElements() {
    var height = $("#timerPanel").outerHeight(true);
    var width = $("#timerPanel").outerWidth(true);
    
    var timerDiameter = Math.round(Math.min(height, width)*0.8); 
   
   
    $("#dialBorder").css("height", timerDiameter + "px");
    $("#dialBorder").css("width", timerDiameter + "px");
    
}
resizeElements();
    
});