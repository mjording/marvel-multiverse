export const MARVEL_MULTIVERSE = {};
/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 */
MARVEL_MULTIVERSE.abilities = {
  mle: 'MARVEL_MULTIVERSE.Ability.Mel.long',
  agl: 'MARVEL_MULTIVERSE.Ability.Agl.long',
  res: 'MARVEL_MULTIVERSE.Ability.Res.long',
  vig: 'MARVEL_MULTIVERSE.Ability.Vig.long',
  ego: 'MARVEL_MULTIVERSE.Ability.Ego.long',
  log: 'MARVEL_MULTIVERSE.Ability.Log.long',
};


MARVEL_MULTIVERSE.MARVEL_RESULTS = {
  1: { label: "MARVEL_MULTIVERSE.MarvelResult.M", image: `systems/marvel-multiverse/icons/marvel-1.svg`},
  2: { label: "MARVEL_MULTIVERSE.MarvelResult.2", image: `systems/marvel-multiverse/icons/marvel-2.svg`},
  3: { label: "MARVEL_MULTIVERSE.MarvelResult.3", image: `systems/marvel-multiverse/icons/marvel-3.svg`},
  4: { label: "MARVEL_MULTIVERSE.MarvelResult.4", image: `systems/marvel-multiverse/icons/marvel-4.svg`},
  5: { label: "MARVEL_MULTIVERSE.MarvelResult.5", image: `systems/marvel-multiverse/icons/marvel-5.svg`},
  6: { label: "MARVEL_MULTIVERSE.MarvelResult.6", image: `systems/marvel-multiverse/icons/marvel-6.svg`},
};


MARVEL_MULTIVERSE.DICE_RESULTS = {
  1: { label: "MARVEL_MULTIVERSE.DiceResult.1", image: `systems/marvel-multiverse/icons/1.svg`},
  2: { label: "MARVEL_MULTIVERSE.DiceResult.2", image: `systems/marvel-multiverse/icons/2.svg`},
  3: { label: "MARVEL_MULTIVERSE.DiceResult.3", image: `systems/marvel-multiverse/icons/3.svg`},
  4: { label: "MARVEL_MULTIVERSE.DiceResult.4", image: `systems/marvel-multiverse/icons/4.svg`},
  5: { label: "MARVEL_MULTIVERSE.DiceResult.5", image: `systems/marvel-multiverse/icons/5.svg`},
  6: { label: "MARVEL_MULTIVERSE.DiceResult.6", image: `systems/marvel-multiverse/icons/6.svg`},
}


MARVEL_MULTIVERSE.sizes = {
  microscopic: { label: "MARVEL_MULTIVERSE.Size.Microscopic", speedMod: -5},
  miniature: { label: "MARVEL_MULTIVERSE.Size.Miniature", speedMod: -4},
  tiny: { label: "MARVEL_MULTIVERSE.Size.Tiny", speedMod: -3},
  little: { label: "MARVEL_MULTIVERSE.Size.Little", speedMod: -2},
  small: { label: "MARVEL_MULTIVERSE.Size.Small", speedMod: -1},
  average: { label: "MARVEL_MULTIVERSE.Size.Average", speedMod: 0},
  big: { label: "MARVEL_MULTIVERSE.Size.Big", speedMod: 1},
  huge: { label: "MARVEL_MULTIVERSE.Size.Huge", speedMod: 2},
  gargantuan: { label: "MARVEL_MULTIVERSE.Size.Gargantuan", speedMod: 3},
  varies: { label: "MARVEL_MULTIVERSE.Size.Varies", speedMod: 4}
};

MARVEL_MULTIVERSE.powersets = {
      basic: { label: "Basic"},
      elementalControl: {label: "Elemental Control"},
      illusion: {label: "Illusion"},
      luck: {label: "Luck"},
      magic: {label: "Magic"},
      martialArts: {label: "Martial Arts"},
      meleeWeapons: {label: "Melee Weapons"},
      narrative: {label: "Narrative"},
      omniversalTravel: {label: "Omniversal Travel"},
      phasing: {label: "Phasing"},
      plasticity: {label: "Plasticity"},
      powerControl: {label: "Power Control"},
      rangedWeapons: {label: "Ranged Weapons"},
      resize: {label: "Resize"},
      shieldBearer: {label: "Shield Bearer"},
      sixthSense: {label: "Sixth Sense"},
      spiderPowers: {label: "Spider-Powers"},
      superSpeed: {label: "Super-Speed"},
      superStrength: {label: "Super-Strength"},
      tactics: {label: "Tactics"},
      telekinesis: {label: "Telekinesis"},
      telepathy: {label: "Telepathy"},
      teleportation: {label: "Teleportation"},
      translation: {label: "Translation"},
      weatherControl: {label: "Weather Control"},
      
}

