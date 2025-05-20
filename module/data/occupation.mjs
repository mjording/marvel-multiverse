import MarvelMultiverseItemBase from "./item-base.mjs";

export default class MarvelMultiverseOccupation extends MarvelMultiverseItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = MarvelMultiverseItemBase.defineSchema();

    schema.examples = new fields.StringField({ required: true, blank: true });

    schema.tags = new fields.ArrayField(new fields.ObjectField());
    schema.traits = new fields.ArrayField(new fields.ObjectField());

    return schema;
  }
}
