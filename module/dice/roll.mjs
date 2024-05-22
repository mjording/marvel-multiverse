/**
 * Extend the base Roll document by defining a pool for evaluating rolls with the Marvel DiceTerms.
 * @extends {Roll}
 * A type of Roll specific to a mmrpg check, challenge, or attack roll in the mmrpg system.
 * @param {string} formula                       The string formula to parse
 * @param {object} data                          The data object against which to parse attributes within the formula
 * @param {object} [options={}]                  Extra optional arguments which describe or modify the MarvelMultiverseRoll
 * @param {number} [options.edgeMode]            What edge modifier to apply to the roll (none, edge,
 *                                               trouble)
 * @param {number} [options.fantastic=1]         The value of dM result which represents a fantastic success
 * @param {(number)} [options.targetValue]       Assign a target value against which the result of this roll should be
 * 
 */
export class MarvelMultiverseRoll extends Roll {
    constructor(formula, data, options) {
        super(formula, data, options);
        //additional hook to change options and configuration
        this.MARVEL_MULTIVERSE = { };
        this.terms = this.parseShortHand(this.terms);
        this.options.fantastic = this.options.fantastic ?? 1;
        if ( !this.options.configured ) this.configureModifiers();
        this.hasMARVEL_MULTIVERSE = false;
    }

    /* -------------------------------------------- */

    /**
     * Create a MarvelMultiverseRoll from a standard Roll instance.
     * @param {Roll} roll
     * @returns {MarvelMultiverseRoll}
     */
    static fromRoll(roll) {
        const newRoll = new this(roll.formula, roll.data, roll.options);
        Object.assign(newRoll, roll);
        return newRoll;
    }

    /**
     * Create a MarvelMultiverseRoll from a standard Roll Terms.
     * @param {RollTerm[]} terms
     * @returns {MarvelMultiverseRoll}
     */
    static fromTerms(terms) {
        const newRoll = new this(roll.formula, roll.data, roll.options);
        Object.assign(newRoll, roll);
        return newRoll;
    }



    /* -------------------------------------------- */

    /**
     * Determine whether a d616 roll should be fast-forwarded, and whether advantage or disadvantage should be applied.
     * @param {object} [options]
     * @param {Event} [options.event]                               The Event that triggered the roll.
     * @param {boolean} [options.edge]                         Is something granting this roll advantage?
     * @param {boolean} [options.trouble]                      Is something granting this roll disadvantage?
     * @param {boolean} [options.fastForward]                       Should the roll dialog be skipped?
     * @returns {{edgeMode: MarvelMultiverseRoll.EDGE_MODE, isFF: boolean}}  Whether the roll is fast-forwarded, and its advantage
     *                                                              mode.
     */
    static determineEdgeMode({event, edge=false, trouble=false, fastForward}={}) {
        const isFF = fastForward ?? (event?.shiftKey || event?.altKey || event?.ctrlKey || event?.metaKey);
        let edgeMode = this.EDGE_MODE.NORMAL;
        if ( edge || event?.altKey ) edgeMode = this.EDGE_MODE.EDGE;
        else if ( trouble || event?.ctrlKey || event?.metaKey ) edgeMode = this.EDGE_MODE.TROUBLE;
        return {isFF: !!isFF, edgeMode};
    }

    /* -------------------------------------------- */

    /**
     * Edge mode of a mmrpg d616 roll
     * @enum {number}
     */
    static EDGE_MODE = {
        NORMAL: 0,
        EDGE: 1,
        TROUBLE: -1
    };

    /* -------------------------------------------- */

    /**
     * The HTML template path used to configure evaluation of this Roll
     * @type {string}
     */
    static EVALUATION_TEMPLATE = "systems/marvel-multiverse/templates/chat/roll-dialog.hbs";


    /**
     * The  template path used to Roll in chat
     * @type {string}
     */
    static CHAT_TEMPLATE = "systems/marvel-multiverse/templates/dice/roll.hbs"
    /* -------------------------------------------- */

