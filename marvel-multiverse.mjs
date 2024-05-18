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

  console.log(`Marvel Multiverse RPG 1e | Initializing the Marvel Multiverse Role Playing Game System - Version ${game.system.version}\n${MARVEL_MULTIVERSE.ASCII}`);

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
  
  CONFIG.Dice.types.push(dice.SixOneSixDie);

  CONFIG.Dice.types.push(dice.SixSidedDie);
  CONFIG.Dice.terms[dice.SixSidedDie.DENOMINATION] = dice.SixSidedDie;
  
  Roll.TOOLTIP_TEMPLATE = "systems/marvel-multiverse/templates/chat/roll-breakdown.hbs";
  Roll.CHAT_TEMPLATE = "systems/marvel-multiverse/templates/dice/roll.hbs"
  CONFIG.Dice.MarvelMultiverseRoll = dice.MarvelMultiverseRoll;
  CONFIG.Dice.DamageRoll = dice.DamageRoll;

  // Register Roll Extensions
  CONFIG.Dice.rolls.push(dice.MarvelMultiverseRoll);
  CONFIG.Dice.rolls.push(dice.DamageRoll);
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


Hooks.on("getChatLogEntryContext", documents.ChatMessageMarvel.addChatMessageContextOptions);

Hooks.on("renderChatLog", (app, html, data) => {
  documents.MarvelMultiverseItem.chatListeners(html);
  documents.ChatMessageMarvel.onRenderChatLog(html);
});


// /* -------------------------------------------- */
// /*  RenderChatMessage Hook                      */
// /* -------------------------------------------- */

// Hooks.on('marvel-multiverse.renderChatMessage', async (message, html) => {
//   html.querySelector(".")
//   // if ((message.isAuthor || message.isOwner) || message.isRoll) {
//   const [roll] = message.rolls;
//   if ((roll instanceof CONFIG.Dice.MarvelMultiverseRoll)) { 
//     const edgeMode = roll?.options?.edgeMode;
    
//     const div = document.createElement("DIV");
//     div.innerHTML = await renderTemplate("systems/marvel-multiverse/templates/chat/retro-buttons.hbs", {
//       trble: edgeMode === CONFIG.Dice.MarvelMultiverseRoll.EDGE_MODE.TROUBLE,
//       norm: edgeMode === CONFIG.Dice.MarvelMultiverseRoll.EDGE_MODE.NORMAL,
//       edge: edgeMode === CONFIG.Dice.MarvelMultiverseRoll.EDGE_MODE.EDGE
//     });
    
//     div.querySelectorAll("[data-retro-action]").forEach(n => {
//       n.addEventListener("click", _onClickRetroButton.bind(RetroEdge));
//     });


//     const cc = html.querySelector(".marvel-multiverse.dice");
//     if (cc) return cc.append(div.firstElementChild);

//     const dr = html.querySelector(".dice-roll");
//     if (dr) return dr.before(div.firstElementChild);
//   } 
// });
  
//  /**
//    * Handle clicking a retro button.
//    * @param {PointerEvent} event      The initiating click event.
//    */
//   function _onClickRetroButton(event) {
//     const action = event.currentTarget.dataset.retroAction;
//     const messageId = event.currentTarget.closest('[data-message-id]').dataset.messageId;
//     this._handleChatButton(action, messageId);
//  }

// function _makeNewRoll(dMarvelRoll, newEdgeMode, messageOptions){
//     if(newEdgeMode === undefined){
//       throw new Error('you must provide what the New Edge mode is')
//     }

//     if (!(dMarvelRoll instanceof CONFIG.Dice.MarvelMultiverseRoll)){
//       throw new Error('you must provide a MarvelMultiverseRoll')
//     }

//     if (dMarvelRoll.options.edgeMode === newEdgeMode){
//       throw new Error('provided roll is already that kind of roll');
//     }

//     const {TROUBLE, NORMAL, EDGE} = CONFIG.Dice.MarvelMultiverseRoll.EDGE_MODE;

//     let newRoll = new dMarvelRoll.constructor(dMarvelRoll._formula, {...dMarvelRoll.data}, {...dMarvelRoll.options});

//     newRoll.terms = [...dMarvelRoll.terms];

