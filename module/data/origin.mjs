import MarvelMultiverseItemBase from "./item-base.mjs";

export default class MarvelMultiverseOrigin extends MarvelMultiverseItemBase {
    static defineSchema() {
        const fields = foundry.data.fields;
        const schema = super.defineSchema();
    
        schema.examples = new fields.StringField({ required: true, blank: true });
        schema.suggestedOccupation = new fields.StringField({ required: true, blank: true });

        return schema;
    }
}