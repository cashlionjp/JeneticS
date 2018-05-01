class JeneticS {
    constructor(config) {
        this.culture = null;
        this.settings = {
            mutationRate: 0.01, // Rate of mutation
            population: 500, // Population of Agents in Culture
            crossoverMethod: "all", // "all" "half" "alternate"
            elitism: 0.1, // Percentage of additional mutated elites
            eliteMutationMultiplier: 5 // Multiplier for elite mutation rate
        };

        for (let param in config) {
            // Update out settings with config params
            this.settings[param] = config[param];
        }

        this.load = function (initialPopulation) {
            if (typeof initialPopulation === "Culture") {
                this.culture = initialPopulation;
            }
        };

        this.save = function (path) {
            // TODO
        };

        this.innoculate = function (createCitizen, population = this.settings.population) {
            this.settings.population = population;
            this.culture = new Culture(createCitizen, population);
            return this.culture;
        };

        this.health = function () {
            let output = [];
            this.culture.citizens.forEach(element => {
                output.push(element.dna.join(''));
            });
            return output;
        };

        this.run = function () {
            let self = this;
            return {
                generation: function () {
                    // Natural Selection
                    self.culture.naturalSelection(); // " Live or Fitness functions called "
                    // Normalize Data
                    self.culture.normalize();
                    // Crossover
                    self.culture.crossover()[self.settings.crossoverMethod]();
                    // Mutate
                    self.culture.mutate(self.settings.mutationRate, self.settings.elitism, self.settings.eliteMutationMultiplier);
                },
                continuous: function () {
                    // TODO
                }
            };
        };
    }
}


// Holds and manages the population of Agents within the Sim
class Culture {
    constructor(createCitizen, population) {
        if (isNaN(population)) {
            throw "Please use a number";
        } else if (typeof createCitizen !== 'function') {
            throw "Expected function as first argument. Please define a function to create citizens.";
        }

        this.population = population;
        this.best = null;
        this.fitnessRange = {
            low: Infinity,
            high: -Infinity
        };

        this.citizens = [];
        this.census = [];
        this.nextGeneration = [];

        for (let i = 0; i < population; i++) {
            this.citizens.push(createCitizen(i));
            this.census.push(i);
        }

        this.genCensus = function () {
            if (this.census.length !== this.citizens.length) {
                return Array.apply(null, Array(this.citizens.length)).map((x, i) => i);
            }
            return this.census;
        };

        this.naturalSelection = function () {
            this.best = null;
            this.fitnessRange.low = Infinity;
            this.fitnessRange.high = -Infinity;
            this.liveOneEpoch();
        };

        this.crossover = function () {
            let self = this;

            function randomCitizen() {
                return self.citizen(self.util.randFloor(self.population));
            }

            function selectCitizen() {
                // TODO - decide how to handle potential infinite loops
                while (true) {
                    // Selects a citizen of the culture probabalistically based on weighted score
                    let rand = self.util.random();
                    let agent;
                    for (let i = 0; i < self.citizens.length; i++) {
                        agent = self.citizen(i);
                        if (rand < agent.weighted) {
                            return agent;
                        } else {
                            rand -= agent.weighted;
                        }
                    }
                }
            }

            function getParents() {
                // returns a set of candidate parents
                let father = selectCitizen();
                let mother = selectCitizen();
                return [mother, father];
            }

            function splitArray(arr, mother = false) {
                if (arr && arr.length) {
                    let halfway = self.util.floor(arr.length / 2);
                    if (mother) {
                        return arr.slice(0, halfway);
                    } else {
                        return arr.slice(halfway);
                    }
                }
                return [];
            }

            function half(i) {
                let [mother, father] = getParents();
                let child = new Agent({live: mother.live, mutate: mother.mutate});
                mother = splitArray(mother.dna, true);
                father = splitArray(father.dna);
                child.dna = mother.concat(father);
                self.nextGeneration.push(child);
            }

            function alternate(i) {
                let [mother, father] = getParents();
                let child = new Agent({live: mother.live, mutate: mother.mutate});
                child.dna = mother.dna.filter((element, index) => {
                    return index % 2 === 0;
                }).reduce(function (arr, v, i) {
                    return arr.concat(v, father.dna.filter((element, index) => {
                        return index % 2 === 1;
                    })[i]);
                }, []);
                let dadLength = father.dna.length;
                let momLength = mother.dna.length;
                if (dadLength < momLength) {
                    child.dna.concat(mother.dna.slice(dadLength));
                } else {
                    child.dna.concat(father.dna.slice(momLength));
                }
                child.dna = child.dna.filter(function (n) {
                    return n != undefined;
                });
                self.nextGeneration.push(child);
            }

            function all(i) {
                if (self.util.randFloor(10) % 2) {
                    half(i);
                } else {
                    alternate(i);
                }
            }

            function createGeneration(callback) {
                self.nextGeneration = [];
                while (self.nextGeneration.length < self.population) {
                    callback(self.nextGeneration.length);
                }
            }

            return {
                all: function () {
                    createGeneration(all);
                },
                half: function () {
                    createGeneration(half);
                },
                alternate: function () {
                    createGeneration(alternate);
                }
            };
        };

        this.mutate = function (rate, elitism, multiplier = 2) {
            for (let i = 1; i < this.nextGeneration.length; i++) {
                let agent = this.nextGeneration[i];
                agent.mutate(agent, rate);
            }
            let numOfElites = this.util.floor(this.population * elitism);
            for (let i = 1; i < numOfElites; i++) {
                let clone = this.best.copy();
                clone.mutate(clone, rate * multiplier);
                this.nextGeneration.push(clone);
            }
            this.nextGeneration.push(this.best);
            this.citizens = this.nextGeneration;
            this.census = this.genCensus();
        };

        this.citizen = function (index) {
            return this.citizens[this.census[index]];
        };

        this.shuffle = function () {
            // Knuth Shuffle
            var loc = this.census.length,
                temp, randIndex;
            // While there remain elements to shuffle…
            while (loc) {
                // Pick a remaining element…
                randIndex = Math.floor(Math.random() * len--);
                // And swap it with the current element.
                temp = this.census[loc];
                this.census[loc] = this.census[randIndex];
                this.census[randIndex] = temp;
            }
        };

        this.liveOneEpoch = function () {
            for (let i = 0; i < this.citizens.length; i++) {
                let agent = this.citizen(i);
                agent.live(agent);
                this.fitnessRange.low = agent.score < this.fitnessRange.low ? agent.score : this.fitnessRange.low;
                if (agent.score > this.fitnessRange.high) {
                    this.fitnessRange.high = agent.score;
                    this.best = agent.copy();
                }
            }
        };

        this.normalize = function () {
            let total = 0;
            for (let i = 0; i < this.citizens.length; i++) {
                let agent = this.citizen(i);
                agent.score = this.util.map(agent.score, this.fitnessRange.low * 2 / 3, this.fitnessRange.high * 1.5, 0, 100);
                total += agent.score;
            }
            // Compute Weighted Scores
            for (let i = 0; i < this.citizens.length; i++) {
                let agent = this.citizen(i);
                agent.weighted = agent.score / total;
            }
        };

        this.util = {
            map: function (num, inMin, inMax, outMin, outMax) {
                return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
            },
            random: Math.random,
            floor: Math.floor,
            randFloor: function (val) {
                return this.floor(this.random() * val);
            }
        };
    }
}