//     let dMarvelTerm = newRoll.terms[0];
//     // original roll mods without the kh or kl modifiers
//     const filteredModifiers = dMarvelTerm.modifiers.filter((modifier) => !['kh', 'kl'].includes(modifier));
//     const originalResultsLength = dMarvelTerm.results.length;
//     // reset roll to not have the kh or kl modifiers
//     dMarvelTerm.modifiers = [...filteredModifiers];

//     // do stuff to the terms and modifiers
//     switch (newEdgeMode) {
//       case (NORMAL): {
//         dMarvelRoll.number = 1;
//         dMarvelRoll.results = [dMarvelTerm.results[0]];
//         break;
//       }
//       case (EDGE): {
//         dMarvelRoll.modifiers.push('kh');
//         // if this dMarvelTerm doesn't already have more than 1 rolled value, add a new one
//         if (dMarvelTerm.number === 1) {
//           dMarvelTerm.number = 2;
//           dMarvelTerm.roll();
//         }
//         break;
//       }
//       case (TROUBLE): {
//         dMarvelTerm.modifiers.push('kl');
//         // if this dMarvelTerm doesn't already have more than 1 rolled value, add a new one
//         if (dMarvelTerm.number === 1) {
//           dMarvelTerm.number = 2;
//           dMarvelTerm.roll();
//         }
//         break;
//       }
//   }
//   // clear out term flavor to prevent "Reliable Talent" loop
//   dMarvelTerm.options.flavor = undefined;

//   dMarvelTerm.results.forEach((term) => {
//     term.active = true;
//     delete term.discarded;
//     delete term.indexThrow;
//   })

//   dMarvelTerm._evaluateModifiers();

//   newRoll._formula = newRoll.constructor.getFormula(newRoll.terms); 

//   // re-evaluate total after adjusting the terms
//   newRoll._total = newRoll._evaluateTotal();

//   // After evaluating modifiers again, Create a Fake Roll result and roll for dice so nice to roll the new dice.
//   // We have to do this after modifiers because some features might spawn more dice.

//   if (game.modules.get('dice-so-nice')?.active && dMarvelTerm.results.length > originalResultsLength) {
//     const fakedMarvelRoll = Roll.fromTerms([new Die({...dMarvelTerm})]);

//     // we are being extra and only rolling the new dice
//     fakedMarvelRoll.terms[0].results = fakedMarvelRoll.terms[0].results.filter((foo, index) => index > 0);
//     fakedMarvelRoll.terms[0].number = fakedMarvelRoll.terms[0].results.length;

//     game.dice3d.showForRoll(
//       fakedMarvelRoll,
//       game.users.get(messageOptions?.userId),
//       true,
//       messageOptions?.whisper?.length ? messageOptions.whisper : null,
//       messageOptions?.blind,
//       null,
//       messageOptions?.speaker
//     );
//   }
//   return newRoll;
// }

//  /**
//    * Handles our button clicks from the chat log
//    * @param {string} action
//    * @param {string} messageId
//    */
//  async function _handleChatButton(action, messageId){
//   try {
//     const {TROUBLE, NORMAL, EDGE} = CONFIG.Dice.MarvelMultiverseRoll.EDGE_MODE;
//     const chatMessage = game.messages.get(messageId);
//     if (!action || !chatMessage) throw new Error('Missing Information');

//     const [roll] = chatMessage.rolls;

//     if (!(roll instanceof CONFIG.Dice.MarvelMultiverseRoll)) return;


//     let newRoll;

//     const messageOptions = {
//       userId: chatMessage.user,
//       whisper: chatMessage.whisper,
//       blind: chatMessage.blind,
//       speaker: chatMessage.speaker
//     };
//     switch (action) {
//       case 'trble': {
//         newRoll = await this._makeNewRoll(roll, TROUBLE, messageOptions);
//         break;
//       }
//       case 'norm': {
//         newRoll = await this._makeNewRoll(roll, NORMAL, messageOptions);
//         break;
//       }
//       case 'edge': {
//         newRoll = await this._makeNewRoll(roll, EDGE, messageOptions);
//         break;
//       }
//     }
    
//     let update = await newRoll.toMessage({}, {create: false});

//     [
//       "blind", "timestamp", "user", "whisper", "speaker",
//       "emote", "flags", "sound", "type", "_id"
//     ].forEach(k => delete update[k]);
//     update = foundry.utils.mergeObject(chatMessage.toJSON(), update);

//     return chatMessage.update(update);

//   } catch (err) {
//     console.error('A problem occurred with Retroactive Edge:', err);
//   }
//  }

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
