/**
 * Establish each MMRPG dice type here as extensions of DiceTerm.
 * @extends {DiceTerm}
 */
export class MarvelDie extends DiceTerm {
      
    constructor(termData) {
        super(termData);
        this.faces = 6;
    }

    /* -------------------------------------------- */
    /** @override */
    static DENOMINATION = "m";

    /** @inheritdoc */
    static MODIFIERS = {
        "r": Die.prototype.reroll,
        "rr": Die.prototype.rerollRecursive,
        "k": Die.prototype.keep,
        "kh": Die.prototype.keep,
        "kl": Die.prototype.keep,
        "d": Die.prototype.drop,
        "dh": Die.prototype.drop,
        "dl": Die.prototype.drop
    }

    
    /* -------------------------------------------- */
    /** @override */


    /* -------------------------------------------- */
    /** @override */
    get formula() {
        return `${this.number}${this.constructor.DENOMINATION}${this.modifiers.join("")}`;
    }

    /* -------------------------------------------- */
    /** @override */
    evaluate({ minimize = false, maximize = false } = {}) {
        if (this._evaluated) {
            throw new Error(`This ${this.constructor.name} has already been evaluated and is immutable`);
        }

        // Roll the initial number of dice
        for (let n = 1; n <= this.number; n++) {
            this.roll({ minimize, maximize });
        }

        // Apply modifiers
        this._evaluateModifiers();
        for (let r of this.results) {
            let fantastic = DiceTerm.compareResult(r.result, "=", 1);
            if(fantastic){
                r.count = r.total = 6;
                r.keep = true;
                r.active = r.success = true;
                r.failure = r.discarded = false;
            }
        };
        this._evaluated = true;
        this._isMarvel = true;
        return this;
    }

    /* -------------------------------------------- */
    /** @override */
    roll(options) {
        const roll = super.roll(options);
        roll.MARVEL_MULTIVERSE = CONFIG.MARVEL_MULTIVERSE.MARVEL_RESULTS[roll.result];
        return roll;
    }

    /* -------------------------------------------- */
    /** @override */
    getResultLabel(result) {
        const die = CONFIG.MARVEL_MULTIVERSE.MARVEL_RESULTS[result.result];
        return `<img src='${die.image}' title='${game.i18n.localize(die.label)}' alt=''/>`;
    }
}