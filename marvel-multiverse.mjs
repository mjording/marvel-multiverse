// Import document classes.
import { MarvelMultiverseActor } from './module/documents/actor.mjs';
import { MarvelMultiverseItem } from './module/documents/item.mjs';
import { ChatMessageMarvel } from './module/documents/chat-message.mjs';
// Import sheet classes.
import { MarvelMultiverseCharacterSheet } from './module/sheets/character-sheet.mjs';
import { MarvelMultiverseNPCSheet } from './module/sheets/npc-sheet.mjs';
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
    MarvelMultiverseCharacterSheet,
    MarvelMultiverseNPCSheet,
    MarvelMultiverseItemSheet,
    ChatMessageMarvel
  };



  // Record Configuration Values
  CONFIG.MARVEL_MULTIVERSE = MARVEL_MULTIVERSE;

  console.log(`Marvel Multiverse RPG 1e | Initializing the Marvel Multiverse Role Playing Game System - Version ${game.system.version}\n${MARVEL_MULTIVERSE.ASCII}`);

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '{1d6,1dm,1d6} + @attributes.init.value',
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
    weapon: models.MarvelMultiverseWeapon,
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


  CONFIG.Dice.MarvelDie = dice.MarvelDie;
  CONFIG.Dice.types.push(dice.MarvelDie)
  
  Roll.TOOLTIP_TEMPLATE = "systems/marvel-multiverse/templates/chat/roll-breakdown.hbs";
  Roll.CHAT_TEMPLATE = "systems/marvel-multiverse/templates/dice/roll.hbs"
  CONFIG.Dice.MarvelMultiverseRoll = dice.MarvelMultiverseRoll;

  // Register Roll Extensions
  CONFIG.Dice.rolls.push(dice.MarvelMultiverseRoll);
  CONFIG.Dice.terms.m = dice.MarvelDie;

  // Add fonts
  _configureFonts();

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('marvel-multiverse', MarvelMultiverseCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: 'MARVEL_MULTIVERSE.SheetLabels.Actor',
  });
  Actors.registerSheet('marvel-multiverse', MarvelMultiverseNPCSheet, {
    types: ["npc"],
    makeDefault: true,
    label: 'MARVEL_MULTIVERSE.SheetLabels.NPC',

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
Handlebars.registerHelper('toLowerCase', function (mle) {
  return mle.toLowerCase();
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
/* -------------------------------------------- */
/*  Render Settings Hook                                  */
/* -------------------------------------------- */

Hooks.on("renderSettings", (app, [html]) => {
  const details = html.querySelector("#game-details");
  const pip = details.querySelector(".system-info .update");
  details.querySelector(".system").remove();

  const heading = document.createElement("div");
  heading.classList.add("mmrpg", "sidebar-heading");
  heading.innerHTML = `
    <h2 class='mmrpg-game-title'>${game.system.title}
      <ul class="links mmrpg-ul">
        <li>
          <a href="https://github.com/mjording/marvel-multiverse/releases/latest" target="_blank">
            Marvel Multiverse RPG
          </a>
        </li>
        <li>
          <a href="https://github.com/mjording/marvel-multiverse/issues" target="_blank">${game.i18n.localize("MARVEL_MULTIVERSE.Issues")}</a>
        </li>
        <li>
          <a href="https://github.com/mjording/marvel-multiverse/wiki" target="_blank">${game.i18n.localize("MARVEL_MULTIVERSE.Wiki")}</a>
        </li>
      </ul>
    </h2>
  `;
  details.insertAdjacentElement("afterend", heading);

  const badge = document.createElement("div");
  badge.classList.add("mmrpg", "system-badge");
  badge.innerHTML = `
    <img src="systems/marvel-multiverse/ui/official/mmrpg-badge-32.webp" data-tooltip="${game.system.title}" alt="${game.system.title}">
    <span class="system-info">${game.system.version}</span>
  `;
  if ( pip ) badge.querySelector(".system-info").insertAdjacentElement("beforeend", pip);
  heading.insertAdjacentElement("afterend", badge);
});

Hooks.on("renderChatLog", (app, html, data) => {
  ChatMessageMarvel.onRenderChatLog(html);
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
  if (data.type !== 'Item' || data.type !== 'Weapon') return;
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
