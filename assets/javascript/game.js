/* 
RPS-Multiplayer Game
*/



  // Initialize Firebase
var config = {
    apiKey: "AIzaSyBpFFUzSnNg3hDM4uwky1acX_7yzUc2HVA",
    authDomain: "rockpaperscissors-bbcb4.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-bbcb4.firebaseio.com",
    projectId: "rockpaperscissors-bbcb4",
    storageBucket: "rockpaperscissors-bbcb4.appspot.com",
    messagingSenderId: "86368449912"
};

  
firebase.initializeApp(config);

const database = firebase.database();

database.ref().on("value", function(snapshot) {
    console.log(snapshot.child());
   

    if(snapshot.child("playerOneName").exists() && snapshot.child("playerTwoName").exists()) {
        console.log("26 PlayerOneName", snapshot.val().playerOneName);
        console.log("27 PlayerTwoName", snapshot.val().playerTwoName);
        
    }

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

let player= {
    myPlayerNumber: function(){
        if( localStorage.getItem("playerNumber") === undefined){
            return "";
        } else {
            return localStorage.getItem("playerNumber");
        }
    },
    wins: 0,
    losses: 0
}

var stopwatch = {

    time: 0,
    timeLimit: 21,

    start: function() {
  
      // DONE: Use setInterval to start the count here and set the clock to running.
      if (!clockRunning) {
        stopwatch.time= this.timeLimit;
        intervalId = setInterval(stopwatch.count, 1000);
        clockRunning = true;
      }
    },
    stop: function() {
  
      // DONE: Use clearInterval to stop the count here and set the clock to not be running.
      console.log("208. clockRunning: " + clockRunning);
      clearInterval(intervalId);
      clockRunning = false;
    },
    
    count: function() {
  
      // DONE: increment time by 1, remember we cant use "this" here.
      stopwatch.time--;
        
      // Test for 'time is up'. 
      if (stopwatch.time <= 0) {
        stopwatch.stop();
        triviaGame.losses++;
        triviaGame.timeOutPopModal( triviaGame.getCorrectAnswer());
        console.log("234. question not answered in time.  Loses: " + triviaGame.losses);   

      }
      // DONE: Get the current time, pass that into the stopwatch.timeConverter function,
      //       and save the result in a variable.
      var converted = stopwatch.timeConverter(stopwatch.time);
      console.log(converted);
  
      
      $("#display").text(converted);
    },
 
    //  Use the variable we just created to show the converted time in the "display" div.
    timeConverter: function(t) {
  
      var minutes = Math.floor(t / 60);
      var seconds = t - (minutes * 60);
  
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
  
      if (minutes === 0) {
        minutes = "00";
      }
      else if (minutes < 10) {
        minutes = "0" + minutes;
      }
  
      return minutes + ":" + seconds;
    }
  };

// Whenever a user clicks the "join Game" button for player 1
$("#player1Join").on("click", function(event) {
    console.log("95 button press")
    // Prevent form from submitting
    event.preventDefault();
    
    let txtPlayerOne = $("#player1-name").val();
    // let txtPlayerTwo = $("#player2-name").val();

    
    // if( txtPlayerTwo.trim() === "") { 
    //     txtPlayerTwo = "empty";
    // }
    
    // Test to see if PlayerOneName is empty before updating the database and localstorage
    if(txtPlayerOne !== "") {
        localStorage.setItem("playerNumber", 1);
        database.ref().update({
            playerOneName: txtPlayerOne
        });
    }
    console.log("132 player Number: ", player.myPlayerNumber());

});

// When a user clicks the join button for player 2
$("#player2Join").on("click", function(event) {
    // Prevent form from submitting
    console.log("117 button press")
    event.preventDefault();
    
    let txtPlayerTwo = $("#player2-name").val();
    // let txtPlayerOne = $("#player1-name").val();
    
    // Test to see if other player name is empty (P1)
    // if (txtPlayerOne === "") {
    //     txtPlayerOne = "empty";
    // }
    
    // test to see if the player two name is empty before updating localStorage and FireBase
    if(txtPlayerTwo !== "") {
        localStorage.setItem("playerNumber", 2);
        database.ref().update({
            playerTwoName: txtPlayerTwo
        });
    }

    console.log("147 player Number: ", player.myPlayerNumber());

});
