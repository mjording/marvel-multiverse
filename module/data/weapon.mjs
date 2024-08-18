import MarvelMultiverseItemBase from "./item-base.mjs";

export default class MarvelMultiverseWeapon extends MarvelMultiverseItemBase {
    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();
    
        schema.melee = new fields.BooleanField({ required: true, initial: true });
        schema.range = new fields.StringField({ blank: true });
        schema.damageMultiplierBonus = new fields.StringField({ blank: true });
        schema.rule = new fields.StringField({ blank: true });

        schema.equipped = new fields.BooleanField({ required: true, initial: false });
        
        return schema;
    }

}
