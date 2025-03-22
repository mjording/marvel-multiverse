/**
 * Establish each MMRPG dice type here as extensions of DiceTerm.
 * @extends {foundry.dice.terms.PoolTerm}
 */
export class SixOneSixTerm extends foundry.dice.terms.PoolTerm {
    constructor(namedParams) {
        super(namedParams);
    }

    /**
     * Create a SixOneSixTerm from a standard Pool Term.
     * @param {PoolTerm} poolTerm
     * @returns {SixOneSixTerm}
    */
    static fromPoolTerm(poolTerm) {
        const newTerm = super.fromData(foundry.utils.deepClone(poolTerm.toJSON()));
        Object.assign(newTerm, poolTerm);
        return newTerm;
    }


    /* -------------------------------------------- */
    /** @override */
    safeEval({ minimize = false, maximize = false, async = true } = {}) {
        if (this._evaluated) {
            throw new Error(`This ${this.constructor.name} has already been evaluated and is immutable`);
        }

        this.terms.forEach(term => term.safeEval({ minimize, maximize, async }));
        // Apply modifiers
        this._evaluateModifiers();


        return this;
    };
    /* -------------------------------------------- */
    /** @override */
    evaluate({}) {
        if (this._evaluated) {
            throw new Error(`This ${this.constructor.name} has already been evaluated and is immutable`);
        }
        const multiverseRolls = this.rolls.map((r) => new CONFIG.Dice.MarvelMultiverseRoll(r._formula, r._data, r._options));
        this.rolls = multiverseRolls;
        this.rolls.forEach(roll => roll.evaluate({}));
        // // Apply modifiers
        this._evaluateModifiers();


        this._evaluated = true;
        return this;
    };


}