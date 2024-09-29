import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class MarvelMultiverseActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['marvel-multiverse', 'sheet', 'actor'],
      width: 690,
      height: 980,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'traits',
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/marvel-multiverse/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = context.data;

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    context.sizes = CONFIG.MARVEL_MULTIVERSE.sizes;

    context.sizeSelection = Object.fromEntries(
      Object.keys(CONFIG.MARVEL_MULTIVERSE.sizes).map((key) => [key, game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.sizes[key].label)])
    );

    context.teamManeuverTypes = Object.fromEntries(CONFIG.MARVEL_MULTIVERSE.teamManeuvers.map((teamMan) => [teamMan.maneuverType.toLowerCase(), teamMan.maneuverType] ))
    context.teamManeuverLevels = Object.fromEntries([1,2,3].map((tml) => [tml, tml.toString() ]));

    context.elements = Object.fromEntries(Object.keys(CONFIG.MARVEL_MULTIVERSE.elements).map((k) => [k,CONFIG.MARVEL_MULTIVERSE.elements[k].label]));

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    );

    return context;
  }


  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const traits = [];
    const origins = [];
    const occupations = [];
    const tags = [];
    const weapons = [];
    const powers = Object.fromEntries(Object.keys(CONFIG.MARVEL_MULTIVERSE.reverseSetList).map((ps) => [ps, []]));
    
    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      
      // Append to origin tags traits and powers as well as origins.
      if (i.type === 'origin') {
        origins.push(i);
      }
       // Append to origin tags traits and powers as well as origins.
       if (i.type === 'occupation') {
        occupations.push(i);
      }
      // Append to traits.
      else if (i.type === 'trait') {
        traits.push(i);
      } else if (i.type === 'tag') {
        tags.push(i);
      }
      // Append to  power.
      else if (i.type === 'power') {
        let powersets = i.system.powerSet.split(',');
        powers[powersets[0].trim()].push(i);
      }
      else if (i.type === 'item') {
        gear.push(i);
      }
      else if (i.type === 'weapon') {
        weapons.push(i);
      }
      
      
      // Assign and return
      context.gear = gear;
      context.traits = traits;
      context.tags = tags;
      context.powers = powers;
      context.origins = origins;
      context.occupations = occupations;
      context.weapons = weapons;
    }
  }
  
  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle ability scores.
    for (let [k, v] of Object.entries(context.system.abilities)) {
      v.label = game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.abilities[k]) ?? k;
    }

    for (let i of context.items.filter((item) => item.type === 'power')) {
      let mappedPowersets = i.system.powerSet.split(',').map((ps) => CONFIG.MARVEL_MULTIVERSE.reverseSetList[ps.trim()]);
      context.system.powers[mappedPowersets[0]].push(i);
    }

    for (let i of context.items.filter((item) => item.type === 'origin')) {
      context.system.origins.push(i);
    }
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    // if (!this.isEditable) return;
    
    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      this.actor.deleteEmbeddedDocuments("Item",[li.data('itemId')]);
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on('click', '.rollable', this._onRoll.bind(this));

    html.on('change', 'select[name="system.size"]', this._onSizeChange.bind(this))
    
    html.on('click', '.roll-initiative', (ev) => {
      this.actor.rollInitiative({createCombatants: true});
      //this.actor.rollInitiativeDialog({event: ev});
    });

    html.on('click', '.roll-damage', (ev) => {
      const row = ev.currentTarget.closest('li');
      const options = {
        ability: row.dataset.ability,
        event: ev
      }
      this.actor.rollDamageDialog(options);
    });

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }
  }

    /**
   * Handle changes to actor size
   * @param {Event} event   The originating click event
   * @private
   */
  async _onSizeChange(event){
    event.preventDefault();
    const selected = event.target.value;
    this._changeSizeEffect(selected);
  }


  async _changeSizeEffect(effectKey){
    const sizeEffectNames = Object.keys(CONFIG.MARVEL_MULTIVERSE.sizeEffects).map((key) => CONFIG.MARVEL_MULTIVERSE.sizeEffects[key].name )

    const currentSizeEffects = this.actor.effects.contents.filter((effect) => sizeEffectNames.includes(effect.name));
    const currentSizeEffectIds =  currentSizeEffects.map((ae) => ae._id);

    if (currentSizeEffectIds.length > 0){
      this.actor.deleteEmbeddedDocuments("ActiveEffect", currentSizeEffectIds);
    }  
    const effect = CONFIG.MARVEL_MULTIVERSE.sizeEffects[effectKey];
    ActiveEffect.create(effect, {parent: this.actor});
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = foundry.utils.duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system['type'];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }



  async _createTrait (traitData) {
    if (!this.actor.items.map((item) => item.name).includes(traitData.name) && !traitData.multiple){
      let newItemData = {
        name: traitData.name,
        type: "trait",
        data: traitData.system,
      };
      await Item.create(newItemData, {parent: this.actor});
      //super._onDropItemCreate(itemData);
    }
  }

  async _createTag (tagData) {
    if (!this.actor.items.map((item) => item.name).includes(tagData.name) && !tagData.multiple){
      let newItemData = {
        name: tagData.name,
        type: "tag",
        data: tagData.system,
      };
      await Item.create(newItemData, {parent: this.actor});
      // super._onDropItemCreate(itemData);
    }
  }
  
  /** Fired whenever an embedded document is created.
   */
  _onDropItemCreate (itemData) {
    if (!this.actor.items.map((item) => item.name).includes(itemData.name)) {
      if( itemData.type === "power" && itemData.system.powerSet === "Elemental Control"){
        if (!itemData.system.element){
          itemData.system.element = this.actor.system.defaultElement;
        }
      }

      if ( itemData.type === "occupation" ) {
        itemData.system.tags.forEach(async (tag) => {
          this._createTag(tag);
        });
        itemData.system.traits.forEach(async (trait) => {
          this._createTrait(trait);
        });
        // create the occupation
        return super._onDropItemCreate(itemData);
      } else if ( itemData.type === "origin" ) {
        itemData.system.tags.forEach(async (tag) => {
          this._createTag(tag);
        });
        itemData.system.traits.forEach(async (trait) => {
          this._createTrait(trait);
        });
        itemData.system.powers.forEach(async (power) => {
          let newItemData = {
            name: power.name,
            type: "power",
            data: power.system,
          };
          if (this.actor.system.defaultElement){
            Object.assign(newItemData, {element: this.actor.system.defaultElement});
          }
          await Item.create(newItemData, {parent: this.actor});
        });
        // create the origin
        return super._onDropItemCreate(itemData);
      } else if (itemData.type === "trait" && ["Big", "Small"].includes(itemData.name)) {
        this._changeSizeEffect(itemData.name.toLowerCase());
        return super._onDropItemCreate(itemData);
      } else {
        return super._onDropItemCreate(itemData);
      }
    }
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      const ability = CONFIG.MARVEL_MULTIVERSE.damageAbility[dataset.label] ?? dataset.label
      let label = `[ability] ${ability}`;
      let title = dataset.power ? `[power] ${dataset.power}` : "";
      label = dataset.damageType ? label + " [damageType] " + dataset.damageType : label;
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
        title: title
      });
      return roll;
    }
  }


}
