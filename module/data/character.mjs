import MarvelMultiverseActorBase from "./actor-base.mjs";

export default class MarvelMultiverseCharacter extends MarvelMultiverseActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.attributes = new fields.SchemaField({
      rank: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 })
      })
    });

    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(Object.keys(CONFIG.MARVEL_MULTIVERSE.abilities).reduce((obj, ability) => {
      obj[ability] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
        mod: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        defense: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        label: new fields.StringField({ required: true, blank: true })
      });
      return obj;
    }, {}));

    schema.actorSizes = new fields.SchemaField(Object.keys(CONFIG.MARVEL_MULTIVERSE.sizes).reduce((obj, size) => {
      obj[size] = new fields.SchemaField({
        label: new fields.StringField({ required: true, initial: CONFIG.MARVEL_MULTIVERSE.sizes[size].label})
      });
      return obj;
    }, {}));

    schema.speed = new fields.SchemaField(Object.keys(CONFIG.MARVEL_MULTIVERSE.movementTypes).reduce((obj,mvmt) => {
      obj[mvmt] = new fields.SchemaField({
        label: new foundry.data.fields.StringField({ required: true, initial: CONFIG.MARVEL_MULTIVERSE.movementTypes.run.label }),
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
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
      // Caclulate teh defense score using mmrpg rules.
      this.abilities[key].defense = this.abilities[key].value + 10;
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.abilities[key]) ?? key;
    }

    const baseSpeed = 4 + CONFIG.MARVEL_MULTIVERSE.sizes[this.size].speedMod + Math.ceil((this.abilities.agl.value) / 5);
    const halfSpeed = Math.ceil(baseSpeed * 0.5);
    const speedBaseVals = { run: baseSpeed, fly: 0, glide: 0, swingline: 0, climb: halfSpeed, swim: halfSpeed, jump: halfSpeed}
    

    for (let [k, v] of Object.entries(CONFIG.MARVEL_MULTIVERSE.movementTypes)) {
      this.speed[k].label = game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.abilities[k]) ?? k;
      this.speed[k].value = speedBaseVals[k];
    }

    const filteredSpeed = Object.entries(this.speed).filter(([kee, spd]) => spd.value > 0)
    this.speed = Object.fromEntries(filteredSpeed);
  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top rank, so that rolls can use
    // formulas like `@mel.mod + 4`.
    if (this.abilities) {
      for (let [k,v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    data.rank = this.attributes.rank.value;

   

    return data
  }
}