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
       
        let [dieResult,otherResult] = this.results;
        
        let thisFantastic = DiceTerm.compareResult(dieResult.result, "=", 1);
        
        if(otherResult){
            let otherFantastic = DiceTerm.compareResult(otherResult.result, "=", 1);
            let largest = dieResult.result >= otherResult.result;
            console.log(`MarvelDie.evaluate with otherResult: otherFantastic? ${otherFantastic}  thisFantastic? ${thisFantastic} largest? ${largest}`);
            if(thisFantastic){     
                dieResult.count = dieResult.total = 6;          
                dieResult.keep = dieResult.active = dieResult.success = otherResult.failure = otherResult.discarded = true;
                dieResult.failure = dieResult.discarded = otherResult.keep = otherResult.active = otherResult.success = false;
            } else if(otherFantastic){
                otherResult.count = otherResult.total = 6;
                dieResult.keep = dieResult.active = dieResult.success = otherResult.failure = otherResult.discarded = false;
                dieResult.failure = dieResult.discarded = otherResult.keep = otherResult.active = otherResult.success = true;
            } else {
                dieResult.keep = dieResult.active = dieResult.success = otherResult.failure = otherResult.discarded = largest;
                dieResult.failure = dieResult.discarded = otherResult.keep = otherResult.active = otherResult.success = !largest;
            }
            console.log(`MarvelDie.evaluate with otherResult: ${otherFantastic}  thisFantastic? ${thisFantastic} largest? ${largest} dieResult.result: ${dieResult.result} keep: ${dieResult.keep} discarded: ${dieResult.discarded} other result ${otherResult.result}  keep: ${otherResult.keep} discarded: ${otherResult.discarded}`);
        } else {
            if(thisFantastic){
                dieResult.count = dieResult.total = 6;
                dieResult.active = dieResult.success = true;
                dieResult.failure = false;
            }
        }
       
        this._evaluated = true;
        return this;
    }

    /* -------------------------------------------- */
    /** @override */
    roll(options) {
        const roll = super.roll(options);
        console.log(`MarvelDie.roll: ${roll.result}`);
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