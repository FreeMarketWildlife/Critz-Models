export const weaponsMapDefaultLayout = {
  "generatedAt": "2026-03-23T00:00:00.000Z",
  "board": {
    "width": 4715,
    "height": 2151,
    "nodeWidth": 176,
    "nodeHeight": 84
  },
  "categories": {
    "primary": {
      "label": "Primary",
      "progressionGroups": [
        {
          "id": "plant",
          "label": "Plant"
        },
        {
          "id": "primitive",
          "label": "Primitive"
        },
        {
          "id": "military",
          "label": "Military"
        },
        {
          "id": "mystical",
          "label": "Mystical"
        },
        {
          "id": "pets",
          "label": "Pets"
        }
      ],
      "weapons": [
        {
          "id": "bow",
          "name": "Bow",
          "group": "primitive",
          "x": 1516,
          "y": 711,
          "imagePath": "assets/images/Weapons/Primary/Image_Bow.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "sniper-rifle",
              "level": 5
            }
          ]
        },
        {
          "id": "crossbow",
          "name": "Crossbow",
          "group": "primitive",
          "x": 1697,
          "y": 992,
          "imagePath": "assets/images/Weapons/Primary/Image_Crossbow.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "bow",
              "level": 15
            },
            {
              "weaponId": "sniper-rifle",
              "level": 10
            }
          ]
        },
        {
          "id": "assault-rifle",
          "name": "Assault Rifle",
          "group": "military",
          "x": 2270,
          "y": 338,
          "imagePath": "assets/images/Weapons/Primary/Image_Assault Rifle.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "shotgun",
          "name": "Shotgun",
          "group": "military",
          "x": 2451,
          "y": 524,
          "imagePath": "assets/images/Weapons/Primary/Image_Shotgun.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "assault-rifle",
              "level": 5
            }
          ]
        },
        {
          "id": "sniper-rifle",
          "name": "Sniper Rifle",
          "group": "military",
          "x": 2088,
          "y": 524,
          "imagePath": "assets/images/Weapons/Primary/Image_Sniper Rifle.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "assault-rifle",
              "level": 15
            }
          ]
        },
        {
          "id": "grenade-launcher",
          "name": "Grenade Launcher",
          "group": "military",
          "x": 2632,
          "y": 898,
          "imagePath": "assets/images/Weapons/Primary/Image_Grenade Launcher.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "rocket-launcher",
              "level": 30
            }
          ]
        },
        {
          "id": "rocket-launcher",
          "name": "Rocket Launcher",
          "group": "military",
          "x": 2632,
          "y": 711,
          "imagePath": "assets/images/Weapons/Primary/Image_Rocket Launcher.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "shotgun",
              "level": 10
            }
          ]
        },
        {
          "id": "wizard-staff",
          "name": "Wizard Staff",
          "group": "mystical",
          "x": 3205,
          "y": 992,
          "imagePath": "assets/images/Weapons/Primary/Image_Wizard Staff.png",
          "style": null,
          "requirements": [
            {
              "type": "alien-node",
              "weaponId": "wand",
              "level": 30,
              "x": 2842,
              "y": 431
            },
            {
              "type": "alien-node",
              "critterId": "salamander",
              "level": 50,
              "x": 3567,
              "y": 431
            }
          ]
        },
        {
          "id": "mantis-shrimp",
          "name": "Mantis Shrimp",
          "group": "pets",
          "x": 3777,
          "y": 898,
          "imagePath": "assets/images/Weapons/Primary/Image_Mantis Shrimp.png",
          "style": null,
          "requirements": []
        }
      ],
      "lines": []
    },
    "secondary": {
      "label": "Secondary",
      "progressionGroups": [
        {
          "id": "plant",
          "label": "Plant"
        },
        {
          "id": "primitive",
          "label": "Primitive"
        },
        {
          "id": "military",
          "label": "Military"
        },
        {
          "id": "mystical",
          "label": "Mystical"
        },
        {
          "id": "pets",
          "label": "Pets"
        }
      ],
      "weapons": [
        {
          "id": "shotweed",
          "name": "Shotweed",
          "group": "plant",
          "x": 37,
          "y": 992,
          "imagePath": "assets/images/Weapons/Secondary/Image_Shotweed.png",
          "style": null,
          "requirements": [
            {
              "type": "alien-node",
              "weaponId": "shotgun",
              "level": 10,
              "x": 37,
              "y": 431
            }
          ]
        },
        {
          "id": "yellow-woodsorrel",
          "name": "Yellow Woodsorrel",
          "group": "plant",
          "x": 400,
          "y": 992,
          "imagePath": "assets/images/Weapons/Secondary/Image_Yellow Woodsorrel.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "witch-hazel-seed",
          "name": "Witch Hazel Seed",
          "group": "plant",
          "x": 762,
          "y": 992,
          "imagePath": "assets/images/Weapons/Secondary/Image_Witch Hazel Seed.png",
          "style": null,
          "requirements": [
            {
              "type": "alien-node",
              "weaponId": "sniper-rifle",
              "level": 20,
              "x": 762,
              "y": 431
            }
          ]
        },
        {
          "id": "slingshot",
          "name": "Slingshot",
          "group": "primitive",
          "x": 1335,
          "y": 805,
          "imagePath": "assets/images/Weapons/Secondary/Image_Slingshot.png",
          "style": null,
          "requirements": [
            {
              "type": "alien-node",
              "weaponId": "sniper-rifle",
              "level": 5,
              "x": 1335,
              "y": 431
            }
          ]
        },
        {
          "id": "blaster-pistol",
          "name": "Blaster Pistol",
          "group": "military",
          "x": 2270,
          "y": 338,
          "imagePath": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "flamethrower",
          "name": "Flamethrower",
          "group": "military",
          "x": 2632,
          "y": 805,
          "imagePath": "assets/images/Weapons/Secondary/Image_Flamethrower.png",
          "style": null,
          "requirements": [
            {
              "type": "alien-node",
              "weaponId": "bottle-o-fire",
              "level": 10,
              "x": 2632,
              "y": 431
            }
          ]
        },
        {
          "id": "splash-blaster",
          "name": "Splash Blaster",
          "group": "military",
          "x": 2088,
          "y": 618,
          "imagePath": "assets/images/Weapons/Secondary/Image_Splash Blaster.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "blaster-pistol",
              "level": 10
            }
          ]
        },
        {
          "id": "revolver",
          "name": "Revolver",
          "group": "military",
          "x": 2451,
          "y": 618,
          "imagePath": "assets/images/Weapons/Secondary/Image_Revolver.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "blaster-pistol",
              "level": 15
            }
          ]
        },
        {
          "id": "wand",
          "name": "Wand",
          "group": "mystical",
          "x": 3205,
          "y": 992,
          "imagePath": "assets/images/Weapons/Secondary/Image_Wand.png",
          "style": null,
          "requirements": [
            {
              "type": "alien-node",
              "critterId": "salamander",
              "level": 40,
              "x": 3205,
              "y": 431
            }
          ]
        }
      ],
      "lines": []
    },
    "melee": {
      "label": "Melee",
      "progressionGroups": [
        {
          "id": "plant",
          "label": "Plant"
        },
        {
          "id": "primitive",
          "label": "Primitive"
        },
        {
          "id": "military",
          "label": "Military"
        },
        {
          "id": "mystical",
          "label": "Mystical"
        },
        {
          "id": "pets",
          "label": "Pets"
        }
      ],
      "weapons": [
        {
          "id": "blade-of-grass",
          "name": "Blade of Grass",
          "group": "plant",
          "x": 218,
          "y": 431,
          "imagePath": "assets/images/Weapons/Melee/Image_Blade of Grass.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "poison-sumac",
          "name": "Poison Sumac",
          "group": "plant",
          "x": 581,
          "y": 1272,
          "imagePath": "assets/images/Weapons/Melee/Image_Poison Sumac.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "poison-oak",
              "level": 10
            }
          ]
        },
        {
          "id": "poison-oak",
          "name": "Poison Oak",
          "group": "plant",
          "x": 762,
          "y": 1178,
          "imagePath": "assets/images/Weapons/Melee/Image_Poison Oak.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "poison-ivy",
              "level": 10
            }
          ]
        },
        {
          "id": "poison-ivy",
          "name": "Poison Ivy",
          "group": "plant",
          "x": 581,
          "y": 992,
          "imagePath": "assets/images/Weapons/Melee/Image_Poison Ivy.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "stinging-nettle",
              "level": 10
            }
          ]
        },
        {
          "id": "stinging-nettle",
          "name": "Stinging Nettle",
          "group": "plant",
          "x": 762,
          "y": 805,
          "imagePath": "assets/images/Weapons/Melee/Image_Stinging Nettle.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "warhammer",
          "name": "Warhammer",
          "group": "primitive",
          "x": 972,
          "y": 1272,
          "imagePath": "assets/images/Weapons/Melee/Image_Warhammer.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "tomahawk",
          "name": "Tomahawk",
          "group": "primitive",
          "x": 1697,
          "y": 1178,
          "imagePath": "assets/images/Weapons/Melee/Image_Tomahawk.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "knife",
              "level": 5
            }
          ]
        },
        {
          "id": "shield",
          "name": "Shield",
          "group": "primitive",
          "x": 1335,
          "y": 1272,
          "imagePath": "assets/images/Weapons/Melee/Image_Shield.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "bo-staff",
          "name": "Bo Staff",
          "group": "primitive",
          "x": 1697,
          "y": 711,
          "imagePath": "assets/images/Weapons/Melee/Image_Bo Staff.png",
          "style": null,
          "requirements": [
            {
              "type": "alien-node",
              "weaponId": "bottle-o-air",
              "level": 5,
              "x": 1335,
              "y": 431
            }
          ]
        },
        {
          "id": "knife",
          "name": "Knife",
          "group": "military",
          "x": 1907,
          "y": 992,
          "imagePath": "assets/images/Weapons/Melee/Image_Knife.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "katana",
          "name": "Katana",
          "group": "military",
          "x": 2088,
          "y": 1272,
          "imagePath": "assets/images/Weapons/Melee/Image_Katana.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "knife",
              "level": 30
            }
          ]
        },
        {
          "id": "fists",
          "name": "Fists",
          "group": "primitive",
          "x": 1154,
          "y": 805,
          "imagePath": "assets/images/Weapons/Melee/Image_Fists.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "bee",
          "name": "Bee",
          "group": "pets",
          "x": 4321,
          "y": 805,
          "imagePath": "assets/images/Weapons/Melee/Image_Bee.png",
          "style": null,
          "requirements": []
        }
      ],
      "lines": []
    },
    "utility": {
      "label": "Utility",
      "progressionGroups": [
        {
          "id": "plant",
          "label": "Plant"
        },
        {
          "id": "primitive",
          "label": "Primitive"
        },
        {
          "id": "military",
          "label": "Military"
        },
        {
          "id": "mystical",
          "label": "Mystical"
        },
        {
          "id": "pets",
          "label": "Pets"
        }
      ],
      "weapons": [
        {
          "id": "dandelion",
          "name": "Dandelion",
          "group": "plant",
          "x": 37,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Dandelion.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "glider",
              "level": 10
            }
          ]
        },
        {
          "id": "maple-seed",
          "name": "Maple Seed",
          "group": "plant",
          "x": 218,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Maple Seed.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "squirting-cucumber",
          "name": "Squirting Cucumber",
          "group": "plant",
          "x": 400,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Squirting Cucumber.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "dynamite-tree-seed",
          "name": "Dynamite Tree Seed",
          "group": "plant",
          "x": 581,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Dynamite Tree Seed.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "jewelweed",
          "name": "Jewelweed",
          "group": "plant",
          "x": 762,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Jewelweed.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "resources",
          "name": "Resources",
          "group": "primitive",
          "x": 972,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Resources.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "glider",
          "name": "Glider",
          "group": "primitive",
          "x": 1697,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Glider.png",
          "style": null,
          "requirements": [
            {
              "type": "alien-node",
              "weaponId": "bo-staff",
              "level": 10,
              "x": 1335,
              "y": 431
            }
          ]
        },
        {
          "id": "grenade",
          "name": "Grenade",
          "group": "military",
          "x": 1907,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Grenade.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "mines",
          "name": "Mines",
          "group": "military",
          "x": 2270,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Mines.png",
          "style": null,
          "requirements": [
            {
              "type": "alien-node",
              "weaponId": "rocket-launcher",
              "level": 15,
              "x": 2270,
              "y": 431
            },
            {
              "weaponId": "grenade",
              "level": 10
            }
          ]
        },
        {
          "id": "smoke-grenade",
          "name": "Smoke Grenade",
          "group": "military",
          "x": 2632,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Smoke Grenade.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "grenade",
              "level": 5
            }
          ]
        },
        {
          "id": "bottle-o-gas",
          "name": "Bottle o' Gas",
          "group": "mystical",
          "x": 2842,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Bottle o' Gas.png",
          "style": null,
          "requirements": [
            {
              "type": "alien-node",
              "critterId": "newt",
              "level": 10,
              "x": 2842,
              "y": 431
            },
            {
              "weaponId": "smoke-grenade",
              "level": 10
            }
          ]
        },
        {
          "id": "bottle-o-ice",
          "name": "Bottle o' Ice",
          "group": "mystical",
          "x": 3023,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Bottle o' Ice.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "bottle-o-fire",
          "name": "Bottle o' Fire",
          "group": "mystical",
          "x": 3205,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Bottle o' Fire.png",
          "style": null,
          "requirements": [
            {
              "weaponId": "grenade",
              "level": 15
            },
            {
              "type": "alien-node",
              "critterId": "fire-bellied-toad",
              "level": 5,
              "x": 3567,
              "y": 431
            }
          ]
        },
        {
          "id": "bottle-o-lightning",
          "name": "Bottle o' Lightning",
          "group": "mystical",
          "x": 3386,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Bottle o' Lightning.png",
          "style": null,
          "requirements": []
        },
        {
          "id": "bottle-o-air",
          "name": "Bottle o' Air",
          "group": "mystical",
          "x": 3567,
          "y": 992,
          "imagePath": "assets/images/Weapons/Utility/Image_Bottle o' Air.png",
          "style": null,
          "requirements": []
        }
      ],
      "lines": []
    }
  }
};
