import { MarvelMultiverseRoll } from "../dice/roll.mjs";
import simplifyRollFormula from "../dice/simplify-roll-formula.mjs";
import { MARVEL_MULTIVERSE } from "../helpers/config.mjs";




export class ChatMessageMarvel extends ChatMessage {
    /** @inheritDoc */
    _initialize(options = {}) {
        super._initialize(options);
        if ( game.release.generation > 11 ) Object.defineProperty(this, "user", { value: this.author, configurable: true });
    }

        
    /* -------------------------------------------- */
    /*  Rendering                                   */
    /* -------------------------------------------- */

    /** @inheritDoc */
    async getHTML(...args) {
        const html = await super.getHTML();
        this._displayChatActionButtons(html);

        this._enrichChatCard(html[0]);

        /**
         * A hook event that fires after marvel-multiverse-specific chat message modifications have completed.
         * @function marvel-multiverse.renderChatMessage
         * @memberof hookEvents
         * @param {ChatMessageMarvel} message  Chat message being rendered.
         * @param {HTMLElement} html       HTML contents of the message.
         */
        Hooks.callAll("marvel-multiverse.renderChatMessage", this, html[0]);

        return html;
    }


  /**
   * Optionally hide the display of chat card action buttons which cannot be performed by the user
   * @param {jQuery} html     Rendered contents of the message.
   * @protected
   */
  _displayChatActionButtons(html) {
    const chatCard = html.find(".marvel-multiverse.chat-card, .marvel-multiverse.chat-card");
    if ( chatCard.length > 0 ) {
      const flavor = html.find(".flavor-text");
      if ( flavor.text() === html.find(".item-name").text() ) flavor.remove();

      if ( this.shouldDisplayChallenge ) chatCard[0].dataset.displayChallenge = "";

      // Conceal effects that the user cannot apply.
      chatCard.find(".effects-tray .effect").each((i, el) => {
        if ( !game.user.isGM && ((el.dataset.transferred === "false") || (this.user.id !== game.user.id)) ) el.remove();
      });

      // If the user is the message author or the actor owner, proceed
      let actor = game.actors.get(this.speaker.actor);
      if ( game.user.isGM || actor?.isOwner || (this.user.id === game.user.id) ) {
        const summonsButton = chatCard[0].querySelector('button[data-action="summon"]');
        if ( summonsButton && !SummonsData.canSummon ) summonsButton.style.display = "none";
        const template = chatCard[0].querySelector('button[data-action="placeTemplate"]');
        if ( template && !game.user.can("TEMPLATE_CREATE") ) template.style.display = "none";
        return;
      }

      // Otherwise conceal action buttons except for saving throw
      const buttons = chatCard.find("button[data-action]:not(.apply-effect)");
      buttons.each((i, btn) => {
        if ( ["save", "rollRequest", "concentration"].includes(btn.dataset.action) ) return;
        btn.style.display = "none";
      });
    }
  }


  /* -------------------------------------------- */

  /**
   * Augment the chat card markup for additional styling.
   * @param {HTMLElement} html  The chat card markup.
   * @protected
   */
  _enrichChatCard(html) {
    // Header matter
    const { scene: sceneId, token: tokenId, actor: actorId } = this.speaker;
    const actor = game.scenes.get(sceneId)?.tokens.get(tokenId)?.actor ?? game.actors.get(actorId);
    // let img;
    let nameText;
    if ( this.isContentVisible ) {
      nameText = this.alias;
    } else {
      nameText = this.user.name;
    }

    const avatar = document.createElement("div");
    const name = document.createElement("span");
    name.classList.add("name-stacked");
    name.innerHTML = `<span class="title">${nameText}</span>`;

    const sender = html.querySelector(".message-sender");
    sender?.replaceChildren(avatar, name);
    html.querySelector(".whisper-to")?.remove();

    // Context menu
    const metadata = html.querySelector(".message-metadata");
    metadata.querySelector(".message-delete")?.remove();
    const anchor = document.createElement("a");
    anchor.setAttribute("aria-label", game.i18n.localize("MARVEL_MULTIVERSE.AdditionalControls"));
    anchor.classList.add("chat-control");
    anchor.dataset.contextMenu = "";
    anchor.innerHTML = '<i class="fas fa-ellipsis-vertical fa-fw"></i>';
    metadata.appendChild(anchor);

    // SVG icons
    html.querySelectorAll("i.marvel-multiverse-icon").forEach(el => {
      const icon = document.createElement("marvel-multiverse-icon");
      icon.src = el.dataset.src;
      el.replaceWith(icon);
    });

    // Enriched roll flavor
    const [roll] = this.rolls;

    if ( this.isContentVisible ) {

      const chatCard = document.createElement("div");
      chatCard.classList.add("marvel-multiverse", "chat-card");
      chatCard.innerHTML = `
        <section class="card-header description">
          <header class="summary">
            <div class="name-stacked">
              <span class="title">${this.title ?? ''}</span>
            </div>
          </header>
        </section>
      `;
      html.querySelector(".message-content").insertAdjacentElement("afterbegin", chatCard);


      const flavorText = html.querySelector("span.flavor-text");
      const isInitiative = flavorText && flavorText.innerHTML.includes("Initiative");

      html.querySelectorAll("button.retroEdgeMode").forEach(
        el => {
          if (isInitiative){
            el.setAttribute('data-initiative', true);
          }
          el.addEventListener("click", this._onClickRetroButton.bind(this))
        }
      );
      html.querySelector("button.damage")?.addEventListener("click", this._onClickDamageButton.bind(this))
    }


  }

