/**
 * Establish each MMRPG dice type here as extensions of DiceTerm.
 * @extends {DiceTerm}
 */
export class SixSidedDie extends DiceTerm {
      
    constructor(termData) {
        super(termData);
        this.faces = 6;
    }

    /* -------------------------------------------- */
    /** @override */
    static DENOMINATION = "6";


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

        this._evaluated = true;
        this._isMarvel = true;
        return this;
    }
    roll(options) {
        const roll = super.roll(options);
        roll.MARVEL_MULTIVERSE = CONFIG.MARVEL_MULTIVERSE.DICE_RESULTS[roll.result];
        return roll;
    }

    /* -------------------------------------------- */
    /** @override */
    getResultLabel(result) {
        const die = CONFIG.MARVEL_MULTIVERSE.DICE_RESULTS[result.result];
        return `<img src='${die.image}' title='${game.i18n.localize(die.label)}' alt=''/>`;
    }
}
