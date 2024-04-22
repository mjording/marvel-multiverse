import MarvelMultiverseItemBase from "./item-base.mjs";

export default class MarvelMultiverseTrait extends MarvelMultiverseItemBase {
    static defineSchema() {
        const fields = foundry.data.fields;
        const schema = super.defineSchema();

        schema.restriction = new fields.StringField({ required: true, blank: true });

    
        return schema;
    }
}