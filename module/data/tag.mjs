import MarvelMultiverseItemBase from "./item-base.mjs";

export default class MarvelMultiverseTag extends MarvelMultiverseItemBase {
    static defineSchema() {
        const fields = foundry.data.fields;
        const schema = super.defineSchema();
    
        schema.restriction = new fields.StringField({ required: true, blank: true });
        schema.rarity = new fields.StringField({ required: true, blank: true });
        schema.multiple = new fields.BooleanField({ required: true, initial: false });

      
        return schema;
      }
}