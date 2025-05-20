import MarvelMultiverseItemBase from "./item-base.mjs";

export default class MarvelMultiverseOrigin extends MarvelMultiverseItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = MarvelMultiverseItemBase.defineSchema();

    schema.examples = new fields.StringField({ required: true, blank: true });
    schema.suggestedOccupation = new fields.StringField({
      required: true,
      blank: true,
    });
    schema.suggestedTags = new fields.ArrayField(new fields.ObjectField());
    (schema.minimumRank = new fields.NumberField({
      ...requiredInteger,
      initial: 0,
      min: 0,
    })),
      (schema.tags = new fields.ArrayField(new fields.ObjectField()));
    schema.traits = new fields.ArrayField(new fields.ObjectField());
    schema.powers = new fields.ArrayField(new fields.ObjectField());
    schema.limitation = new fields.StringField({ required: true, blank: true });

    return schema;
  }
}