    /**
     * Does this roll start with a d6 or dM?
     * @type {boolean}
     */
    get validD616Roll() {
        return (this.terms[0] instanceof CONFIG.Dice.terms.m) && (this.terms[0].faces === 6);
    }

    /* -------------------------------------------- */

    /**
     * A convenience reference for whether this marvel or d6 Roll has edge
     * @type {boolean}
     */
    get hasEdge() {
        return this.options.edgeMode === MarvelMultiverseRoll.EDGE_MODE.EDGE;
    }

    /* -------------------------------------------- */

    /**
     * A convenience reference for whether this marvel or d6 Roll has trouble
     * @type {boolean}
     */
    get hasTrouble() {
        return this.options.edgeMode === MarvelMultiverseRoll.EDGE_MODE.TROUBLE;
    }


    /**
     * Is this roll a fantastic result? Returns undefined if roll isn't evaluated.
     * @type {boolean|void}
     */
    get isFantastic() {
        if ( !this.validD616Roll || !this._evaluated ) return undefined;
        if ( !Number.isNumeric(this.options.fantastic) ) return false;
        return this.dice[0].total === this.options.fantastic;
    }


    /* -------------------------------------------- */
    /*  D616 Roll Methods                            */
    /* -------------------------------------------- */

    /**
     * Apply optional modifiers which customize the behavior of the d616term
     * @private
     */
    configureModifiers() {
        const d616 = this.terms[0];
        d616.modifiers = [];

         // Handle Advantage or Disadvantage
        if ( this.hasEdge ) {
            d616.number = 2;
            d616.modifiers.push("kh");
            d616.options.edge = true;
        }
        else if ( this.hasTrouble ) {
            d616.number = 2;
            d616.modifiers.push("kl");
            d616.options.trouble = true;
        }
        else d616.number = 1;

        this.options.fantastic = 1;

        // Mark configuration as complete
        this.options.configured = true;
    }



    /** @inheritdoc */
    async toMessage(messageData={}, options={}) {

        // Evaluate the roll now so we have the results available to determine whether reliable talent came into play
        if ( !this._evaluated ) await this.evaluate({async: true});

        // Add appropriate edge mode message flavor and mmrpg roll flags
        messageData.flavor = messageData.flavor || this.options.flavor;
        messageData.fantastic = messageData.fantastic || this.options.fantastic;
        if ( this.hasEdge ) messageData.flavor += ` (${game.i18n.localize("MARVEL_MULTIVERSE.edge")})`;
        else if ( this.hasTrouble ) messageData.flavor += ` (${game.i18n.localize("MARVEL_MULTIVERSE.trouble")})`;
6
        // Record the preferred rollMode
        options.rollMode = options.rollMode ?? this.options.rollMode;
        return super.toMessage(messageData, options);
    }

    //If the main parser hands back a StringTerm attempt to turn it into a die.
    parseShortHand(terms) {
        return terms
        .flatMap(t => {
            if(!(t instanceof StringTerm) || /\d/.test(t.term))
            return t;

            return t.term.replaceAll('d', 'i').split('').reduce((acc, next) => {
            if(next in CONFIG.Dice.terms)
            {
                let cls = CONFIG.Dice.terms[next];
                acc.push(new cls(1));
            }
            else throw new Error(`Unknown die type '${next}'`)

            return acc;
            }, [])
        })
        .flatMap((value, index, array) => //Put addition operators between each die.
            array.length - 1 !== index
            ? [value, new OperatorTerm({operator: '+'})]
            : value)
    }



    /* -------------------------------------------- */
    /*  Configuration Dialog                        */
    /* -------------------------------------------- */

