/**
 * Establish each MMRPG dice type here as extensions of DiceTerm.
 * @extends {foundry.dice.terms.PoolTerm}
 */
export class SixOneSixDie extends foundry.dice.terms.PoolTerm {

    constructor(namedParams) {
        super(namedParams);
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
    evaluate({ minimize = false, maximize = false, async = true } = {}) {
        if (this._evaluated) {
            throw new Error(`This ${this.constructor.name} has already been evaluated and is immutable`);
        }
       
        this.terms.forEach(term => term.evaluate({ minimize, maximize, async }));
        // // Apply modifiers
        this._evaluateModifiers();


        this._evaluated = true;
        return this;
    };


}