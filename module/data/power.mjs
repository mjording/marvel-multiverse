import MarvelMultiverseItemBase from "./item-base.mjs";

export default class MarvelMultiversePower extends MarvelMultiverseItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.powerSet = new fields.StringField({ required: true, initial: "Basic" });
    schema.prerequisites = new fields.StringField({ blank: true });
    schema.action = new fields.StringField({ blank: true });
    schema.trigger = new fields.StringField({ blank: true });
    schema.duration = new fields.StringField({ blank: true });
    schema.range = new fields.StringField({ blank: true });
    schema.cost = new fields.StringField({ blank: true });
    schema.effect = new fields.StringField({ blank: true });
    schema.modifiers = new fields.ArrayField(new fields.ObjectField());
    
    return schema;
  }
}