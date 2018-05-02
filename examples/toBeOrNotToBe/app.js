Agent.prototype.live = function () { // Required: Live function
    //   Linear increase per correct letter
    // for (let i = 0; i < this.dna.length; i++) {
    //     if (this.dna[i] === evolve[i]) {
    //         this.score++;
    //     }
    // }

    // Try above snippet and below separately
    // Compare results with:  

    //    Exponential increase per correct letter
    let temp = Math.abs(this.dna.length - evolve.length);
    this.score = -(temp*temp); // Penalty for length differences
    let count = 0;
    for (let i = 0; i < this.dna.length; i++) {
        if (this.dna[i] === evolve[i]) {
            this.score += ++count*count;
        }
    }
}

Agent.prototype.mutate = function (rate) { // Required: Mutate function
    for (let i = 0; i < this.dna.length; i++) {
        if (Math.random() < rate) {
            this.dna[i] = randLetter(); // Randomly mutate a letter
        }
    }
    if (Math.random() < rate) {
        this.dna.push(randLetter()); // Randomly increase sentence by a letter
    }
    if (Math.random() < rate) {
        this.dna.splice(this.dna.length - 1, 1) // Randomly decrease sentence by a letter
    }
};

let evolve = "To be or not to be!";
const MAX_WORD_LENGTH = 10;
const MAX_NUM_OF_WORDS = 5;
let letterbank = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=,./<>?;':[]{}| ";
let ga = new JeneticS();
ga.innoculate(createSentence); // Pass in a function to create a random Agent
let word = "";
let best = null;

let results = document.getElementById("results");
let genCount = 0; // Count the number of generations.
while (evolve !== word && genCount < 1000) { // Limit generations to 1000
    ga.run().generation();
    best = ga.culture.best;
    word = best.dna.join('');
    var p = document.createElement("p");
    results.prepend(`Generation: ${++genCount}   Best: ${word}`, p);
}


function createSentence(index) {
    let sentence = new Agent();
    // Create a sentence with a random number of words.
    let numOfWords = Math.floor(1 + Math.random() * MAX_NUM_OF_WORDS);
    for (let i = 0; i < numOfWords; i++) {
        // Create a word with a random number of letters.
        let numOfLetters = Math.floor(1 + Math.random() * MAX_WORD_LENGTH);
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