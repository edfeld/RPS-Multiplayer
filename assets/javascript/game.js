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

    database.ref().on('value', function(snapshot){
        if(snapshot.child("chat").exists()) { 
            console.log("24: ", snapshot.child("chat").val());
            $("#chat-output").empty();
            // chatter = $("<p>").text(snapshot.child("chat").val())
            $("#chat-output").html(snapshot.child("chat").val());
        }
    });

    database.ref().on("value", function(snapshot) {
        console.log(snapshot.child());

        if(snapshot.child("player").exists()) {
            console.log("26 ", snapshot.val().player);

            var childKey;
            var childData;
            database.ref().once('value', function(snapshot) {
                console.log("30 ", snapshot.child("player").numChildren());
                snapshot.child("player").forEach(function(childSnapshot) {
                    childKey = childSnapshot.key;
                    childData = childSnapshot.val();
               
                    console.log("32 childKey", childKey);
                    console.log("33 ", childData);
                    console.log("38 playerName: ", childData.playerName);
                    if (typeof childData.playerNumber === "undefined" ) {
                        console.log("43 No ChildData", typeof childData.playerNumber);
                    } else if (childData.playerNumber === 1) {
                        console.log("45: Update Player One Name")
                        $("#playerOneName").text(childData.playerName.toUpperCase());
                        $("#p1Wins").text(childData.wins.toString());
                        $("#p1Losses").text(childData.losses.toString());
                    }  else if (childData.playerNumber === 2) {
                        $("#playerTwoName").text(childData.playerName.toUpperCase());
                        $("#p2Wins").text(childData.wins.toString());
                        $("#p2Losses").text(childData.losses.toString());
                    }
                });
            });

            var myArray = database.ref().child("player").orderByChild('playerNumber');
            console.log("40 ", myArray);
            console.log("41 ", typeof myArray);
        
        }

        let whoseTurn = 0;

        if( snapshot.child("turn").exists()) {
            whoseTurn = snapshot.val().turn;
        } else {
            whoseTurn = 0;
        }


        if (whoseTurn === 1) {
            console.log("55 Turn 1");
            getPlayerOneToken();
        }

        if(whoseTurn === 2 ) {
            console.log("60 turn 2");
            getPlayerTwoToken();
        }

        if (whoseTurn === 3) {
            console.log("65. Turn 3")
            var time = setTimeout(() => {
                sortie();
            }, 2000);
            
        }


    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    function getPlayerByNumber (playNum) {
        var childPlayerName;
        var childPlayerNumber;
        var wins;
        var losses;
        var myPlayer = {};

        database.ref().once('value', function(snapshot){
            if( snapshot.child("player").exists()) {
                snapshot.child('player').forEach(function(childSnapshot){
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    console.log("91 childData: ", childData);
                    console.log("97 type of childData: ", typeof childData);
                    if(childSnapshot.val().playerNumber === playNum) {
                        myPlayer = JSON.parse(JSON.stringify(childData)) ;
                        // myPlayer.key = childKey;
                        myPlayer.key = childKey;
                    }
                    // childPlayerNumber.push(childData.playerNumber);
                    childPlayerNumber = childData.playerNumber;
                });
            }
            console.log("105 myPlayer: ", myPlayer);
            console.log("107 myPlayer.playerName: ", myPlayer.playerName);

        });
        console.log("95 childPlayerNumber: ", childPlayerNumber);
        return myPlayer;

    } 

    function PlayersLoaded () {
        let plyersLoaded = 0
        database.ref().once('value', function(snapshot) {
            if( snapshot.child("player").exists()) {
                    plyersLoaded = snapshot.child("player").numChildren();
                } 
            
            // snapshot.child("player").exists()

        });
        console.log("93 PlayersLoaded: ", plyersLoaded);
        return plyersLoaded;
    }

    function updatePlayerWins (pNumber){
        console.log("131 Update Player Wins, PlayerNumber: ", pNumber);
        let playerObj = JSON.parse(JSON.stringify(getPlayerByNumber(pNumber)));
        playerObj.wins++;
        updatePlayer(playerObj);
    }
    
    function updatePlayerLosses (pNumber) {
        console.log("152 Update Player Wins, PlayerNumber: ", pNumber);
        let playerObj = JSON.parse(JSON.stringify(getPlayerByNumber(pNumber)));
        playerObj.losses++;
        updatePlayer(playerObj);
    }
    let player = {
        playerName: "",
        wins: 0,
        losses: 0,
        playerNumber: 0,
        key: "" 
    }

    function getPlayerOneToken(){
        console.log("108 getPlayerOneToken");
        $("#game-status").text("Player One to choose");
        if (player.playerNumber === 1) {
            $(".p1Item").removeClass("invisible");
        }
    }

    function getPlayerTwoToken(){
        console.log("112 getplayertwotokey");
        $("#game-status").text("Player Two to choose");
        if (player.playerNumber === 2) {
            $(".p2Item").removeClass("invisible");
        }
    }
    function sortie () {
        var playerOneChoice;
        var playerTwoChoice;
        let gameStatus = "";
        // Get choices: 
        database.ref().once('value', function(snapshot){
            if( snapshot.child("player").exists()) {
                snapshot.child('player').forEach(function(childSnapshot){
                    var childKey = childSnapshot.key;
                    var childData = childSnapshot.val();
                    console.log("91 childData: ", childData);
                    console.log("97 type of childData: ", typeof childData);
                    if(childSnapshot.val().playerNumber === 1) {
                        playerOneChoice = childSnapshot.val().choice;
                    } else if (childSnapshot.val().playerNumber === 2) {
                        playerTwoChoice = childSnapshot.val().choice;
                    }
                    
                    // childPlayerNumber.push(childData.playerNumber);
                    // childPlayerNumber = childData.playerNumber;
                });
            }
            console.log("179 playerOneChoice: ", playerOneChoice);
            console.log("180 playerTwoChoice: ", playerTwoChoice);

        });

        // Here is RPS logic:
        
        // This logic determines the outcome of the game (win/loss/tie), and increments the appropriate number
        if ((typeof playerOneChoice !== "undefined") && (typeof playerTwoChoice !== "undefined")) {
            console.log("199 playerOneChoice: ", playerOneChoice);
            console.log("199 playerTwoChoice: ", playerTwoChoice);
            winner = 0;
            losser = 0;
            if ((playerOneChoice === "r") && (playerTwoChoice === "s")) {
                winner = 1;
                losser = 2;
                gameStatus = "Player One wins with Rock!";
            } else if ((playerOneChoice === "r") && (playerTwoChoice === "p")) {
                winner = 2;
                losser = 1;
                gameStatus = "Player Two wins with Paper!";
            } else if ((playerOneChoice === "s") && (playerTwoChoice === "r")) {
                winner = 2;
                losser = 1;
                gameStatus = "Player Two wins with Rock!";
            } else if ((playerOneChoice === "s") && (playerTwoChoice === "p")) {
                winner = 1;
                losser = 2;
                gameStatus = "Player One wins with Scissors!";
            } else if ((playerOneChoice === "p") && (playerTwoChoice === "r")) {
                winner = 1;
                losser = 2;
                gameStatus = "Player One wins with Paper!!";
            } else if ((playerOneChoice === "p") && (playerTwoChoice === "s")) {
                winner = 2;
                losser = 1;
                gameStatus = "Player Two wins with Scissors";
            } else if (playerOneChoice === playerTwoChoice) {
                gameStatus = "Players Tie!!";   
            }
            
            $("#game-state").text(gameStatus);
            $("#game-state").removeClass("invisible");
            if (winner > 0 && losser > 0) {
                updatePlayerWins(winner);
                updatePlayerLosses(losser);
            }
            let timer = setTimeout(function(){
                $("#game-state").addClass("invisible");
                database.ref().update({
                    turn: 1
                })
            }, 2000);
        }  
    }

    function updatePlayer(playerObj) {
        console.log("228 playerObj: ", playerObj);
        
        var playerData = {
            losses: playerObj.losses,
            playerName: playerObj.playerName,
            playerNumber: playerObj.playerNumber,
            wins: playerObj.wins
        }; 
    
        var updates = {};
        updates['/player/' + playerObj.key] = playerData;
        
        return firebase.database().ref().update(updates);

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
        player.key = database.ref().child('player').push().key;

        var updates = {};
        updates['/player/' + player.key] = playerData;
        
        // database.ref().child('player').push(updates);
        return firebase.database().ref().update(updates);

    }

    function addToChat (chatText) {
        let chatOuput;
        database.ref().once('value', function(snapshot){
            if(snapshot.child("chat").exists()) { 
                console.log("315: ", snapshot.child("chat").val());
                if (player.playerNumber === 1) {
                    chatOuput = snapshot.child("chat").val();
                    chatOuput += "<p class='text-secondary'>p1: " + chatText + "</p>";
                    database.ref().update({
                        chat: chatOuput
                    });
                } else if (player.playerNumber === 2) {
                    chatOuput = snapshot.child("chat").val(); 
                    chatOuput += "<p class='text-success'>p2: " + chatText + "</p>";
                    database.ref().update({
                        chat: chatOuput
                    });
                }
            } else {
                if (player.playerNumber === 1) {
                    chatOuput = "<p class='text-secondary'>p1: " + chatText + "</p>";
                    database.ref().update({
                        chat: chatOuput
                    });
                } else if (player.playerNumber === 2) {
                    chatOuput = "<p class='text-success'>p2: " + chatText + "</p>";
                    database.ref().update({
                        chat: chatOuput
                    });
                }
            }
        });
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

    // User clicks the "join Game" button for player 1
    $("#playerJoin").on("click", function(event) {
        let playerNum = 0;
        console.log("95 button press")
        // Prevent form from submitting
        event.preventDefault();
        
        let currPlyerLoaded = PlayersLoaded();
        console.log("174 players loaded: ", currPlyerLoaded);

        let txtPlayerName = $("#player-name").val();
        // let txtPlayerTwo = $("#player2-name").val();
        
        $("#player-name").val("");
        // Test to see if PlayerOneName is empty before updating the database and localstorage
        if((txtPlayerName !== "") && currPlyerLoaded < 2 ) {
            
            player.playerNumber = currPlyerLoaded + 1;
            
            writeNewPlayer(txtPlayerName.toUpperCase(), 0, 0, player.playerNumber); 
            if (player.playerNumber === 2) {
                $("#playerTwoName").text(txtPlayerName.toUpperCase());

                database.ref().update({
                    turn: 1
                });
                
            } else {
                $("#playerOneName").text(txtPlayerName.toUpperCase());
            }
        }
        console.log("132 player Number: ", player.playerNumber);
        $("#PlayerRegistration").addClass("invisible");
    });

    // Select Rock, Paper, Scissors item
    $(".item").on("click", function() {
        console.log("318 onclick item")
        console.log("319 PlayerNumber: ", player.playerNumber);
        var selectionItem = $(this).attr("selectItem");

        var playerObject = JSON.parse(JSON.stringify(getPlayerByNumber(player.playerNumber)));

        // var query = database.ref().child("player")
        //                 .orderByChild("playerNumber")
        //                 .equalTo(1)
        //                 .limitToFirst(1);
        // console.log("302 query ", query);
                        
        // var newPlayerKey = database.ref().child('player')
        //                             .orderByChild("playerNumber")
        //                             .equalTo("1")
        //                             .limitToFirst(1);

        console.log("287 playerObject: ", playerObject);
        var playerData = {
            choice: selectionItem,
            losses: playerObject.losses,
            playerName: playerObject.playerName,
            playerNumber: playerObject.playerNumber,
            wins: playerObject.wins
        }; 
        
        var updates = {};

        if (player.playerNumber === 1) {
            $(".p1Item").addClass("invisible");
            database.ref().update({
                turn: 2
            });
        } else if (player.playerNumber === 2){
            $(".p2Item").addClass("invisible");
            database.ref().update({
                turn: 3
            });
        }
        updates['/player/' + playerObject.key] = playerData;
        
        // database.ref().child('player').push(updates);
        firebase.database().ref().update(updates);
    });

    $(".item").hover(
        function () {
            $(this).addClass("bg-info text-white");
        }, function () {
            $(this).removeClass("bg-info text-white");
        }
     )

    $("#dbKill").on("click", function(){
        console.log("DB Kill!!!")
        let kill = confirm("Are you sure??");
        console.log("448 confirm Kill=", kill);
        if (kill = true) {
            console.log("447 Kill database: ", kill)
            database.ref().child("player").remove();
            database.ref().child("turn").remove();
            database.ref().child("chat").remove();
        }
    });

    // Add chat text to the chat
    $("#playerChat").on("click", function() {
        event.preventDefault();
        
        console.log("507 chat clicked");

        let chatText = $("#chatBox").val();
        console.log("chatText: " + chatText);
        if (chatText !== "") {
            addToChat(chatText);
        }
        $("#chatBox").val("");

    });

}) // $(document).ready(function(){})
