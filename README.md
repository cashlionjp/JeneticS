# JeneticS
Genetic Algorithm Library in JS

A genetic algorithm is more or less a universal function approximator.  After some initial (usually randomized) population is created, the algorithm loops through the following processes:
* __Fitness__ - Assessing how well an indiviual performs.
* __Crossover__ ( reproduction ) - The fittest individuals have a higher probability to pass on DNA.
* __Mutation__ - Random mutations supply the necessary entropy to navigate the search space.
Repeatedely, such that said population evolves towards an optimal solution.

[More Reading Material Here](https://en.wikipedia.org/wiki/Genetic_algorithm)

# Installation:
Include Jenetics.js or Jenetics.min.js
```html
<script src="path/to/JeneticS.js"></script>
<script src="path/to/your/app.js"></script>
```

Node specific usage coming soon.

# Usage:
Define a live (fitness) and mutate functions for your Agent.
```javascript
Agent.prototype.live = function () {  // Example: Live function
    for (let i = 0; i < this.dna.length; i++) {
        if (this.dna[i] === evolve[i]) {
            this.score++;
        }
    }
};

Agent.prototype.mutate = function (rate) {  // Example: Mutate function
    for (let i = 0; i < this.dna.length; i++) {
        if (Math.random() < rate) {
            // MUTATE DNA
        }
    }
    
    // OR
    
    if (Math.random() < rate) {
        // MUTATE AGENT
    }
};
```

Create a function to define random Agents

```javascript

function createAgent(index) {
    // Create an agent
    let agent = new Agent();
    agent.dna = [/* Populate according to your needs */]
    return agent;
}
```

Create a Genetic Algorithm instance and innoculate the culture:
```javascript
let geneticAlgorithm = new JeneticS();
geneticAlgorithm.innoculate(createAgent); // Pass in a function to create a random Agent
```

Simulate a generation
```javascript
geneticAlgorithm.run().generation();
```

Access the fittest individual, the entire population, or by index.
```javascript
best = geneticAlgorithm.culture.best;

allIndividuals = geneticAlgorithm.culture.citizens;

let i = 2;
byIndex = geneticAlgorithm.culture.citizen(i);
```
