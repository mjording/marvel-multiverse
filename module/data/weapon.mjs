import MarvelMultiverseItemBase from "./item-base.mjs";

export default class MarvelMultiverseWeapon extends MarvelMultiverseItemBase {
    static defineSchema() {
        const fields = foundry.data.fields;
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();
    
        schema.range = new fields.StringField({ blank: true });
        schema.damageMultiplierBonus = new fields.StringField({ blank: true });
        schema.rule = new fields.StringField({ blank: true });

        // Break down roll formula into three independent fields
        schema.roll = new fields.SchemaField({
            diceNum: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 }),
            diceSize: new fields.StringField({ initial: "{1d6,1dm,1d6}" }),
            diceBonus: new fields.StringField({ initial: "+@mle.mod+ceil(@rank / 2)" })
        })
    
        schema.formula = new fields.StringField({ blank: true });
        
        return schema;
    }

}