  /* -------------------------------------------- */

  /**
   * Augment roll tooltips with some additional information and styling.
   * @param {Roll} roll            The roll instance.
   * @param {HTMLDivElement} html  The roll tooltip markup.
   */
  _enrichRollTooltip(roll, html) {
    const constant = Number(simplifyRollFormula(roll.formula, { deterministic: true }));
    if ( !constant ) return;
    const sign = constant < 0 ? "-" : "+";
    const part = document.createElement("section");


    part.classList.add("tooltip-part", "constant");
    part.innerHTML = `
      <div class="dice mice">
        <ol class="dice-rolls"></ol>
        <div class="total">
          <span class="value"><span class="sign">${sign}</span>${Math.abs(constant)}</span>
        </div>
      </div>
    `;

    html.appendChild(part);
  }



  /* -------------------------------------------- */

  /**
   * Augment attack cards with additional information.
   * @param {HTMLLIElement} html   The chat card.
   * @protected
   */
  _enrichAttackTargets(html) {
    const attackRoll = this.rolls[0];
    const targets = this.getFlag("marvel-multiverse", "targets");
    if ( !game.user.isGM || !(attackRoll instanceof CONFIG.Dice.MarvelMultiverseRoll) || !targets?.length ) return;
    const evaluation = document.createElement("ul");
    evaluation.classList.add("marvel-multiverse", "evaluation");
    evaluation.innerHTML = targets.map(({ name, img, ac, uuid }) => {
      const isMiss = !attackRoll.isFantastic && (attackRoll.total < ac);
      return [`
        <li data-uuid="${uuid}" class="target ${isMiss ? "miss" : "hit"}">
          <img src="${img}" alt="${name}">
          <div class="name-stacked">
            <span class="title">
              ${name}
              <i class="fas ${isMiss ? "fa-times" : "fa-check"}"></i>
            </span>
          </div>
          <div class="ac">
            <i class="fas fa-shield-halved"></i>
            <span>${ac}</span>
          </div>
        </li>
      `, isMiss];
    }).sort((a, b) => (a[1] === b[1]) ? 0 : a[1] ? 1 : -1).reduce((str, [li]) => str + li, "");
    evaluation.querySelectorAll("li.target").forEach(target => {
      target.addEventListener("click", this._onTargetMouseDown.bind(this));
      target.addEventListener("mouseover", this._onTargetHoverIn.bind(this));
      target.addEventListener("mouseout", this._onTargetHoverOut.bind(this));
    });
    html.querySelector(".message-content")?.appendChild(evaluation);
  }

  /* -------------------------------------------- */

  /**
   * Handle dice roll expansion.
   * @param {PointerEvent} event  The triggering event.
   * @protected
   */
  _onClickDiceRoll(event) {
    event.stopPropagation();
    const target = event.currentTarget;
    target.classList.toggle("expanded");
  }

  /**
   * Handle clicking roll damage button.
   * @param {PointerEvent} event      The initiating click event.
   */
  _onClickDamageButton(event) {

    event.stopPropagation();
    const target = event.currentTarget;
    const messageId = target.closest('[data-message-id]').dataset.messageId;
    const fantastic = target.parentNode.querySelector('li.roll.marvel-roll.fantastic');

    const messageHeader = target.closest('li.chat-message');
    const flavorText = messageHeader.querySelector('span.flavor-text').innerHTML;

    this._handleDamageChatButton(messageId, flavorText, fantastic);
  }


