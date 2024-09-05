// let generateName = require('sillyname');
import generateName from "sillyname";
import superheroes from "superheroes";
import {randomSuperhero} from 'superheroes';

let sillyName = generateName();
console.log(`My name is ${sillyName}`);

// for (let i = 0; i < superheroes.length; i++) {
for (let i = 0; i < 10; i++) {
    console.log(superheroes[i]);
}
const superhero = superheroes[0];
console.log(`I am ${superhero}!`);

const randomHeroe = randomSuperhero();
console.log(`I am ${randomHeroe}!`);
