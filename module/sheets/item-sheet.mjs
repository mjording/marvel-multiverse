import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../helpers/effects.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class MarvelMultiverseItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(ItemSheet.defaultOptions, {
      classes: ["marvel-multiverse", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
    });
  }

  /** @override */
  get template() {
    const path = "systems/marvel-multiverse/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.hbs`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.hbs`.
    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.data;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = this.item.getRollData();

    // Add the item's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Prepare active effects for easier access
    context.effects = prepareActiveEffectCategories(this.item.effects);

    // Prepare data and items.
    if (itemData.type === "power") {
      context.elements = Object.fromEntries(
        Object.keys(CONFIG.MARVEL_MULTIVERSE.elements).map((k) => [
          k,
          CONFIG.MARVEL_MULTIVERSE.elements[k].label,
        ])
      );
      context.selectedElement = context.system.element;

      context.attackKinds = {
        ranged: { label: "Ranged" },
        close: { label: "Close" },
      };
      context.attackEdgeModes = {
        edge: { label: "Edge" },
        normal: { label: "Normal" },
        trouble: { label: "Trouble" },
      };
      context.abilities = {
        mle: {
          label: game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.abilities.mle),
        },
        agl: {
          label: game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.abilities.agl),
        },
        res: {
          label: game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.abilities.res),
        },
        vig: {
          label: game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.abilities.vig),
        },
        ego: {
          label: game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.abilities.ego),
        },
        log: {
          label: game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.abilities.log),
        },
      };
    }
    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.

    // Active Effect management
    html.on("click", ".effect-control", (ev) =>
      onManageActiveEffect(ev, this.item)
    );
  }
}
