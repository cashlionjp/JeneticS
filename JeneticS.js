function JeneticS(config) {
    this.culture = null;
    this.settings = {
        mutationRate: 0.01,
        population: 500,
        crossoverMethod: "all",
        elitism : 0.1,
        eliteMutationMultiplier: 5
    }

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

    this.check = function () {
        for (let i = 0; i < this.culture.population; i++) {
            this.culture.citizen(i).check();
        }
    }

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

    this.util = function () {

        return {
            sortedIndex: function (array, value) {
                var low = 0,
                    high = array.length;

                while (low < high) {
                    var mid = low + high >>> 1;
                    if (array[mid] < value) low = mid + 1;
                    else high = mid;
                }
                return low;
            }
        };
    };
}