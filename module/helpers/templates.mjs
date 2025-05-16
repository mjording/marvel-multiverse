/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async () =>
  loadTemplates([
    // Actor partials.
    "systems/marvel-multiverse/templates/actor/parts/actor-biography.hbs",
    "systems/marvel-multiverse/templates/actor/parts/actor-details.hbs",
    "systems/marvel-multiverse/templates/actor/parts/actor-effects.hbs",
    "systems/marvel-multiverse/templates/actor/parts/actor-items.hbs",
    "systems/marvel-multiverse/templates/actor/parts/actor-occupation.hbs",
    "systems/marvel-multiverse/templates/actor/parts/actor-origin.hbs",
    "systems/marvel-multiverse/templates/actor/parts/actor-powers.hbs",
    "systems/marvel-multiverse/templates/actor/parts/actor-tags.hbs",
    "systems/marvel-multiverse/templates/actor/parts/actor-traits.hbs",
    "systems/marvel-multiverse/templates/actor/parts/actor-weapons.hbs",
    // Item partials
    "systems/marvel-multiverse/templates/item/parts/item-effects.hbs",
  ]);