    /**
     * Create a Dialog prompt used to configure evaluation of an existing MarvelMultiverseRoll instance.
     * @param {object} data                     Dialog configuration data
     * @param {string} [data.title]             The title of the shown dialog window
     * @param {number} [data.defaultRollMode]   The roll mode that the roll mode select element should default to
     * @param {number} [data.defaultAction]     The button marked as default
     * @param {boolean} [data.chooseModifier]   Choose which ability modifier should be applied to the roll?
     * @param {string} [data.defaultAbility]    For tool rolls, the default ability modifier applied to the roll
     * @param {string} [data.template]          A custom path to an HTML template to use instead of the default
     * @param {object} options                  Additional Dialog customization options
     * @returns {Promise<MarvelMultiverseRoll|null>}         A resulting MarvelMultiverseRoll object constructed with the dialog, or null if the
     *                                          dialog was closed
     */
    async configureDialog({title, defaultRollMode, defaultAction=MarvelMultiverseRoll.EDGE_MODE.NORMAL, chooseModifier=false,
        defaultAbility, template}={}, options={}) {

        // Render the Dialog inner HTML
        const content = await renderTemplate(template ?? this.constructor.EVALUATION_TEMPLATE, {
            formulas: [{formula: `${this.formula} + @bonus`}],
            defaultRollMode,
            rollModes: CONFIG.Dice.rollModes,
            chooseModifier,
            defaultAbility,
            abilities: CONFIG.MARVEL_MULTIVERSE.abilities
        });

        let defaultButton = "normal";
        switch ( defaultAction ) {
            case MarvelMultiverseRoll.EDGE_MODE.EDGE: defaultButton = "edge"; break;
            case MarvelMultiverseRoll.EDGE_MODE.TROUBLE: defaultButton = "trouble"; break;
        }

        // Create the Dialog window and await submission of the form
        return new Promise(resolve => {
        new Dialog({
            title,
            content,
            buttons: {
            edge: {
                label: "edge",
                callback: html => resolve(this._onDialogSubmit(html, MarvelMultiverseRoll.EDGE_MODE.EDGE))
            },
            normal: {
                label: "normal",
                callback: html => resolve(this._onDialogSubmit(html, MarvelMultiverseRoll.EDGE_MODE.NORMAL))
            },
            trouble: {
                label: "trouble",
                callback: html => resolve(this._onDialogSubmit(html, MarvelMultiverseRoll.EDGE_MODE.TROUBLE))
            }
            },
            default: defaultButton,
            close: () => resolve(null)
        }, options).render(true);
        });
    }

    /* -------------------------------------------- */

    /**
     * Handle submission of the Roll evaluation configuration Dialog
     * @param {jQuery} html            The submitted dialog content
     * @param {number} edgeMode   The chosen edge mode
     * @returns {MarvelMultiverseRoll}              This damage roll.
     * @private
     */
    _onDialogSubmit(html, edgeMode) {
        const form = html[0].querySelector("form");

        // Append a situational bonus term
        if ( form.bonus.value ) {
            const bonus = new Roll(form.bonus.value, this.data);
            if ( !(bonus.terms[0] instanceof OperatorTerm) ) this.terms.push(new OperatorTerm({operator: "+"}));
            this.terms = this.terms.concat(bonus.terms);
        }

        // Customize the modifier
        if ( form.ability?.value ) {
            const abl = this.data.abilities[form.ability.value];
            this.terms = this.terms.flatMap(t => {
                if ( t.term === "@mod" ) return new NumericTerm({number: abl.value});
                if ( t.term === "@abilityCheckBonus" ) {
                    const bonus = abl.bonuses?.check;
                    if ( bonus ) return new Roll(bonus, this.data).terms;
                    return new NumericTerm({number: 0});
                }
                return t;
            });
            this.options.flavor += ` (${CONFIG.MARVEL_MULTIVERSE.abilities[form.ability.value]?.label ?? ""})`;   
        }

        // Apply advantage or disadvantage
        this.options.edgeMode = edgeMode;
        this.options.rollMode = form.rollMode.value;
        this.configureModifiers();
        return this;
    }
}