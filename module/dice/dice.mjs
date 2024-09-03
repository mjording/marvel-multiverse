/* -------------------------------------------- */
/* Dmarvel Roll                                     */
/* -------------------------------------------- */

/**
 * Configuration data for a Dmarvel roll.
 *
 * @typedef {object} DmarvelRollConfiguration
 *
 * @property {string[]} [parts=[]]  The dice roll component parts.
 * @property {object} [data={}]     Data that will be used when parsing this roll.
 * @property {Event} [event]        The triggering event for this roll.
 *
 * ## DMarvel Properties
 * @property {boolean} [edge]     Apply edge to this roll (unless overridden by modifier keys or dialog)?
 * @property {boolean} [trouble]  Apply trouble to this roll (unless overridden by modifier keys or dialog)?
 * @property {number|null} [fantastic=1]  The value of the dmarvel result which represents a fantastic roll,
 *                                     `null` will prevent fantastic roll.
 * @property {number} [targetValue]    The value of the d616 result which should represent a successful roll.
 *
 * ## Roll Configuration Dialog
 * @property {boolean} [fastForward]           Should the roll configuration dialog be skipped?
 * @property {boolean} [chooseModifier=false]  If the configuration dialog is shown, should the ability modifier be
 *                                             configurable within that interface?
 * @property {string} [template]               The HTML template used to display the roll configuration dialog.
 * @property {string} [title]                  Title of the roll configuration dialog.
 * @property {object} [dialogOptions]          Additional options passed to the roll configuration dialog.
 *
 * ## Chat Message
 * @property {boolean} [chatMessage=true]  Should a chat message be created for this roll?
 * @property {object} [messageData={}]     Additional data which is applied to the created chat message.
 * @property {string} [rollMode]           Value of `CONST.DICE_ROLL_MODES` to apply as default for the chat message.
 * @property {object} [flavor]             Flavor text to use in the created chat message.
 */


/**
 * A standardized helper function for managing core mmrpg rolls 
 * Holding SHIFT, ALT, or CTRL when the attack is rolled will "fast-forward".
 * This chooses the default options of a normal attack with no bonus, edge or trouble respectively.
 * @param {DmarvelRollConfiguration} configuration  Configuration data for the Dmarvel roll.
 * @returns {Promise<MarvelMultiverseRoll|null>}             The evaluated Marvel Roll, or null if the workflow was cancelled.
 */
export async function dMarvelRoll({
    parts=[], data={}, event,
    edge, trouble, fantastic=1, targetValue, fastForward, 
    chooseModifier=false, template, title, dialogOptions,
    chatMessage=true, messageData={}, rollMode, flavor
  }={}) {

  // Handle input arguments
  const formula = ["{1d6,1dm,1d6}"].concat(parts).join(" + ");
  const {edgeMode, isFF} = CONFIG.Dice.MarvelMultiverseRoll.determineEdgeMode({
    edge, trouble, fastForward, event
  });
  const defaultRollMode = rollMode || game.settings.get("core", "rollMode");
  if ( chooseModifier && !isFF ){
    data.value = "@val";
    if ( "abilityCheckBonus" in data ) data.abilityCheckBonus = "@abilityCheckBonus";
  }
    
  // Construct the MarvelMultiverseRoll instance
  const roll = new CONFIG.Dice.MarvelMultiverseRoll(formula, data, {
    flavor: flavor || title,
    edgeMode,
    defaultRollMode,
    rollMode,
    fantastic,
    targetValue
  });

  if(!isFF) {
    // Render the roll display
    const configured = await roll.configureDialog({
        title,
        chooseModifier,
        defaultRollMode,
        defaultAction: edgeMode,
        defaultAbility: data?.item?.ability || data?.defaultAbility,
        template
    }, dialogOptions);
    if ( configured === null ) return null;
  } else roll.options.rollMode ??= defaultRollMode;

  const fantastical = roll.isFantastic;

  const {isFantastic, isFastForward} = _determineFantasticMode({fantastical, fastForward, event});

  if (fantastical) { 
    console.log('JUST IN CASE WE ARE USING THIS');
    roll.dice[1].results.map(r => {
        if(r.result === 1){
            r.discarded = false;
            r.active = true;
        } else {
            r.discarded = true;
            r.active = false;
        }
    });

    roll.dice[1].total = 6;
  }


  // Attach original message ID to the message
  messageData = foundry.utils.expandObject(messageData);
  const messageId = event?.target.closest("[data-message-id]")?.dataset.messageId;
  if ( messageId ) foundry.utils.setProperty(messageData, "flags.marvel-multiverse.originatingMessage", messageId);

  // Create a Chat Message
  if ( roll && chatMessage ) await roll.toMessage(messageData);
  return roll;
}

/* -------------------------------------------- */

/**
 * Determines whether this dmarvel roll should be fast-forwarded, and whether edge or trouble should be applied
 * @param {object} [config]
 * @param {Event} [config.event]          Event that triggered the roll.
 * @param {boolean} [config.fantastic]     Is this roll treated as fantastic by default?
 * @param {boolean} [config.fastForward]  Should the roll dialog be skipped?
 * @returns {{isFF: boolean, isFantastic: boolean}}  Whether the roll is fast-forward, and whether it is fantastic
 */
function _determineFantasticMode({event, fantastic=false, fastForward}={}) {
    const isFF = fastForward ?? (event && (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey));
    if ( event?.altKey )  fantastic = true;
    return {isFF: !!isFF, isFantastic: fantastic};
}
  