import simplifyRollFormula from "../dice/simplify-roll-formula.mjs";
import { MARVEL_MULTIVERSE } from "../helpers/config.mjs";
import { MarvelMultiverseActor } from "./actor.mjs";

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
        this._highlightFantasticSuccess(html);
        html.find(".description.collapsible").each((i, el) => el.classList.add("collapsed"));

        this._enrichChatCard(html[0]);
        requestAnimationFrame(() => html.find(".card-tray, .effects-tray").each((i, el) => el.classList.add("collapsed")));

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
   * Highlight Fantastic success on dMarvel rolls.
   * @param {jQuery} html     Rendered contents of the message.
   * @protected
   */
  _highlightFantasticSuccess(html) {
    if ( !this.isContentVisible || !this.rolls.length ) return;
    const originatingMessage = game.messages.get(this.getFlag("marvel-multiverse", "originatingMessage")) ?? this;
    const displayChallenge = originatingMessage?.shouldDisplayChallenge;

    // Highlight rolls where the first part is a dMarvel roll
    for ( let [index, dMarvelRoll] of this.rolls.entries() ) {

      const d0 = dMarvelRoll.dice[0];
      if ( (d0?.faces !== 6) || (d0?.values.length !== 1) ) continue;

      dMarvelRoll = game.MarvelMultiverse.dice.MarvelMultiverseRoll.fromRoll(dMarvelRoll);
      const d = dMarvelRoll.dice[0];

      const isModifiedRoll = ("success" in d.results[0]) || d.options.marginSuccess || d.options.marginFailure;
      if ( isModifiedRoll ) continue;

      // Highlight successes and failures
      const total = html.find(".dice-total")[index];
      if ( !total ) continue;
      if ( dMarvelRoll.isFantastic ) total.classList.add("fantastic");
      else if ( d.options.target && displayChallenge ) {
        if ( dMarvelRoll.total >= d.options.target ) total.classList.add("success");
        else total.classList.add("failure");
      }
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

    let img;
    let nameText;
    if ( this.isContentVisible ) {
      img = actor?.img ?? this.user.avatar;
      nameText = this.alias;
    } else {
      img = this.user.avatar;
      nameText = this.user.name;
    }

    const avatar = document.createElement("div");
    avatar.classList.add("avatar");
    avatar.innerHTML = `<img src="${img}" alt="${nameText}">`;

    const name = document.createElement("span");
    name.classList.add("name-stacked");
    name.innerHTML = `<span class="title">${nameText}</span>`;

    const subtitle = document.createElement("span");
    subtitle.classList.add("subtitle");
    if ( this.whisper.length ) subtitle.innerText = html.querySelector(".whisper-to")?.innerText ?? "";
    if ( (nameText !== this.user?.name) && !subtitle.innerText.length ) subtitle.innerText = this.user?.name ?? "";

    name.appendChild(subtitle);

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
    const roll = this.getFlag("marvel-multiverse", "roll");
    const item = fromUuidSync(roll?.itemUuid);
    if ( this.isContentVisible && item ) {
      const isFantastic = (roll.type === "damage") && this.rolls[0]?.options?.fantastic;
      const subtitle = roll.type === "damage"
        ? isFantastic ? game.i18n.localize("MARVEL_MULTIVERSE.FantasticHit") : game.i18n.localize("MARVEL_MULTIVERSE.DamageRoll")
        : roll.type === "attack"
          ? game.i18n.localize(`MARVEL_MULTIVERSE.Action${item.system.actionType.toUpperCase()}`)
          : item.system.type?.label ?? game.i18n.localize(CONFIG.Item.typeLabels[item.type]);
      const flavor = document.createElement("div");
      flavor.classList.add("marvel-multivese", "chat-card");
      flavor.innerHTML = `
        <section class="card-header description ${isFantastic ? "fantastic" : ""}">
          <header class="summary">
            <img class="gold-icon" src="${item.img}" alt="${item.name}">
            <div class="name-stacked">
              <span class="title">${item.name}</span>
              <span class="subtitle">${subtitle}</span>
            </div>
          </header>
        </section>
      `;
      html.querySelector(".message-header .flavor-text").remove();
      html.querySelector(".message-content").insertAdjacentElement("afterbegin", flavor);
    }

    // Attack targets
    this._enrichAttackTargets(html);

    // Dice rolls
    if ( this.isContentVisible ) {
      html.querySelectorAll(".dice-tooltip").forEach((el, i) => {
        if ( !(roll instanceof game.MarvelMultiverse.dice.DamageRoll) ) this._enrichRollTooltip(this.rolls[i], el);
      });
      this._enrichDamageTooltip(this.rolls.filter(r => r instanceof game.MarvelMultiverse.dice.DamageRoll), html);
      html.querySelectorAll(".dice-roll").forEach(el => el.addEventListener("click", this._onClickDiceRoll.bind(this)));
    } else {
      html.querySelectorAll(".dice-roll").forEach(el => el.classList.add("secret-roll"));
    }
  }

  /* -------------------------------------------- */

  /**
   * Augment roll tooltips with some additional information and styling.
   * @param {Roll} roll            The roll instance.
   * @param {HTMLDivElement} html  The roll tooltip markup.
   */
  _enrichRollTooltip(roll, html) {
    const constant = Number(simplifyRollFormula(roll._formula, { deterministic: true }));
    if ( !constant ) return;
    const sign = constant < 0 ? "-" : "+";
    const part = document.createElement("section");
    part.classList.add("tooltip-part", "constant");
    part.innerHTML = `
      <div class="dice">
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
    if ( !game.user.isGM || !(attackRoll instanceof game.MarvelMultiverse.dice.MarvelMultiverseRoll) || !targets?.length ) return;
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
   * Coalesce damage rolls into a single breakdown.
   * @param {DamageRoll[]} rolls  The damage rolls.
   * @param {HTMLElement} html    The chat card markup.
   * @protected
   */
  _enrichDamageTooltip(rolls, html) {
    if ( !rolls.length ) return;
    let { formula, total, breakdown } = aggregateDamageRolls(rolls).reduce((obj, r) => {
      obj.formula.push(r.formula);
      obj.total += r.total;
      this._aggregateDamageRoll(r, obj.breakdown);
      return obj;
    }, { formula: [], total: 0, breakdown: {} });
    formula = formula.join("").replace(/^ \+ /, "");
    html.querySelectorAll(".dice-roll").forEach(el => el.remove());
    const roll = document.createElement("div");
    roll.classList.add("dice-roll");

    const tooltipContents = Object.entries(breakdown).reduce((str, [type, { total, constant, dice }]) => {
      const config = CONFIG.MARVEL_MULTIVERSE.damageTypes[type] ?? CONFIG.MARVEL_MULTIVERSE.healingTypes[type];
      return `${str}
        <section class="tooltip-part">
          <div class="dice">
            <ol class="dice-rolls">
              ${dice.reduce((str, { result, classes }) => `
                ${str}<li class="roll ${classes}">${result}</li>
              `, "")}
              ${constant ? `
              <li class="constant"><span class="sign">${constant < 0 ? "-" : "+"}</span>${Math.abs(constant)}</li>
              ` : ""}
            </ol>
            <div class="total">
              ${config ? `<img src="${config.icon}" alt="${config.label}">` : ""}
              <span class="label">${config?.label ?? ""}</span>
              <span class="value">${total}</span>
            </div>
          </div>
        </section>
      `;
    }, "");

    roll.innerHTML = `
      <div class="dice-result">
        <div class="dice-formula">${formula}</div>
        <div class="dice-tooltip-collapser">
          <div class="dice-tooltip">
            ${tooltipContents}
          </div>
        </div>
        <h4 class="dice-total">${total}</h4>
      </div>
    `;
    html.querySelector(".message-content").appendChild(roll);

    if ( game.user.isGM ) {
      const damageApplication = document.createElement("damage-application");
      damageApplication.classList.add("marvel-multiverse");
      damageApplication.damages = aggregateDamageRolls(rolls, { respectProperties: true }).map(roll => ({
        value: roll.total,
        type: roll.options.type,
        properties: new Set(roll.options.properties ?? [])
      }));
      html.querySelector(".message-content").appendChild(damageApplication);
    }
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


}
