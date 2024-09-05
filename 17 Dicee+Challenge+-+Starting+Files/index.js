// Random numbers
let randomNumberDice1 = Math.random() * 6;
randomNumberDice1 = Math.floor(randomNumberDice1) + 1;

let randomNumberDice2 = Math.random() * 6;
randomNumberDice2 = Math.floor(randomNumberDice2) + 1;

// Will select the img(HTML structure);
const elementImg1 = document.getElementsByClassName("img1");
const elementImg2 = document.getElementsByClassName("img2");

// Because is an array, we loop, and select the src, and change the src:
for (let i = 0; i < elementImg1.length; i++) {
    // Will be the path to image
    let pathImg = elementImg1[i].src.slice(0, elementImg1[i].src.length - 5);
    pathImg = pathImg + "" + randomNumberDice1 + ".png";

    elementImg1[i].src = pathImg;
}

for (let i = 0; i < elementImg2.length; i++) {
    // Will be the path to image
    let pathImg = elementImg2[i].src.slice(0, elementImg2[i].src.length - 5);
    pathImg = pathImg + "" + randomNumberDice2 + ".png";

    elementImg2[i].src = pathImg;
}

// Change the HTML H1:
let h1 = document.querySelector("h1");

if (randomNumberDice1 > randomNumberDice2) {
    h1.innerHTML = "🚩 Player 1 Win";
} else if (randomNumberDice1 < randomNumberDice2) {
    h1.innerHTML = "Player 2 Win 🚩";
} else {
    h1.innerHTML = "Draw! 👀";
}

