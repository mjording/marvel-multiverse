// Import document classes.
import { MarvelMultiverseActor } from './module/documents/actor.mjs';
import { MarvelMultiverseItem } from './module/documents/item.mjs';
import { ChatMessageMarvel } from './module/documents/chat-message.mjs';
// Import sheet classes.
import { MarvelMultiverseActorSheet } from './module/sheets/actor-sheet.mjs';
import { MarvelMultiverseItemSheet } from './module/sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './module/helpers/templates.mjs';
import { MARVEL_MULTIVERSE } from './module/helpers/config.mjs';
// Import DataModel classes
import * as models from './module/data/_module.mjs';
import * as dice from "./module/dice/_module.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.MarvelMultiverse = {
    MarvelMultiverseActor,
    MarvelMultiverseItem,
    rollItemMacro,
    config: MARVEL_MULTIVERSE,
    dice,
    models,
    MarvelMultiverseActorSheet,
    MarvelMultiverseItemSheet,
    ChatMessageMarvel
  };

  // Add custom constants for configuration.
  CONFIG.MARVEL_MULTIVERSE = MARVEL_MULTIVERSE;

  console.log(`Marvel Multiverse RPG 1e | Initializing the Marvel Multiverse Role Playing Game System - Version ${game.MarvelMultiverse.version}\n${MARVEL_MULTIVERSE.ASCII}`);

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '{1d6,1dm,1d6} + @abilities.vig.mod',
    decimals: 2,
  };

  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = MarvelMultiverseActor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    character: models.MarvelMultiverseCharacter,
    npc: models.MarvelMultiverseNPC
  }
  CONFIG.ChatMessage.documentClass = ChatMessageMarvel;
  CONFIG.Item.documentClass = MarvelMultiverseItem;
  CONFIG.Item.dataModels = {
    item: models.MarvelMultiverseItem,
    trait: models.MarvelMultiverseTrait,
    origin: models.MarvelMultiverseOrigin,
    occupation: models.MarvelMultiverseOccupation,
    tag: models.MarvelMultiverseTag,
    power: models.MarvelMultiversePower
  }

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;


  CONFIG.Dice.types.push(dice.MarvelDie);
  CONFIG.Dice.terms[dice.MarvelDie.DENOMINATION] = dice.MarvelDie;

  CONFIG.Dice.types.push(dice.SixSidedDie);
  CONFIG.Dice.terms[dice.SixSidedDie.DENOMINATION] = dice.SixSidedDie;
  Roll.TOOLTIP_TEMPLATE = "systems/marvel-multiverse/templates/chat/roll-breakdown.hbs";
  CONFIG.Dice.MarvelMultiverseRoll = dice.MarvelMultiverseRoll;
  CONFIG.Dice.DamageRoll = dice.DamageRoll;
  // Add fonts
  _configureFonts();

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('marvel-multiverse', MarvelMultiverseActorSheet, {
    makeDefault: true,
    label: 'MARVEL_MULTIVERSE.SheetLabels.Actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('marvel-multiverse', MarvelMultiverseItemSheet, {
    makeDefault: true,
    label: 'MARVEL_MULTIVERSE.SheetLabels.Item',
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (mel) {
  return mel.toLowerCase();
});


/* -------------------------------------------- */

/**
 * Configure additional system fonts.
 */
function _configureFonts() {
  Object.assign(CONFIG.fontDefinitions, {
    Roboto: {
      editor: true,
      fonts: [
        { urls: ["systems/marvel-multiverse/fonts/roboto/Roboto-Regular.woff2"] },
        { urls: ["systems/marvel-multiverse/fonts/roboto/Roboto-Bold.woff2"], weight: "bold" },
        { urls: ["systems/marvel-multiverse/fonts/roboto/Roboto-Italic.woff2"], style: "italic" },
        { urls: ["systems/marvel-multiverse/fonts/roboto/Roboto-BoldItalic.woff2"], weight: "bold", style: "italic" }
      ]
    },
    "Roboto Condensed": {
      editor: true,
      fonts: [
        { urls: ["systems/marvel-multiverse/fonts/roboto-condensed/RobotoCondensed-Regular.woff2"] },
        { urls: ["systems/marvel-multiverse/fonts/roboto-condensed/RobotoCondensed-Bold.woff2"], weight: "bold" },
        { urls: ["systems/marvel-multiverse/fonts/roboto-condensed/RobotoCondensed-Italic.woff2"], style: "italic" },
        {
          urls: ["systems/marvel-multiverse/fonts/roboto-condensed/RobotoCondensed-BoldItalic.woff2"], weight: "bold",
          style: "italic"
        }
      ]
    },
    "Roboto Slab": {
      editor: true,
      fonts: [
        { urls: ["systems/marvel-multiverse/fonts/roboto-slab/RobotoSlab-Regular.ttf"] },
        { urls: ["systems/marvel-multiverse/fonts/roboto-slab/RobotoSlab-Bold.ttf"], weight: "bold" }
      ]
    }
  });
}



/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

Hooks.on("getChatLogEntryContext", documents.ChatMessageMarvel.addChatMessageContextOptions);

Hooks.on("renderChatLog", (app, html, data) => {
  documents.MarvelMultiverseItem.chatListeners(html);
  documents.ChatMessageMarvel.onRenderChatLog(html);
});
/* -------------------------------------------- */
/*  RenderChatMessage Hook                      */
/* -------------------------------------------- */

Hooks.on('renderChatMessage', (app, html, data) => {
  setTimeout(() => {
    $(`li.chat-message[data-message-id="${data.message.id}] div.dice-tooltip`).classList.toggle("noted");
  }, 100)
});
  

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.MarvelMultiverse.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'marvel-multiverse.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}