  /**
   * Handles the damage from the chat log
   * @param {string} messageId
   * @param {string} ability
   * @param {string} fantastic
   */
  async _handleDamageChatButton(messageId, flavorText, fantastic){
    const re = /\[ability\]\s(?<ability>\w*)/
    const dmgTypeRe = /\[damageType\]\s(?<damageType>\w*)/
    const ability = re.exec(flavorText).groups.ability;
    const damageType = dmgTypeRe.exec(flavorText)?.groups?.damageType;
    const abilityAbr = MARVEL_MULTIVERSE.damageAbilityAbr[ability] ?? ability;
    const chatMessage = game.messages.get(messageId);
    const sixOneSixPool = chatMessage.rolls[0].terms[0];
    const marvelRoll = sixOneSixPool.rolls[1];
    const actor = game.actors.contents.find((a) => a.name === chatMessage.alias);

    const [marvelDie] = marvelRoll.dice;
    const damageMultiplier = actor.system.abilities[abilityAbr].damageMultiplier;

    const targetToken = canvas.tokens.controlled[0];

    const target = targetToken?.actor

    let damageReduction = 0;
    let lessDamage = 0;
    if (target){
       damageReduction = damageType && damageType === "focus" ? target?.system.focusDamageReduction : target?.system.healthDamageReduction;
       lessDamage =  marvelDie.total * damageReduction;
    }
    const abilityValue = actor.system.abilities[abilityAbr].value;

    const dmg = marvelDie.total * damageMultiplier + abilityValue;
    let fantasticDmg;
    let fantasticLessDmg;

    if(fantastic){
      fantasticDmg = dmg * 2;
      fantasticLessDmg = lessDamage * 2;
    }

    const content = `Delivers <b>${dmg}</b> points [ MarvelDie: ${marvelDie.total} * ${ability} damage multiplier: ${damageMultiplier} + ${ability} score ${abilityValue} ] of damage.<p> ${fantastic ? 'fantastic roll 2x close attack Dmg: <b>' + fantasticDmg : ''}</b></p>`;
    if(damageReduction){
      content.concat(' ', `<br>Target Has damageReduction of ${damageReduction}</br><p>With Damage Reduced damage is: <b>${lessDamage}</b> ${fantastic ? 'fantastic roll 2x attack dmg: ' + fantasticLessDmg : ''}</p>` );
    }
    const msgData = {
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      rollMode: game.settings.get('core', 'rollMode'),
      flavor: `[ability] ${ability}`,
      title: 'Damage',
      content: content,
    }
    ChatMessage.create(msgData);
  }

  /**
   * Handle clicking a retro button.
   * @param {PointerEvent} event      The initiating click event.
   */
  _onClickRetroButton(event) {
    event.stopPropagation();
    const target = event.currentTarget;

    const action = target.dataset.retroAction;
    const isInit = target.dataset.initiative;
    const dieIndex = Math.round(target.dataset.index);
    const messageId = target.closest('[data-message-id]').dataset.messageId;

    const messageHeader = target.closest('li.chat-message');
    const flavorText = messageHeader.querySelector('span.flavor-text')?.innerHTML;
    this._handleChatButton(action, messageId, dieIndex, isInit, flavorText);
  }



