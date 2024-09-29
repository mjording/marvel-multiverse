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

MARVEL_MULTIVERSE.damageAbilityAbr = {
  Melee: 'mle',
  Agility: 'agl',
  Ego: 'ego',
  Logic: 'log'
}

MARVEL_MULTIVERSE.damageAbility =  Object.fromEntries(Object.keys(MARVEL_MULTIVERSE.damageAbilityAbr).map((k) => [MARVEL_MULTIVERSE.damageAbilityAbr[k],k]));


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
  microscopic: { label: "MARVEL_MULTIVERSE.Size.Microscopic", sizeMultiplier: 0},
  miniature: { label: "MARVEL_MULTIVERSE.Size.Miniature", sizeMultiplier: 0},
  tiny: { label: "MARVEL_MULTIVERSE.Size.Tiny", sizeMultiplier: 0},
  little: { label: "MARVEL_MULTIVERSE.Size.Little", sizeMultiplier: 0.25},
  small: { label: "MARVEL_MULTIVERSE.Size.Small", sizeMultiplier: 0},
  average: { label: "MARVEL_MULTIVERSE.Size.Average", sizeMultiplier: 0},
  big: { label: "MARVEL_MULTIVERSE.Size.Big", sizeMultiplier: 0},
  huge: { label: "MARVEL_MULTIVERSE.Size.Huge", sizeMultiplier: 5},
  gigantic: { label: "MARVEL_MULTIVERSE.Size.Gigantic", sizeMultiplier: 20},
  titanic: { label: "MARVEL_MULTIVERSE.Size.Titanic", sizeMultiplier: 80},
  gargantuan: { label: "MARVEL_MULTIVERSE.Size.Gargantuan", sizeMultiplier: 320}
};

