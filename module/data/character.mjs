import MarvelMultiverseActorBase from "./actor-base.mjs";

export default class MarvelMultiverseCharacter extends MarvelMultiverseActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.actorSizes = new fields.SchemaField(Object.keys(CONFIG.MARVEL_MULTIVERSE.sizes).reduce((obj, size) => {
      obj[size] = new fields.SchemaField({
        label: new fields.StringField({ required: true, initial: CONFIG.MARVEL_MULTIVERSE.sizes[size].label}),
        speedMod: new fields.NumberField({ required: true, initial: CONFIG.MARVEL_MULTIVERSE.sizes[size].speedMod})
      });
      return obj;
    }, {}));

    schema.movement = new fields.SchemaField(Object.keys(CONFIG.MARVEL_MULTIVERSE.movementTypes).reduce((obj, movement) => {
      obj[movement] = new fields.SchemaField({
        label: new fields.StringField({ required: true, initial: CONFIG.MARVEL_MULTIVERSE.movementTypes[movement].label }),
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        noncom: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        active: new fields.BooleanField({ required: true, initial: CONFIG.MARVEL_MULTIVERSE.movementTypes[movement].active }),
        rankMode: new fields.StringField({ required: true, blank: true }),
        calc: new fields.StringField({initial: "default"})
      });
      return obj;
    }, {}));

    schema.base = new fields.StringField({ required: true, blank: true });
    schema.occupations = new fields.ArrayField(new fields.ObjectField());
    schema.weapons = new fields.ArrayField(new fields.ObjectField());
    schema.origins = new fields.ArrayField(new fields.ObjectField());
    schema.gear = new fields.ArrayField(new fields.ObjectField());
    schema.tags = new fields.ArrayField(new fields.ObjectField());
    schema.traits = new fields.ArrayField(new fields.ObjectField());
    schema.powers = new fields.SchemaField(Object.keys(CONFIG.MARVEL_MULTIVERSE.powersets).reduce((obj, powerset) => {
      obj[powerset] = new fields.ArrayField(new fields.ObjectField());
      return obj;
    },{}));
    schema.reach = new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 });
    schema.defaultElement = new fields.StringField({ required: true, blank: true });

    return schema;
  }


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

    this.attributes.init.value += this.abilities.vig.value;
    
    const baseSpeed = ((this.abilities.agl.value < 1 ? 5 : 4) + CONFIG.MARVEL_MULTIVERSE.sizes[this.size].speedMod + Math.ceil((this.abilities.agl.value) / 5))
    const halfSpeed = Math.ceil(baseSpeed * 0.5);
    
    
    const speedBaseVals = { run: baseSpeed, climb: halfSpeed, swim: halfSpeed, jump: halfSpeed, flight: (baseSpeed * this.attributes.rank.value), glide: (baseSpeed * 2), swingline: (baseSpeed * 3), levitate: baseSpeed };
    for (const key in this.movement) {
      this.movement[key].label = game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.movementTypes[key].label) ?? k;
      switch (this.movement[key].calc) {
        case "default":
          this.movement[key].value = speedBaseVals[key]? speedBaseVals[key] : 0;
          this.movement[key].noncom = this.movement[key].value;
          break;
        case "half":
          this.movement[key].value = Math.ceil(speedBaseVals[key] * 0.5);
          break;
        case "double":
          this.movement[key].value = speedBaseVals[key] * 2;
          break;
        case "triple":
          this.movement[key].value = speedBaseVals[key] * 3;
          break;
        case "runspeed":
          this.movement[key].value = this.movement.run.value;
          break;
        case "rank":
          console.log("applying calc with rank");
          console.log(`calc on ${key}: ${this.movement[key].value}`);
          const val = this.movement[key].value == 0 ? baseSpeed : this.movement[key].value;
          console.log(`multiplying movement: [${key}: ${val}] by rank: ${this.attributes.rank.value}`);
          this.movement[key].value = val * this.attributes.rank.value;
          console.log(`resulting in ${this.movement[key].value}`);
          break;
        default:
          console.log(`case missing for key: ${key}, calc: ${this.movement[key].calc}`);
      }
    }
  }
}