  /**
   * Handles our button clicks from the chat log
   * @param {string} action
   * @param {string} messageId
   * @param {number} dieIndex
  */
  async _handleChatButton(action, messageId, dieIndex, isInit, flavor){

    if (!action || !messageId) throw new Error('Missing Information');

    const chatMessage = game.messages.get(messageId);
    const modifier = action === 'edge' ? 'kh' : 'kl';
    const [roll] = chatMessage.rolls;
    const firstRollTerm = roll.terms[0];

    let rollTerm;

    if(firstRollTerm instanceof foundry.dice.terms.ParentheticalTerm && firstRollTerm.roll.terms[0] instanceof foundry.dice.terms.PoolTerm){
      rollTerm = firstRollTerm.roll.terms[0];
    } else if (firstRollTerm instanceof foundry.dice.terms.PoolTerm) {
      rollTerm = firstRollTerm;
    }

    if (!(rollTerm.rolls.length === 3 && (rollTerm.rolls[1].terms[0] instanceof game.MarvelMultiverse.dice.MarvelDie))) return;

    const targetRoll = rollTerm.rolls[dieIndex];
    const targetDie = targetRoll.terms[0];
    const targetIsMarvel = targetDie instanceof game.MarvelMultiverse.dice.MarvelDie
    const formulaReg = /(?<number>\d)d(?<dieType>\d|m).*/;
    const formulaGroups = formulaReg.exec(targetRoll._formula)?.groups;

    const formulaDie = formulaGroups.dieType;

    targetDie.number = 2;

    const targetFormula = `${targetDie.number}d${formulaDie}`;

    targetRoll._formula = `${targetFormula}${modifier}`;

    rollTerm.terms[dieIndex] = targetRoll._formula

    targetDie.modifiers = [modifier];

    const oldRollResult = targetDie.results.find((r) => r.active);
    //const oldFantastic = targetDie.results.find((r) => r.result === 1);
    const oldFantastic = targetIsMarvel && oldRollResult.result === 1;
    const oldResult = oldRollResult.result === 1 ? 6 : oldRollResult.result;

    const newRoll = new MarvelMultiverseRoll(targetRoll._formula, {...targetRoll.data});
    await newRoll.roll();

    const newRollResult = newRoll.terms[0].results[0];
    const newFantastic = targetIsMarvel && newRollResult.result === 1;
    const newResult = newRollResult.result === 1 ? 6 : newRollResult.result

    if (modifier === 'kh') {
      if ( newFantastic ){
        oldRollResult.active = false;
        oldRollResult.discarded = true;
        newRollResult.active = true;
        delete newRollResult.discarded;
      } else if ( oldFantastic || oldResult >= newResult ){
        newRollResult.active = false;
        newRollResult.discarded = true;
      } else if( newResult >= oldResult) {
        oldRollResult.active = false;
        oldRollResult.discarded = true;
        newRollResult.active = true;
        delete newRollResult.discarded;
      }
    } else if (modifier === 'kl') {
      if (oldFantastic){
        oldRollResult.active = false;
        oldRollResult.discarded = true;
        newRollResult.active = true;
        delete newRollResult.discarded;
      } else if ( oldResult <= newResult ){
        newRollResult.active = false;
        newRollResult.discarded = true;
        oldRollResult.active = true;
        delete oldRollResult.discarded;
      } else {
        oldRollResult.active = false;
        oldRollResult.discarded = true;
        newRollResult.active = true;
        delete newRollResult.discarded;
      }
    }

 
    targetDie.results.push(newRollResult);

    const re = /(\(?{)(\dd\d),(\ddm),(\dd\d)(}.*)/;

    let replacedFormula;
    switch (dieIndex) {
      case 0: {
        replacedFormula = roll.formula.replace(re, "$1"+ targetDie.number +"d6" + modifier + ",$3,$4$5");
      }
      case 1: {
        replacedFormula = roll.formula.replace(re, "$1$2,"+ targetDie.number +"dm"+ modifier +",$4$5");
      }
      case 2: {
        replacedFormula = roll.formula.replace(re, "$1$2,$3,"+ targetDie.number +"d6"+ modifier +"$5");
      }
    }

    roll._formula = replacedFormula;

    if ( newRollResult.active ){
      roll._total = roll.total - oldResult + newResult;
    }

    let update = await roll.toMessage({flavor: flavor}, {create: false});
    update = foundry.utils.mergeObject(chatMessage.toJSON(), update);

    if( isInit ){
      const actorId = game.actors.contents.find((a) => a.name === chatMessage.alias)._id
      const combatant = game.combat.combatants.contents.find((combatant) => combatant.actorId === actorId)
      await combatant.update({initiative: roll.total})
    }

    return chatMessage.update(update);
 }

  /* -------------------------------------------- */
  /**
   * Wait to apply appropriate element heights until after the chat log has completed its initial batch render.
   * @param {jQuery} html  The chat log HTML.
   */
  static onRenderChatLog([html]) {
    // if ( !game.settings.get("marvel", "autoCollapseItemCards") ) {
      if ( false ) {
        requestAnimationFrame(() => {
        // FIXME: Allow time for transitions to complete. Adding a transitionend listener does not appear to work, so
        // the transition time is hard-coded for now.
        setTimeout(() => ui.chat.scrollBottom(), 250);
      });
    }
  }
}
