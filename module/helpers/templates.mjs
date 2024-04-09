/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    'systems/marvel-multiverse/templates/actor/parts/actor-tags.hbs',
    'systems/marvel-multiverse/templates/actor/parts/actor-traits.hbs',
    'systems/marvel-multiverse/templates/actor/parts/actor-items.hbs',,
    'systems/marvel-multiverse/templates/actor/parts/actor-details.hbs',
    'systems/marvel-multiverse/templates/actor/parts/actor-origins.hbs',
    'systems/marvel-multiverse/templates/actor/parts/actor-powers.hbs',
    'systems/marvel-multiverse/templates/actor/parts/actor-effects.hbs',
    // Item partials
    'systems/marvel-multiverse/templates/item/parts/item-effects.hbs',
  ]);
};
