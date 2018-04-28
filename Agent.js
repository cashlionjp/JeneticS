function Agent() {
    //                                            ____
    // Users are expected to prototype at least a live function 
    // 
    // As well as any others you might need!!
    this.type = null;
    this.score = 1;
    this.weighted = 1;
    this.config = {};
    this.dna = [];
    this.copy = function () {
        let agent = new Agent();
        for (var prop in this.config) {
            if (this.config.hasOwnProperty(prop)) {
                agent.config[prop] = this.config[prop];
            }
        }
        agent.type = this.type;
        agent.dna = this.dna.slice();
        return agent;
    }
}