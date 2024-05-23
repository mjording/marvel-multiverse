import MarvelMultiverseActorBase from "./actor-base.mjs";

export default class MarvelMultiverseCharacter extends MarvelMultiverseActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.attributes = new fields.SchemaField({
      init: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 }),
        bonus: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 })
      }),
      rank: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 })
      }),
    });

    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(Object.keys(CONFIG.MARVEL_MULTIVERSE.abilities).reduce((obj, ability) => {
      obj[ability] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
        mod: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        defense: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        noncom: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        damageMultiplier: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        label: new fields.StringField({ required: true, blank: true })
      });
      return obj;
    }, {}));

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
      });
      return obj;
    }, {}));

    schema.base = new fields.StringField({ required: true, blank: true });
    schema.occupations = new fields.ArrayField(new fields.ObjectField());
    schema.origins = new fields.ArrayField(new fields.ObjectField());
    schema.tags = new fields.ArrayField(new fields.ObjectField());
    schema.traits = new fields.ArrayField(new fields.ObjectField());
    schema.powers = new fields.ArrayField(new fields.ObjectField());
    schema.reach = new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 });

    return schema;
  }


  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      // Calculate the modifier using mmrpg rules.
      this.abilities[key].mod = this.abilities[key].value;
      // Caclulate the defense score using mmrpg rules.
      this.abilities[key].defense += this.abilities[key].value + 10;
      // Damage Multiplier rank to apply effect changes.
      this.abilities[key].damageMultiplier += this.attributes.rank.value;
      // Non-combat checks base to apply effect changes.
      this.abilities[key].noncom += this.abilities[key].value;
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.abilities[key]) ?? key;
    }
    
    const baseSpeed = (4 + CONFIG.MARVEL_MULTIVERSE.sizes[this.size].speedMod + Math.ceil((this.abilities.agl.value) / 5))
    const halfSpeed = Math.ceil(baseSpeed * 0.5);
    
    
    const speedBaseVals = { run: baseSpeed, climb: halfSpeed, swim: halfSpeed, jump: halfSpeed, flight: (baseSpeed * this.attributes.rank.value), glide: (baseSpeed * 2), swingline: (baseSpeed * 3), levitate: baseSpeed };
    console.log(`DETERMINE baseSpeed: ${baseSpeed} flight: ${speedBaseVals['flight']}, glide: ${speedBaseVals['glide']}`);
    for (const key in this.movement) {
      this.movement[key].label = game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.movementTypes[key].label) ?? k;
      this.movement[key].value += speedBaseVals[key]? speedBaseVals[key] : 0;
      this.movement[key].noncom += this.movement[key].value;
    }
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top rank, so that rolls can use
    // formulas like `@mle.mod + 4`.
    if (this.abilities) {
      for (let [k,v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    data.rank = this.attributes.rank.value;

   

    return data
  }
}