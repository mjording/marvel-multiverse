import MarvelMultiverseItemBase from "./item-base.mjs";

export default class MarvelMultiversePower extends MarvelMultiverseItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();
    const requiredInteger = { required: true, nullable: false, integer: true };

    schema.powerSet = new fields.StringField({ required: true, initial: "Basic" });
    schema.prerequisites = new fields.StringField({ blank: true });
    schema.action = new fields.StringField({ blank: true });
    schema.trigger = new fields.StringField({ blank: true });
    schema.duration = new fields.StringField({ blank: true });
    schema.range = new fields.StringField({ blank: true });
    schema.cost = new fields.StringField({ blank: true });
    schema.effect = new fields.StringField({ blank: true });
    schema.modifiers = new fields.ArrayField(new fields.ObjectField());
    schema.numbered = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
    schema.attackAbility = new fields.StringField({blank: true});
    schema.attackTarget = new fields.StringField({blank: true});
    schema.attackKind = new fields.StringField({blank: true});
    schema.damageType = new fields.StringField({blank: true});
    schema.attackRange = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
    schema.attackEdgeMode = new fields.StringField({ blank: true });
    schema.attackMultiplier = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
    schema.isElemental = new fields.BooleanField({ required: true, initial: false }),
    schema.element = new fields.StringField({  blank: true });
    
    return schema;
  }
}