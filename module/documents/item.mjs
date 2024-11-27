/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class MarvelMultiverseItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  
  prepareDerivedData() {
    super.prepareDerivedData();
    // Build the formula
    this.formula = this.system.ability && this.formula ? `${this.formula} + @${this.system.ability}.value` : '';
  }

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Item
   * @override
   */
  getRollData() {
    // Starts off by populating the roll data with `this.system`
    const rollData = { ...super.getRollData() };

    // Quit early if there's no parent actor
    if (!this.actor) return rollData;

    // If present, add the actor's roll data
    rollData.actor = this.actor.getRollData();

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    ChatMessage.create({
      speaker: speaker,
      rollMode: rollMode,
      flavor: label,
      content: `<div>${item.system.description}</div><div>${item.system.effect}</div>`,
    });
   
    if (this.system.formula && this.system.ability) {
      // Retrieve roll data.
      const rollData = this.getRollData();
      // Invoke the roll and submit it to chat.
      const roll = new CONFIG.Dice.MarvelMultiverseRoll(rollData.formula, rollData.actor);
      // If you need to store the value first, uncomment the next line.
      // const result = await roll.evaluate();
      const modLabel = `${label}, [ability] ${this.system.ability}`;
   
      roll.toMessage({
        title: this.name,
        speaker: speaker,
        rollMode: rollMode,
        flavor: modLabel
      }, {itemId: this._id});

         
      if (this.system.attack) {
        Hooks.callAll("marvel-multiverse.rollAttack", this, roll);  
        
        Hooks.callAll("marvel-multiverse.calcDamage", this, roll);
      }
      return roll;
    }
  }
}