// class Agent {
//     constructor() {
//         //                                          ____     ______
//         // Users are expected to prototype at least live and mutate functions
//         // 
//         // As well as any others you might need!!
//         this.type = null;
//         this.score = 1;
//         this.weighted = 1;
//         this.config = {};
//         this.dna = [];
//         this.copy = function () {
//             let agent = new Agent();
//             for (var prop in this.config) {
//                 if (this.config.hasOwnProperty(prop)) {
//                     agent.config[prop] = this.config[prop];
//                 }
//             }
//             agent.type = this.type;
//             agent.dna = this.dna.slice();
//             return agent;
//         };
//     }
// }
class Agent {
    constructor({
        live,
        mutate,
        weighted,
        score,
        type,
        dna,
        config
    }) { // live and mutate are required 
        if (!live || typeof live !== 'function') {
            throw new Error('Agents need a live function.');
        }

        if (!mutate || typeof mutate !== 'function') {
            throw new Error('Agents need a mutate function.');
        }

        this.score = score || 1;
        this.type = type || null;
        this.weighted = weighted || 1;
        this.dna = dna || [];
        this.config = config || {};
        this.live = live;
        this.mutate = mutate;

    }

    set(key, value) {
        this[key] = value;
        return this;
    }

    // copy was a instance property, and not a prototype method. 
    // That means this was being recreated for each Agent instance. 
    copy() {
        return new Agent({
            live: this.live,
            mutate: this.mutate,
            type: this.type,
            score: 1,
            weighted: this.weighted,
            dna: this.dna,
            config: this.config
        });
    }

    live() {
        return this.live(this);
    }

    mutate(rate) {
        return this.mutate(this, rate);
    }
}