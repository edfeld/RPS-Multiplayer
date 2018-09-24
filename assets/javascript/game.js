/* 
RPS-Multiplayer Game
*/

$(document).ready(function() {


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
   
    if(snapshot.child("player").exists()) {
        console.log("26 ", snapshot.val().player);
        
        database.ref().once('value', function(snapshot) {
            console.log("30 ", snapshot.child("player").numChildren());
            snapshot.child("player").forEach(function(childSnapshot) {
              var childKey = childSnapshot.key;
              var childData = childSnapshot.val();
              console.log("32 childKey", childKey);
              console.log("33 ", childData);
              console.log("34 playerName: ", childData.playerName);
            });
          });
            
        var myArray = database.ref().child("player").orderByChild('playerNumber');
        console.log("40 ", myArray);
        console.log("41 ", typeof myArray);
       
    }


    if( snapshot.child("turn").exists()) {
        plyersLoaded = snapshot.val().turn;
    } else {
        plyersLoaded = 0;
    }

    if (plyersLoaded === 2) {
        sortie();
    }


    // if(snapshot.child("player").exists() && snapshot.child("playerTwoName").exists()) {
    //     console.log("30 PlayerOneName", snapshot.val().playerOneName);
    //     console.log("31 PlayerTwoName", snapshot.val().playerTwoName);
    // }

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

function PlayersLoaded () {
    let plyersLoaded = 0
    database.ref().once('value', function(snapshot) {
        if( snapshot.child("turn").exists()) {
                plyersLoaded = snapshot.val().turn;
        } else {
            plyersLoaded = 0;
        }
        // snapshot.child("player").exists()

    });
    return plyersLoaded;
}

let player= {
    playerName: "",
    wins: 0,
    losses: 0,

    myPlayerNumber: function() {
        if( localStorage.getItem("playerNumber") === undefined){
            return "";
        } else {
            return localStorage.getItem("playerNumber");
        }
    },
}

function sortie () {

    // Here is RPS logic:
    /*
    // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
      if ((userGuess === "r") || (userGuess === "p") || (userGuess === "s")) {

        if ((userGuess === "r") && (computerGuess === "s")) {
          wins++;
        } else if ((userGuess === "r") && (computerGuess === "p")) {
          losses++;
        } else if ((userGuess === "s") && (computerGuess === "r")) {
          losses++;
        } else if ((userGuess === "s") && (computerGuess === "p")) {
          wins++;
        } else if ((userGuess === "p") && (computerGuess === "r")) {
          wins++;
        } else if ((userGuess === "p") && (computerGuess === "s")) {
          losses++;
        } else if (userGuess === computerGuess) {
          ties++;
        }
        */
}


function writeNewPlayer(username, wins, losses, playerNumber) {
    // a player entry
    var playerData = {
        playerName: username,
        wins: wins,
        losses: losses,
        playerNumber: playerNumber
    };
    
    // Get a key for a new Post.
    var newPlayerKey = database.ref().child('player').push().key;
    // database.ref().child('player').push([{playerName: username, wins: wins, losses: losses}]);
    // // Write the new post's data simultaneously in the posts list and the user's post list.
    
    var updates = {};
    updates['/player/' + newPlayerKey] = playerData;
    
    // database.ref().child('player').push(updates);
    return firebase.database().ref().update(updates);

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
    let playerNum = 0;
    console.log("95 button press")
    // Prevent form from submitting
    event.preventDefault();

    
    let currPlyerLoaded = PlayersLoaded();
    console.log("174 players loaded: ", currPlyerLoaded);

    let txtPlayerOne = $("#player1-name").val();
    // let txtPlayerTwo = $("#player2-name").val();

    
    // Test to see if PlayerOneName is empty before updating the database and localstorage
    if((txtPlayerOne !== "") && currPlyerLoaded < 2 ) {
        
        playerNum = currPlyerLoaded + 1;

        localStorage.setItem("playerNumber", playerNum);
        // database.ref().child("player").child("playerName").push().setValue(txtPlayerOne);

        writeNewPlayer(txtPlayerOne, 0, 0, playerNum); 
        database.ref().update({
             turn: playerNum
         });
    }
    console.log("132 player Number: ", playerNum);

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
            playerTwoName: txtPlayerTwo,
            playerNumber: "2"
        });
    }

    console.log("147 player Number: ", player.myPlayerNumber());

});

// $(window).onbeforeunload(function() {
//     alert('Handler for .unload() called.');
// });

}) // $(document).ready(function(){})
