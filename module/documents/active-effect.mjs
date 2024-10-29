/**
 * Extend the base ActiveEffect class to implement system-specific logic.
 * @extends {ActiveEffect}
 */
export class MarvelMultiverseActiveEffect extends ActiveEffect {

  /* -------------------------------------------- */
  /*  Effect Application                          */
  /* -------------------------------------------- */

  /** @inheritdoc */
  apply(actor, change) {
    const current = foundry.utils.getProperty(actor, change.key) ?? null;

    if ( change.key.endsWith('DamageReduction') ){
      if ( current >= change.value) {
        return;
      }
    }
  
    this._applyLegacy(actor, change, {})   
  }
}