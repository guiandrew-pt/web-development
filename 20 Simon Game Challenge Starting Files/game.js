const buttonColours = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];

let increaseLevel = 0;
let started = false;

$(document).keypress(function(event) {
    // console.log(event.key);
    if (!started) {
        $("#level-title").text("Level " + increaseLevel);
        nextSequence();
        started = true;
    }
});

$(".btn").click(function() {
    // Detecting button clicked
    let userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    let indexOfTheLastAnswer = userClickedPattern.length - 1;
    checkAnswer(indexOfTheLastAnswer);
});

function nextSequence() {
    userClickedPattern = [];
    
    // Create a random number, between 0 and 3:
    let randomNumber = Math.floor(Math.random() * 4);
    increaseLevel++;

    $("#level-title").text("Level " + increaseLevel);

    // add the color from array buttonColours in the random position to the variable randomChosenColour:
    let randomChosenColour = buttonColours[randomNumber];

    // add the color to the end of the array gamePattern:
    gamePattern.push(randomChosenColour);

    // $("#" + randomChosenColour).addClass("pressed");
    $("#" + randomChosenColour).fadeIn(120).fadeOut(120).fadeIn(120);

    playSound(randomChosenColour);

    // console.log(gamePattern);
    // console.log(randomNumber);
    // console.log(userClickedPattern);
}

function playSound(name) {
    let audio = new Audio("./sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColour) {
    let currentButtonPressed = $("#" + currentColour);
    currentButtonPressed.addClass("pressed");

    setTimeout(function() {
        currentButtonPressed.removeClass("pressed");
    }, 150);
}

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1200);
        }
        
        // console.log("success");
    } else {
        playSound("wrong");
        $("body").addClass("game-over");
        $("#level-title").text("Game Over, Press Any Key To Restart");
        
        // console.log("wrong");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 250);

        startOver();
    }
}

function startOver() {
    increaseLevel = 0;
    started = false;

    gamePattern = [];
}


