import MarvelMultiverseItemBase from "./item-base.mjs";

export default class MarvelMultiverseWeapon extends MarvelMultiverseItemBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = MarvelMultiverseItemBase.defineSchema();

    schema.kind = new fields.StringField({ required: true, initial: "close" });
    schema.range = new fields.StringField({ blank: true });
    schema.damageMultiplier = new fields.StringField({ blank: true });
    schema.rule = new fields.StringField({ blank: true });
    schema.recommenedRank = new fields.StringField({ blank: true });
    schema.category = new fields.StringField({ blank: true });
    schema.reach = new fields.StringField({ blank: true });
    schema.history = new fields.StringField({ blank: true });
    schema.commentary = new fields.StringField({ blank: true });

    schema.equipped = new fields.BooleanField({
      required: true,
      initial: false,
    });
    schema.attackTarget = new fields.StringField({ blank: true });
    schema.attackRange = new fields.NumberField({
      ...requiredInteger,
      initial: 0,
      min: 0,
    });
    schema.attackKind = new fields.StringField({ blank: true });
    schema.damageType = new fields.StringField({ blank: true });
    schema.attackEdgeMode = new fields.StringField({ blank: true });
    schema.attackMultiplier = new fields.NumberField({
      ...requiredInteger,
      initial: 0,
      min: 0,
    });
    return schema;
  }
}