MARVEL_MULTIVERSE.powersets = {
      basic: { label: "Basic"},
      elementalControl: {label: "Elemental Control"},
      healing: {label: "Healing"},
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

MARVEL_MULTIVERSE.teamManeuvers = [
  {
    maneuverType: "Offensive",
    levels: [
      {
        level: 1, 
        cost: "5 focus, each",
        rankAvg: [1,2],
        description: "The team members all get an edge on any attack they make this round."
      },
      {
        level: 2, 
        cost: "10 focus, each",
        rankAvg: [3,4],
        description: "The team members can each reroll all their dice on any attack they make this round. They get to use the better result."
      },
      {
        level: 3, 
        cost: "15 focus, each",
        rankAvg: [5,6],
        description: "The team members can each turn their Marvel die to a Fantastic success on any attack roll they make this round against targets of equal or highter rank."
      }
    ]
  },
  {
    maneuverType: "Defensive",
    levels: [
      {
        level: 1, 
        cost: "5 focus, each",
        rankAvg: [1,2],
        description: "The team members all have Damage Reduction 2 for this round"
      },
      {
        level: 2, 
        cost: "10 focus, each",
        rankAvg: [3,4],
        description: "The team members all have Damage Reduction 4 for this round"
      },
      {
        level: 3, 
        cost: "15 focus, each",
        rankAvg: [5,6],
        description: "The team members all have Damage Reduction 8 for this round"
      }
    ]
  },
  {
    maneuverType:  "Rally",
    levels: [
      {
        level: 1, 
        cost: "5 focus, each",
        rankAvg: [1,2],
        description: "All actions taken against team members have trouble this round."
      },
      {
        level: 2, 
        cost: "10 focus, each",
        rankAvg: [3,4],
        description: "Each member of the team can make a speedy recovery roll for either Health or Focus, as if they had spent a point of Karma"
      },
      {
        level: 3, 
        cost: "15 focus, each",
        rankAvg: [5,6],
        description: "A single member of the team who has been killed or shattered in battle is healed to at least Health: 0 and Focus: 0"
      }
    ]
  }
]


MARVEL_MULTIVERSE.sizeEffects = {
  microscopic: {
    "name": "Microscopic Effects",
    "disabled": false,
    "changes": [
      {
        "key": "system.size",
        "mode": 5,
        "value": "microscopic"
      },
      {
        "key": "system.abilities.mle.defense",
        "mode": 2,
        "value": 5
      },
      {
        "key": "system.abilities.agl.defense",
        "mode": 2,
        "value": 5
      }
    ],
    "description": "",
    "transfer": true,
    "statuses": [],
    "flags": {}
  },
  miniature: {
    "name": "Miniature Effects",
    "disabled": false,
    "changes": [
      {
        "key": "system.size",
        "mode": 5,
        "value": "miniature"
      },
      {
        "key": "system.abilities.mle.defense",
        "mode": 2,
        "value": 4
      },
      {
        "key": "system.abilities.agl.defense",
        "mode": 2,
        "value": 4
      }
    ],
    "description": "",
    "transfer": true,
    "statuses": [],
    "flags": {}
  },
  tiny: {
    "name": "Tiny Effects",
    "disabled": false,
    "changes": [
      {
        "key": "system.size",
        "mode": 5,
        "value": "tiny"
      },
      {
        "key": "system.abilities.mle.defense",
        "mode": 2,
        "value": 3
      },
      {
        "key": "system.abilities.agl.defense",
        "mode": 2,
        "value": 3
      }
    ],
    "description": "",
    "transfer": true,
    "statuses": [],
    "flags": {}
  },
  little: {
    "name": "Little Effects",
    "disabled": false,
    "changes": [
      {
        "key": "system.size",
        "mode": 5,
        "value": "little"
      },
      {
        "key": "system.abilities.mle.defense",
        "mode": 2,
        "value": 2
      },
      {
        "key": "system.abilities.agl.defense",
        "mode": 2,
        "value": 2
      },
      {
        "key": "prototypeToken.width",
        "mode":  1,
        "value": 0.25
      },
      {
        "key": "prototypeToken.height",
        "mode":  1,
        "value": 0.25
      }
    ],
    "description": "",
    "transfer": true,
    "statuses": [],
    "flags": {}
  },
  small: {
    "name": "Small Effects",
    "disabled": false,
    "changes": [
      {
        "key": "system.size",
        "mode": 5,
        "value": "small"
      },
      {
        "key": "system.abilities.mle.defense",
        "mode": 2,
        "value": 1
      },
      {
        "key": "system.abilities.agl.defense",
        "mode": 2,
        "value": 1
      },
      {
        "key": "system.movement.run.value",
        "mode": 2,
        "value": -1
      }
    ],
    "description": "",
    "transfer": true,
    "statuses": [],
    "flags": {},
  },
  average: {
    "name": "Average Effects",
    "disabled": false,
    "changes": [
      {
        "key": "system.size",
        "mode": 5,
        "value": "average"
      }
    ],
    "description": "",
    "transfer": true,
    "statuses": [],
    "flags": {}
  },
  big: {
    "name": "Big Effects",
    "disabled": false,
    "changes": [
      {
        "key": "system.size",
        "mode": 5,
        "value": "big"
      },
      {
        "key": "system.abilities.mle.defense",
        "mode": 2,
        "value": -1
      },
      {
        "key": "system.abilities.agl.defense",
        "mode": 2,
        "value": -1
      },
      {
        "key": "system.reach",
        "mode": 5,
        "value": 2
      },
      {
        "key": "system.movement.run.value",
        "mode": 2,
        "value": 1
      }
    ],
    "description": "",
    "transfer": true,
    "statuses": [],
    "flags": {}
  },
  huge: {
    "name": "Huge Effects",
    "disabled": false,
    "changes": [
      {
        "key": "system.size",
        "mode": 5,
        "value": "huge"
      },
      {
        "key": "system.abilities.mle.defense",
        "mode": 2,
        "value": -2
      },
      {
        "key": "system.abilities.agl.defense",
        "mode": 2,
        "value": -2
      },
      {
        "key": "system.reach",
        "mode": 5,
        "value": 5
      },
      {
        "key": "system.movement.run.value",
        "mode": 1,
        "value": 5
      },
      {
        "key": "system.abilities.mle.damageMultiplier",
        "mode": 2,
        "value": 2
      },
      {
        "key": "prototypeToken.width",
        "mode":  1,
        "value": 5
      },
      {
        "key": "prototypeToken.height",
        "mode":  1,
        "value": 5
      }
    ],
    "description": "",
    "transfer": true,
    "statuses": [],
    "flags": {}
  },
  gigantic: {
    "name": "Gigantic Effects",
    "disabled": false,
    "changes": [
      {
        "key": "system.size",
        "mode": 5,
        "value": "gigantic"
      },
      {
        "key": "system.abilities.mle.defense",
        "mode": 2,
        "value": -3
      },
      {
        "key": "system.abilities.agl.defense",
        "mode": 2,
        "value": -3
      },
      {
        "key": "system.reach",
        "mode": 5,
        "value": 20
      },
      {
        "key": "system.movement.run.value",
        "mode": 1,
        "value": 20
      },
      {
        "key": "system.abilities.mle.damageMultiplier",
        "mode": 2,
        "value": 4
      },
      {
        "key": "prototypeToken.width",
        "mode":  1,
        "value": 20
      },
      {
        "key": "prototypeToken.height",
        "mode":  1,
        "value": 20
      }
    ],
    "description": "",
    "transfer": true,
    "statuses": [],
    "flags": {}
  },
  titanic: {
    "name": "Titanic Effects",
    "disabled": false,
    "changes": [
      {
        "key": "system.size",
        "mode": 5,
        "value": "titanic"
      },
      {
        "key": "system.abilities.mle.defense",
        "mode": 2,
        "value": -4
      },
      {
        "key": "system.abilities.agl.defense",
        "mode": 2,
        "value": -4
      },
      {
        "key": "system.reach",
        "mode": 5,
        "value": 80
      },
      {
        "key": "system.movement.run.value",
        "mode": 1,
        "value": 80
      },
      {
        "key": "system.abilities.mle.damageMultiplier",
        "mode": 2,
        "value": 6
      },
      {
        "key": "prototypeToken.width",
        "mode":  1,
        "value": 80
      },
      {
        "key": "prototypeToken.height",
        "mode":  1,
        "value": 80
      }
    ],
    "description": "",
    "transfer": true,
    "statuses": [],
    "flags": {}
  },
  gargantuan: {
    "name": "Gargantuan Effects",
    "disabled": false,
    "changes": [
      {
        "key": "system.size",
        "mode": 5,
        "value": "gargantuan"
      },
      {
        "key": "system.abilities.mle.defense",
        "mode": 2,
        "value": -5
      },
      {
        "key": "system.abilities.agl.defense",
        "mode": 2,
        "value": -5
      },
      {
        "key": "system.reach",
        "mode": 5,
        "value": 320
      },
      {
        "key": "system.movement.run.value",
        "mode": 1,
        "value": 320
      },
      {
        "key": "system.abilities.mle.damageMultiplier",
        "mode": "2",
        "value": "8"
      },
      {
        "key": "prototypeToken.width",
        "mode":  1,
        "value": 320
      },
      {
        "key": "prototypeToken.height",
        "mode":  1,
        "value": 320
      }
    ],
    "description": "",
    "transfer": true,
    "statuses": [],
    "flags": {}
  }
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