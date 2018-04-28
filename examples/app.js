Agent.prototype.live = function () {  // Required: Live function
    // let count = 0;
    for (let i = 0; i < this.dna.length; i++) {
        if (this.dna[i] === evolve[i]) {
            this.score++;
            // this.score += ++count * count;
        }
    }
};

Agent.prototype.mutate = function (rate) {  // Required: Mutate function
    for (let i = 0; i < this.dna.length; i++) {
        if (Math.random() < rate) {
            let letter = randLetter();
            if (letter === undefined) debugger;
            this.dna[i] = letter;
        }
    }
    if (Math.random() < rate) {
        let letter = randLetter();
        this.dna.push(letter);
    }
    if (Math.random() < rate) {
        this.dna.splice(this.dna.length - 1, 1)
    }
};

let evolve = "To be or not to be!";
const MAX_WORD_LENGTH = 10;
const MAX_NUM_OF_WORDS = 5;
let letterbank = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=,./<>?;':[]{}| ";
let ga = new JeneticS();
ga.innoculate(createSentence);  // Pass in a function to create a random Agent
let word = "";
let best = null;

let results = document.getElementById("results");
let killSwitch = 0; // Kill switch to limit iterations.
let genCount = 0;  // Count the number of generations.
while (evolve !== word && killSwitch < 1000) {
    ga.run().generation();
    best = ga.culture.best;
    word = best.dna.join('');
    var p = document.createElement("p");
    results.prepend(`Generation: ${++genCount}   Best: ${word}`, p);
    killSwitch++;
}


function createSentence(index) {
    // Create a sentence with a random number of words.
    let sentence = new Agent();
    // Create a word with a random number of letters.
    let numOfWords = Math.floor(1 + Math.random() * MAX_NUM_OF_WORDS);
    let numOfLetters = Math.floor(1 + Math.random() * MAX_WORD_LENGTH);
    for (let i = 0; i < numOfWords; i++) {
        for (let j = 0; j < numOfLetters; j++) {
            let letter = randLetter();
            sentence.dna.push(letter);
        }
    }
    return sentence;
}

function randLetter() {
    return letterbank.charAt(Math.floor(Math.random() * letterbank.length));
}