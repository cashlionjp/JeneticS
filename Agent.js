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