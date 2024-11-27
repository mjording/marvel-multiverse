export default class MarvelMultiverseItemBase extends foundry.abstract.TypeDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.description = new fields.StringField({ required: true, blank: true });

    
    schema.size = new fields.StringField({ blank: true });
    schema.quantity = new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 });
    
    schema.ability = new fields.StringField({required: true, blank: true});
    schema.attack = new fields.BooleanField({ required: true, initial: false });
    schema.formula = new fields.StringField({required: true,  initial: "{1d6,1dm,1d6}" });
    
    return schema;
  }
}