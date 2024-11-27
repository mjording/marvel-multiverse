import MarvelMultiverseItemBase from "./item-base.mjs";

export default class MarvelMultiverseItem extends MarvelMultiverseItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    
    const schema = super.defineSchema();


    schema.weight = new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 });


    return schema;
  }
}