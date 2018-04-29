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