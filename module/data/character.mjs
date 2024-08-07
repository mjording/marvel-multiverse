import MarvelMultiverseActorBase from "./actor-base.mjs";

export default class MarvelMultiverseCharacter extends MarvelMultiverseActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.attributes = new fields.SchemaField({
      init: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        edge: new fields.BooleanField({ required: true, initial: false }),
        trouble: new fields.BooleanField({ required: true, initial: false  })
      }),
      rank: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 })
      }),
    });

    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(Object.keys(CONFIG.MARVEL_MULTIVERSE.abilities).reduce((obj, ability) => {
      obj[ability] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        defense: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        noncom: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        edge: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
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
        calc: new fields.StringField({initial: "default"})
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
    
    const baseSpeed = (4 + CONFIG.MARVEL_MULTIVERSE.sizes[this.size].speedMod + Math.ceil((this.abilities.agl.value) / 5))
    const halfSpeed = Math.ceil(baseSpeed * 0.5);
    
    
    const speedBaseVals = { run: baseSpeed, climb: halfSpeed, swim: halfSpeed, jump: halfSpeed, flight: (baseSpeed * this.attributes.rank.value), glide: (baseSpeed * 2), swingline: (baseSpeed * 3), levitate: baseSpeed };
    for (const key in this.movement) {
      this.movement[key].label = game.i18n.localize(CONFIG.MARVEL_MULTIVERSE.movementTypes[key].label) ?? k;

      switch (this.movement[key].calc) {
        case "default":
          this.movement[key].value = speedBaseVals[key]? speedBaseVals[key] : 0;
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
        case "rank":
          if (this.movement[key].mode === foundry.CONST.ACTIVE_EFFECT_MODES.MULTIPLY){
            this.movement[key].value *= this.attributes.rank.value;
          }else if(this.movement[key].mode === foundry.CONST.ACTIVE_EFFECT_MODES.ADD){
            this.movement[key].value += this.attributes.rank.value;
          }else if(this.movement[key].mode === foundry.CONST.ACTIVE_EFFECT_MODES.OVERRIDE){
            this.movement[key].value = this.attributes.rank.value;
          }
        default:
          this.movement[key].value += speedBaseVals[key]? speedBaseVals[key] : 0;
          this.movement[key].noncom += this.movement[key].value;
      }
    }
  }
}