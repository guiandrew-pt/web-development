// Detecting Button Press
const buttonsList = document.querySelectorAll(".drum");

for(let i = 0; i < buttonsList.length; i++) {
    buttonsList[i].addEventListener("click", function () {
        makeSoundWithKey(buttonsList[i].innerHTML);
        buttonAnimation(buttonsList[i].innerHTML);
    });
}

// Detecting Keyboard Press
document.addEventListener("keypress", function(event) {
    //console.log(event);
    makeSoundWithKey(event.key);
    buttonAnimation(event.key);
});

function makeSoundWithKey(key) 
{
    let audio;

    switch (key) {
        case 'w':
            audio = new Audio("./sounds/tom-1.mp3");
            audio.play();
            break;
    
        case 'a':
            audio = new Audio("./sounds/tom-2.mp3");
            audio.play();
            break;

        case 's':
            audio = new Audio("./sounds/tom-3.mp3");
            audio.play();
            break;
        
        case 'd':
            audio = new Audio("./sounds/tom-4.mp3");
            audio.play();
            break;
        
        case 'j':
            audio = new Audio("./sounds/snare.mp3");
            audio.play();
            break;

        case 'k':
            audio = new Audio("./sounds/crash.mp3");
            audio.play();
            break;

        case 'l':
            audio = new Audio("./sounds/kick-bass.mp3");
            audio.play();
            break;
        
        default: 
            console.log(key);
    }
}

function buttonAnimation(key) {
    let activeButton = document.querySelector("." + key);
    activeButton.classList.add("pressed");

    setTimeout(function() {
        activeButton.classList.remove("pressed");
    }, 200);
}