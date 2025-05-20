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
    if (!this.options.configured) this.configureModifiers();
  }

  /* -------------------------------------------- */

  /**
   * Create a MarvelMultiverseRoll from a standard Roll instance.
   * @param {Roll} roll
   * @returns {MarvelMultiverseRoll}
   */
  static fromRoll(roll) {
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
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
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
    const newRoll = super.fromTerms(terms);
    Object.assign(newRoll, roll);
    return newRoll;
  }

  /* -------------------------------------------- */

  /**
   * Determine whether a d616 roll should be fast-forwarded, and whether edge or trouble should be applied.
   * @param {object} [options]
   * @param {Event} [options.event]                               The Event that triggered the roll.
   * @param {boolean} [options.edge]                         Is something granting this roll edge?
   * @param {boolean} [options.trouble]                      Is something granting this roll trouble?
   * @param {boolean} [options.fastForward]                       Should the roll dialog be skipped?
   * @returns {{edgeMode: MarvelMultiverseRoll.EDGE_MODE, isFF: boolean}}  Whether the roll is fast-forwarded, and its edge
   *                                                              mode.
   */
  static determineEdgeMode({
    event,
    edge = false,
    trouble = false,
    fastForward,
  } = {}) {
    const isFF =
      fastForward ??
      (event?.shiftKey || event?.altKey || event?.ctrlKey || event?.metaKey);
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
    let edgeMode = this.EDGE_MODE.NORMAL;
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
    if (edge || event?.altKey) edgeMode = this.EDGE_MODE.EDGE;
    else if (trouble || event?.ctrlKey || event?.metaKey)
      // biome-ignore lint/complexity/noThisInStatic: <explanation>
      edgeMode = this.EDGE_MODE.TROUBLE;
    return { isFF: !!isFF, edgeMode };
  }

  /* -------------------------------------------- */

  /**
   * Edge mode of a mmrpg d616 roll
   * @enum {number}
   */
  static EDGE_MODE = {
    NORMAL: 0,
    EDGE: 1,
    TROUBLE: -1,
  };

  /* -------------------------------------------- */

  /**
   * The HTML template path used to configure evaluation of this Roll
   * @type {string}
   */
  static EVALUATION_TEMPLATE =
    "systems/marvel-multiverse/templates/chat/roll-dialog.hbs";

  /**
   * The HTML template path used to configure evaluation of this Roll
   * @type {string}
   */
  static DAMAGE_EVALUATION_TEMPLATE =
    "systems/marvel-multiverse/templates/chat/damage-roll-dialog.hbs";

  /**
   * The  template path used to Roll in chat
   * @type {string}
   */
  static CHAT_TEMPLATE = "systems/marvel-multiverse/templates/dice/roll.hbs";
  /* -------------------------------------------- */

  /**
   * Does this roll start with a d6 or dM?
   * @type {boolean}
   */
  get validD616Roll() {
    // return this.dice.length === 3 && this.dice[0].faces === 6 && this.dice[1] instanceof game.MarvelMultiverse.dice.MarvelDie && this.dice[2].faces === 6
    return (
      this.dice.length === 3 &&
      this.terms[0] instanceof foundry.dice.terms.PoolTerm
    );
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
    if (!this._evaluated) return undefined;
    return this.dice[1].result === 1;
  }

  /* -------------------------------------------- */
  /*  D616 Roll Methods                            */
  /* -------------------------------------------- */

  /**
   * Apply optional modifiers which customize the behavior of the d616term
   * @private
   */
  configureModifiers() {
    const valid616 = this.validD616Roll;
    if (!valid616) return;
    this.options.fantastic = 1;

    if (this.isFantastic) {
      this.dice[1].results.map((r) => {
        if (r.result === 1) {
          r.discarded = false;
          r.active = true;
        } else {
          r.discarded = true;
          r.active = false;
        }
      });
      this.dice[1].total = 6;
    }

    // Mark configuration as complete
    this.options.configured = true;
  }

  /** @inheritdoc */
  async toMessage(messageData = {}, options = {}) {
    // Evaluate the roll now so we have the results available to determine edge mode
    if (!this._evaluated) await this.evaluate({});

    // Add appropriate edge mode message flavor and mmrpg roll flags
    messageData.flavor = messageData.flavor || this.options.flavor;
    messageData.fantastic = this.isFantastic;
    if (options.itemId) {
      foundry.utils.setProperty(
        messageData,
        "flags.marvel-multiverse.itemId",
        options.itemId
      );
    }

    if (this.hasEdge)
      messageData.flavor += ` (${game.i18n.localize(
        "MARVEL_MULTIVERSE.edge"
      )})`;
    else if (this.hasTrouble)
      messageData.flavor += ` (${game.i18n.localize(
        "MARVEL_MULTIVERSE.trouble"
      )})`;
    // Record the preferred rollMode
    options.rollMode = options.rollMode ?? this.options.rollMode;
    return super.toMessage(messageData, options);
  }

  /* -------------------------------------------- */
  /*  Configuration Dialog                        */
  /* -------------------------------------------- */

  /**
   * Create a Dialog prompt used to configure evaluation of an existing MarvelMultiverseRoll instance.
   * @param {object} data                     Dialog configuration data
   * @param {string} [data.title]             The title of the shown dialog window
   * @param {boolean} [data.chooseModifier]   Choose which ability modifier should be applied to the roll?
   * @param {string} [data.defaultAbility]    For tool rolls, the default ability modifier applied to the roll
   * @param {string} [data.template]          A custom path to an HTML template to use instead of the default
   * @param {object} options                  Additional Dialog customization options
   * @returns {Promise<MarvelMultiverseRoll|null>}         A resulting MarvelMultiverseRoll object constructed with the dialog, or null if the
   *                                          dialog was closed
   */
  async configureDialog(
    { title, chooseModifier = false, defaultAbility, template } = {},
    options = {}
  ) {
    // Render the Dialog inner HTML
    const content = await renderTemplate(
      template ?? this.constructor.EVALUATION_TEMPLATE,
      {
        formulas: [{ formula: `${this.formula} + @bonus` }],
        chooseModifier,
        defaultAbility,
        abilities: Object.fromEntries(
          Object.entries(CONFIG.MARVEL_MULTIVERSE.abilities).map((abl) => [
            abl[0],
            game.i18n.localize(abl[1]),
          ])
        ),
      }
    );

    const defaultButton = "normal";

    // Create the Dialog window and await submission of the form
    return new Promise((resolve) => {
      new Dialog(
        {
          title,
          content,
          buttons: {
            normal: {
              label: "Roll",
              callback: (html) => resolve(this._onDamageDialogSubmit(html)),
            },
          },
          default: defaultButton,
          close: () => resolve(null),
        },
        options
      ).render(true);
    });
  }

  /* -------------------------------------------- */

  /**
   * Handle submission of the Roll evaluation configuration Dialog
   * @param {jQuery} html            The submitted dialog content
   * @returns {MarvelMultiverseRoll}              This damage roll.
   * @private
   */

  _onDialogSubmit(html) {
    const form = html[0].querySelector("form");

    // Append a situational bonus term
    if (form.bonus.value) {
      const bonus = new Roll(form.bonus.value, this.data);
      if (!(bonus.terms[0] instanceof foundry.dice.terms.OperatorTerm))
        this.terms.push(new foundry.dice.terms.OperatorTerm({ operator: "+" }));
      this.terms = this.terms.concat(bonus.terms);
    }

    // Customize the modifier
    if (form.ability?.value) {
      const abl = this.data.abilities[form.ability.value];
      this.terms = this.terms.flatMap((t) => {
        if (t.term === "@mod")
          return new foundry.dice.terms.NumericTerm({ number: abl.value });
        if (t.term === "@abilityCheckBonus") {
          const bonus = abl.bonuses?.check;
          if (bonus) return new Roll(bonus, this.data).terms;
          return new foundry.dice.terms.NumericTerm({ number: 0 });
        }
        return t;
      });
      this.options.flavor += ` (${
        CONFIG.MARVEL_MULTIVERSE.abilities[form.ability.value]?.label ?? ""
      })`;
    }

    // Apply advantage or disadvantage
    this.configureModifiers();
    return this;
  }
}
