import MarvelMultiverseActorBase from "./actor-base.mjs";

export default class MarvelMultiverseCharacter extends MarvelMultiverseActorBase {
  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      // Caclulate the defense score using mmrpg rules.
      this.abilities[key].defense += this.abilities[key].value + 10;
      // Damage Multiplier rank to apply effect changes.
      this.abilities[key].damageMultiplier += this.attributes.rank.value;
      // Non-combat checks base to apply effect changes.
      this.abilities[key].noncom += this.abilities[key].value;
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.abilities[key]) ?? key;
    }

    this.movement.climb.value = Math.ceil(this.movement.run.value * 0.5);
    this.movement.jump.value = Math.ceil(this.movement.run.value * 0.5);
    this.movement.swim.value = Math.ceil(this.movement.run.value * 0.5);


    this.attributes.init.value += this.abilities.vig.value;
    
    for (const key in this.movement) {
      this.movement[key].label = game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.movementTypes[key].label) ?? key;
      switch (this.movement[key].calc) {
        case "half": {
          this.movement[key].value = Math.ceil(this.movement[key].value * 0.5);
          break;
        }
        case "double": {
          this.movement[key].value *=  2;
          break;
        }
        case "triple":
          this.movement[key].value *= 3;
          break;
        case "runspeed":
          this.movement[key].value = this.movement.run.value;
          break;
        case "rank":
          const val = this.movement[key].value == 0 ? 1 : this.movement[key].value;
          this.movement[key].value = val * this.attributes.rank.value;
          break;
      }
    }
  }
}