MARVEL_MULTIVERSE.reverseSetList =  Object.fromEntries(Object.keys(MARVEL_MULTIVERSE.powersets).map((k) => [MARVEL_MULTIVERSE.powersets[k].label,k]));


MARVEL_MULTIVERSE.movementTypes = {
  run: { label: "MARVEL_MULTIVERSE.Movement.Run", active: true },
  climb: { label: "MARVEL_MULTIVERSE.Movement.Climb", active: true },
  swim: { label: "MARVEL_MULTIVERSE.Movement.Swim", active: true },
  jump: { label: "MARVEL_MULTIVERSE.Movement.Jump", active: true },
  flight: { label: "MARVEL_MULTIVERSE.Movement.Flight", active: false },
  glide: { label: "MARVEL_MULTIVERSE.Movement.Glide", active: false },
  swingline: { label: "MARVEL_MULTIVERSE.Movement.Swingline", active: false },
  levitation: { label: "MARVEL_MULTIVERSE.Movement.Levitation", active: false },
}

MARVEL_MULTIVERSE.elements = {
  air: { label: "Air", fantasticEffect: "Target is knocked prone for one round."},
  earth: { label: "Earth", fantasticEffect: "Target moves at half speed for one round."},
  electricity: { label: "Electricity", fantasticEffect: "Stuns target for one round."},
  energy: { label: "Energy", fantasticEffect: "Blinds target for one round."},
  fire: { label: "Fire", fantasticEffect: "Sets target ablaze."},
  force: { label: "Force", fantasticEffect: "Target has trouble on all actions for one round."},
  hellfire: { label: "Hellfire", fantasticEffect: "Splits damage equally between Health and Focus."},
  ice: { label: "Ice", fantasticEffect: "Paralyzes target for one round."},
  iron: { label: "Iron", fantasticEffect: "Pins target for one round."},
  sound: { label: "Sound", fantasticEffect: "Deafens target for one round."},
  water: { label: "Water", fantasticEffect: "Surprises target until the end of the next round."},
  toxin: { label: "Toxin", fantasticEffect: "The target is poisoned."},
  chemical: { label: "Chemical", fantasticEffect: "The target is corroding."},
}


// ASCII Artwork
MARVEL_MULTIVERSE.ASCII = `
=ccccc,      ,cccc       ccccc      ,cccc,  ?$$$$$$$,  ,ccc,   -ccc
:::"$$$$bc    $$$$$     ::'$$$$$c,  : $$$$$c':"$$$$???''."$$$$c,:'?$$c
'::::"?$$$$c,z$$$$F     ':: ?$$$$$c,':'$$$$$h':'?$$$,' :::'$$$$$$c,"$$h,
  '::::."$$$$$$$$$'    ..,,,:"$$$$$$h, ?$$$$$$c':"$$$$$$$b':"$$$$$$$$$$$c
    '::::"?$$$$$$    :"$$$$c:'$$$$$$$$d$$$P$$$b':'?$$$c : ::'?$$c "?$$$$h,
      ':::.$$$$$$$c,'::'????":'?$$$E"?$$$$h ?$$$.':?$$$h..,,,:"$$$,:."?$$$c
        ': $$$$$$$$$c, ::''  :::"$$$b '"$$$ :"$$$b':'?$$$$$$$c''?$F ':: "::
          .,$$$$$"?$$$$$c,    ':::"$$$$.::"$.:: ?$$$.:.???????" ':::  ' '''
          'J$$$$P'::"?$$$$h,   ':::'?$$$c'::'':: .:: : :::::''   '
        :,$$$$$':::::'?$$$$$c,  ::: "::  ::  ' ::'   ''
        .'J$$$$F  '::::: .::::    ' :::'  '
      .: ???):     ':: :::::
      : :::::'        '
        ''
`;