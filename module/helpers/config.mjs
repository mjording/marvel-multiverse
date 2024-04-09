export const MARVEL_MULTIVERSE = {};

/**
 * The set of Ability Scores used within the system.
 * @type {Object}
 */
MARVEL_MULTIVERSE.abilities = {
  mel: 'MARVEL_MULTIVERSE.Ability.Mel.long',
  agl: 'MARVEL_MULTIVERSE.Ability.Agl.long',
  res: 'MARVEL_MULTIVERSE.Ability.Res.long',
  vig: 'MARVEL_MULTIVERSE.Ability.Vig.long',
  ego: 'MARVEL_MULTIVERSE.Ability.Ego.long',
  log: 'MARVEL_MULTIVERSE.Ability.Log.long',
};

MARVEL_MULTIVERSE.abilityAbbreviations = {
  mel: 'MARVEL_MULTIVERSE.Ability.Mel.abbr',
  agl: 'MARVEL_MULTIVERSE.Ability.Agl.abbr',
  res: 'MARVEL_MULTIVERSE.Ability.Res.abbr',
  vig: 'MARVEL_MULTIVERSE.Ability.Vig.abbr',
  ego: 'MARVEL_MULTIVERSE.Ability.Ego.abbr',
  log: 'MARVEL_MULTIVERSE.Ability.Log.abbr',
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