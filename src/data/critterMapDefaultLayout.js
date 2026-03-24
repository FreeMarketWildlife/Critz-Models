export const critterMapDefaultLayout = {
  "generatedAt": "2026-03-24T02:17:03.946Z",
  "board": {
    "width": 1700,
    "height": 3980,
    "nodeWidth": 176,
    "nodeHeight": 84,
    "gridColumnsPerRarity": 9,
    "gridRowsPerRarity": 7
  },
  "categories": {
    "reptiles": {
      "label": "Reptiles",
      "critters": [
        {
          "id": "lizard",
          "name": "Lizard",
          "rarity": "common",
          "level": 0,
          "x": 762,
          "y": 151,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 145,
            "saturation": 88,
            "lightness": 52,
            "glow": true,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 1
          },
          "requirements": []
        },
        {
          "id": "anole",
          "name": "Anole",
          "rarity": "common",
          "level": 10,
          "x": 1306,
          "y": 524,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 193,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "lizard",
              "level": 10
            }
          ]
        },
        {
          "id": "basilisk",
          "name": "Basilisk",
          "rarity": "uncommon",
          "level": 25,
          "x": 943,
          "y": 1004,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 100,
            "saturation": 100,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "lizard",
              "level": 25
            }
          ]
        },
        {
          "id": "bearded-dragon",
          "name": "Bearded Dragon",
          "rarity": "rare",
          "level": 15,
          "x": 1306,
          "y": 1671,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 33,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "basilisk",
              "level": 15
            }
          ]
        },
        {
          "id": "draco",
          "name": "Draco",
          "rarity": "rare",
          "level": 15,
          "x": 1487,
          "y": 1951,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 145,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "gecko",
              "level": 15
            },
            {
              "critterId": "bearded-dragon",
              "level": 5
            }
          ]
        },
        {
          "id": "dragon",
          "name": "Dragon",
          "rarity": "mythical",
          "level": 50,
          "x": 1125,
          "y": 3284,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 0,
            "saturation": 100,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 9
          },
          "requirements": [
            {
              "critterId": "draco",
              "level": 50
            },
            {
              "critterId": "bearded-dragon",
              "level": 50
            }
          ]
        },
        {
          "id": "gecko",
          "name": "Gecko",
          "rarity": "uncommon",
          "level": 15,
          "x": 1487,
          "y": 1284,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 310,
            "saturation": 88,
            "lightness": 64,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "anole",
              "level": 15
            }
          ]
        },
        {
          "id": "kappa",
          "name": "Kappa",
          "rarity": "mythical",
          "level": 100,
          "x": 218,
          "y": 3191,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 116,
            "hue": 285,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "tortoise",
              "level": 30
            },
            {
              "critterId": "snapper",
              "level": 25
            },
            {
              "critterId": "turtle",
              "level": 100
            }
          ]
        },
        {
          "id": "pancake-tortoise",
          "name": "Pancake Tortoise",
          "rarity": "uncommon",
          "level": 15,
          "x": 399,
          "y": 911,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 287,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "tortoise",
              "level": 15
            }
          ]
        },
        {
          "id": "pigsnouted-turtle",
          "name": "Pigsnouted Turtle",
          "rarity": "rare",
          "level": 10,
          "x": 762,
          "y": 1671,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 307,
            "saturation": 88,
            "lightness": 80,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "turtle",
              "level": 10
            },
            {
              "critterId": "snapper",
              "level": 10
            }
          ]
        },
        {
          "id": "pterosaur",
          "name": "Pterosaur",
          "rarity": "extinct",
          "level": 30,
          "x": 943,
          "y": 2431,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 238,
            "saturation": 85,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "draco",
              "level": 30
            },
            {
              "critterId": "bearded-dragon",
              "level": 15
            }
          ]
        },
        {
          "id": "snakeneck-turtle",
          "name": "Snakeneck Turtle",
          "rarity": "rare",
          "level": 15,
          "x": 218,
          "y": 1671,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 259,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "snapper",
              "level": 15
            }
          ]
        },
        {
          "id": "snapper",
          "name": "Snapper",
          "rarity": "uncommon",
          "level": 15,
          "x": 399,
          "y": 1284,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 112,
            "hue": 143,
            "saturation": 86,
            "lightness": 32,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "tortoise",
              "level": 15
            }
          ]
        },
        {
          "id": "softshell-turtle",
          "name": "Softshell Turtle",
          "rarity": "rare",
          "level": 20,
          "x": 581,
          "y": 1858,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 56,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "turtle",
              "level": 20
            }
          ]
        },
        {
          "id": "tortoise",
          "name": "Tortoise",
          "rarity": "common",
          "level": 10,
          "x": 37,
          "y": 618,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 59,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 9
          },
          "requirements": [
            {
              "critterId": "turtle",
              "level": 10
            }
          ]
        },
        {
          "id": "turtle",
          "name": "Turtle",
          "rarity": "common",
          "level": 5,
          "x": 581,
          "y": 431,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 19,
            "saturation": 88,
            "lightness": 52,
            "glow": true,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 9
          },
          "requirements": [
            {
              "critterId": "lizard",
              "level": 5
            }
          ]
        },
        {
          "id": "velociraptor",
          "name": "Velociraptor",
          "rarity": "extinct",
          "level": 30,
          "x": 581,
          "y": 2991,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 327,
            "saturation": 97,
            "lightness": 69,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "basilisk",
              "level": 30
            }
          ]
        },
        {
          "id": "veratus",
          "name": "Veratus",
          "rarity": "mythical",
          "level": 100,
          "x": 762,
          "y": 3378,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 191,
            "saturation": 88,
            "lightness": 68,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 5
          },
          "requirements": [
            {
              "critterId": "basilisk",
              "level": 100
            }
          ]
        }
      ],
      "lines": []
    },
    "amphibians": {
      "label": "Amphians",
      "critters": [
        {
          "id": "frog",
          "name": "Frog",
          "rarity": "common",
          "level": 0,
          "x": 762,
          "y": 151,
          "imageView": null,
          "style": {
            "textScale": 173,
            "hue": 131,
            "saturation": 100,
            "lightness": 43,
            "glow": true,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 4
          },
          "requirements": []
        },
        {
          "id": "african-bullfrog",
          "name": "African Bullfrog",
          "rarity": "uncommon",
          "level": 20,
          "x": 1125,
          "y": 1191,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 28,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "bullfrog",
              "level": 20
            }
          ]
        },
        {
          "id": "axolotl",
          "name": "Axolotl",
          "rarity": "rare",
          "level": 30,
          "x": 399,
          "y": 1858,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 299,
            "saturation": 76,
            "lightness": 66,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "salamander",
              "level": 30
            },
            {
              "critterId": "slender-salamander",
              "level": 10
            }
          ]
        },
        {
          "id": "black-rain-frog",
          "name": "Black Rain Frog",
          "rarity": "rare",
          "level": 30,
          "x": 762,
          "y": 1858,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 239,
            "saturation": 100,
            "lightness": 34,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 10
          },
          "requirements": [
            {
              "critterId": "bullfrog",
              "level": 30
            }
          ]
        },
        {
          "id": "bullfrog",
          "name": "Bullfrog",
          "rarity": "common",
          "level": 15,
          "x": 943,
          "y": 524,
          "imageView": null,
          "style": {
            "textScale": 173,
            "hue": 339,
            "saturation": 82,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "frog",
              "level": 15
            }
          ]
        },
        {
          "id": "devil-frog",
          "name": "Devil Frog",
          "rarity": "extinct",
          "level": 100,
          "x": 1306,
          "y": 2618,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 0,
            "saturation": 88,
            "lightness": 40,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 9
          },
          "requirements": [
            {
              "critterId": "african-bullfrog",
              "level": 100
            },
            {
              "critterId": "fire-bellied-toad",
              "level": 25
            }
          ]
        },
        {
          "id": "diplocaulus",
          "name": "Diplocaulus",
          "rarity": "extinct",
          "level": 25,
          "x": 218,
          "y": 2524,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 246,
            "saturation": 40,
            "lightness": 40,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "great-crested-newt",
              "level": 25
            },
            {
              "critterId": "axolotl",
              "level": 25
            }
          ]
        },
        {
          "id": "fire-bellied-toad",
          "name": "Fire-bellied Toad",
          "rarity": "uncommon",
          "level": 10,
          "x": 1487,
          "y": 1378,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 360,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 10
          },
          "requirements": [
            {
              "critterId": "toad",
              "level": 10
            }
          ]
        },
        {
          "id": "frog-prince",
          "name": "Frog Prince",
          "rarity": "mythical",
          "level": 25,
          "x": 1487,
          "y": 3378,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 285,
            "saturation": 88,
            "lightness": 64,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "jin-chan",
              "level": 25
            }
          ]
        },
        {
          "id": "gastric-brooder",
          "name": "Gastric Brooder",
          "rarity": "extinct",
          "level": 25,
          "x": 762,
          "y": 2524,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 84,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "surinam-toad",
              "level": 25
            },
            {
              "critterId": "poison-dart-frog",
              "level": 25
            }
          ]
        },
        {
          "id": "glass-frog",
          "name": "Glass Frog",
          "rarity": "uncommon",
          "level": 15,
          "x": 762,
          "y": 911,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 145,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 5
          },
          "requirements": [
            {
              "critterId": "frog",
              "level": 15
            }
          ]
        },
        {
          "id": "golden-toad",
          "name": "Golden Toad",
          "rarity": "extinct",
          "level": 100,
          "x": 1487,
          "y": 2991,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 48,
            "saturation": 100,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "toad",
              "level": 100
            }
          ]
        },
        {
          "id": "great-crested-newt",
          "name": "Great Crested Newt",
          "rarity": "rare",
          "level": 30,
          "x": 37,
          "y": 1764,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 20,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "newt",
              "level": 30
            },
            {
              "critterId": "rough-skinned-newt",
              "level": 10
            }
          ]
        },
        {
          "id": "jin-chan",
          "name": "Jin Chan",
          "rarity": "mythical",
          "level": 100,
          "x": 1306,
          "y": 3191,
          "imageView": null,
          "style": {
            "textScale": 103,
            "hue": 41,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "golden-toad",
              "level": 100
            }
          ]
        },
        {
          "id": "koric",
          "name": "Koric",
          "rarity": "mythical",
          "level": 100,
          "x": 37,
          "y": 3191,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 339,
            "saturation": 82,
            "lightness": 36,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 9
          },
          "requirements": [
            {
              "critterId": "salamander",
              "level": 100
            },
            {
              "critterId": "great-crested-newt",
              "level": 50
            },
            {
              "critterId": "diplocaulus",
              "level": 25
            }
          ]
        },
        {
          "id": "loveland-frogman",
          "name": "Loveland Frogman",
          "rarity": "mythical",
          "level": 20,
          "x": 399,
          "y": 3378,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 312,
            "saturation": 100,
            "lightness": 65,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "gastric-brooder",
              "level": 15
            },
            {
              "critterId": "devil-frog",
              "level": 20
            }
          ]
        },
        {
          "id": "newt",
          "name": "Newt",
          "rarity": "common",
          "level": 15,
          "x": 218,
          "y": 618,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 22,
            "saturation": 100,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "salamander",
              "level": 15
            }
          ]
        },
        {
          "id": "poison-dart-frog",
          "name": "Poison Dart Frog",
          "rarity": "rare",
          "level": 15,
          "x": 581,
          "y": 1671,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 284,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "rough-skinned-newt",
              "level": 15
            },
            {
              "critterId": "glass-frog",
              "level": 10
            }
          ]
        },
        {
          "id": "rough-skinned-newt",
          "name": "Rough Skinned Newt",
          "rarity": "uncommon",
          "level": 20,
          "x": 37,
          "y": 1098,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 263,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 10
          },
          "requirements": [
            {
              "critterId": "newt",
              "level": 20
            }
          ]
        },
        {
          "id": "salamander",
          "name": "Salamander",
          "rarity": "common",
          "level": 5,
          "x": 581,
          "y": 431,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 131,
            "hue": 226,
            "saturation": 88,
            "lightness": 52,
            "glow": true,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "frog",
              "level": 5
            }
          ]
        },
        {
          "id": "slender-salamander",
          "name": "Slender Salamander",
          "rarity": "uncommon",
          "level": 20,
          "x": 399,
          "y": 1004,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 231,
            "saturation": 37,
            "lightness": 45,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "salamander",
              "level": 20
            }
          ]
        },
        {
          "id": "surinam-toad",
          "name": "Surinam Toad",
          "rarity": "rare",
          "level": 25,
          "x": 1125,
          "y": 2138,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 360,
            "saturation": 69,
            "lightness": 74,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "toad",
              "level": 25
            }
          ]
        },
        {
          "id": "toad",
          "name": "Toad",
          "rarity": "common",
          "level": 5,
          "x": 1306,
          "y": 711,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 59,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "bullfrog",
              "level": 5
            }
          ]
        }
      ],
      "lines": []
    },
    "mammals": {
      "label": "Mammals",
      "critters": [
        {
          "id": "mouse",
          "name": "Mouse",
          "rarity": "common",
          "level": 0,
          "x": 762,
          "y": 151,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 168,
            "saturation": 28,
            "lightness": 84,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 1
          },
          "requirements": []
        },
        {
          "id": "badger",
          "name": "Badger",
          "rarity": "rare",
          "level": 15,
          "x": 1125,
          "y": 1951,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 243,
            "saturation": 88,
            "lightness": 67,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "ferret",
              "level": 15
            }
          ]
        },
        {
          "id": "bandicoot",
          "name": "Bandicoot",
          "rarity": "rare",
          "level": 10,
          "x": 581,
          "y": 1858,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 12,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "koala",
              "level": 10
            }
          ]
        },
        {
          "id": "bat",
          "name": "Bat",
          "rarity": "common",
          "level": 10,
          "x": 399,
          "y": 618,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 274,
            "saturation": 10,
            "lightness": 18,
            "glow": false,
            "inputHue": 310,
            "inputSaturation": 36,
            "inputLightness": 38,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "flying-squirrel",
              "level": 10
            },
            {
              "critterId": "sugar-glider",
              "level": 5
            }
          ]
        },
        {
          "id": "chipmunk",
          "name": "Chipmunk",
          "rarity": "common",
          "level": 5,
          "x": 218,
          "y": 431,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 36,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "mouse",
              "level": 5
            }
          ]
        },
        {
          "id": "ferret",
          "name": "Ferret",
          "rarity": "rare",
          "level": 15,
          "x": 1306,
          "y": 1671,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 34,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "weasel",
              "level": 15
            }
          ]
        },
        {
          "id": "finger-monkey",
          "name": "Finger Monkey",
          "rarity": "rare",
          "level": 15,
          "x": 218,
          "y": 1671,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 0,
            "saturation": 88,
            "lightness": 39,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "sugar-glider",
              "level": 15
            }
          ]
        },
        {
          "id": "flying-squirrel",
          "name": "Flying Squirrel",
          "rarity": "uncommon",
          "level": 25,
          "x": 762,
          "y": 1098,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 44,
            "saturation": 88,
            "lightness": 60,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "squirrel",
              "level": 25
            }
          ]
        },
        {
          "id": "gopher",
          "name": "Gopher",
          "rarity": "common",
          "level": 5,
          "x": 1487,
          "y": 711,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 43,
            "saturation": 88,
            "lightness": 33,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "vole",
              "level": 5
            }
          ]
        },
        {
          "id": "hedgehog",
          "name": "Hedgehog",
          "rarity": "common",
          "level": 15,
          "x": 943,
          "y": 524,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 179,
            "saturation": 73,
            "lightness": 81,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 5
          },
          "requirements": [
            {
              "critterId": "mouse",
              "level": 15
            },
            {
              "critterId": "vole",
              "level": 10
            }
          ]
        },
        {
          "id": "koala",
          "name": "Koala",
          "rarity": "rare",
          "level": 10,
          "x": 762,
          "y": 1671,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 291,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 5
          },
          "requirements": [
            {
              "critterId": "opossum",
              "level": 10
            }
          ]
        },
        {
          "id": "mole",
          "name": "Mole",
          "rarity": "uncommon",
          "level": 25,
          "x": 1306,
          "y": 1191,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 217,
            "saturation": 100,
            "lightness": 54,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "vole",
              "level": 25
            },
            {
              "critterId": "gopher",
              "level": 5
            }
          ]
        },
        {
          "id": "opossum",
          "name": "Opossum",
          "rarity": "uncommon",
          "level": 10,
          "x": 943,
          "y": 1284,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 23,
            "saturation": 88,
            "lightness": 77,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "rabbit",
              "level": 10
            }
          ]
        },
        {
          "id": "porcupine",
          "name": "Porcupine",
          "rarity": "common",
          "level": 15,
          "x": 1125,
          "y": 711,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 145,
            "saturation": 22,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 9
          },
          "requirements": [
            {
              "critterId": "hedgehog",
              "level": 15
            }
          ]
        },
        {
          "id": "prairie-dog",
          "name": "Prairie Dog",
          "rarity": "rare",
          "level": 15,
          "x": 1487,
          "y": 1858,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 54,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "mole",
              "level": 15
            }
          ]
        },
        {
          "id": "rabbit",
          "name": "Rabbit",
          "rarity": "common",
          "level": 10,
          "x": 762,
          "y": 618,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 292,
            "saturation": 88,
            "lightness": 77,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "mouse",
              "level": 10
            }
          ]
        },
        {
          "id": "squirrel",
          "name": "Squirrel",
          "rarity": "common",
          "level": 5,
          "x": 581,
          "y": 431,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 11,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "mouse",
              "level": 5
            }
          ]
        },
        {
          "id": "sugar-glider",
          "name": "Sugar Glider",
          "rarity": "uncommon",
          "level": 15,
          "x": 37,
          "y": 1378,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 197,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "flying-squirrel",
              "level": 10
            },
            {
              "critterId": "chipmunk",
              "level": 15
            }
          ]
        },
        {
          "id": "vole",
          "name": "Vole",
          "rarity": "common",
          "level": 15,
          "x": 1125,
          "y": 338,
          "imageView": {
            "position": {
              "x": 2.5728,
              "y": 1.7152,
              "z": 5.7174
            },
            "target": {
              "x": 0,
              "y": 0,
              "z": 0
            }
          },
          "style": {
            "textScale": 100,
            "hue": 281,
            "saturation": 90,
            "lightness": 33,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "mouse",
              "level": 15
            }
          ]
        },
        {
          "id": "wallaby",
          "name": "Wallaby",
          "rarity": "rare",
          "level": 15,
          "x": 943,
          "y": 2231,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 170,
            "saturation": 85,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "koala",
              "level": 15
            },
            {
              "critterId": "bandicoot",
              "level": 15
            }
          ]
        },
        {
          "id": "weasel",
          "name": "Weasel",
          "rarity": "uncommon",
          "level": 5,
          "x": 1125,
          "y": 1004,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 67,
            "saturation": 88,
            "lightness": 52,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "rabbit",
              "level": 5
            }
          ]
        }
      ],
      "lines": []
    },
    "birds": {
      "label": "Birds",
      "critters": [
        {
          "id": "african-finfoot",
          "name": "African Finfoot",
          "rarity": "rare",
          "level": 0,
          "x": 37,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "aplomado-falcon",
          "name": "Aplomado Falcon",
          "rarity": "uncommon",
          "level": 0,
          "x": 37,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "bat-falcon",
          "name": "Bat Falcon",
          "rarity": "uncommon",
          "level": 0,
          "x": 37,
          "y": 1098,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "black-and-yellow-broadbill",
          "name": "Black-and-Yellow Broadbill",
          "rarity": "rare",
          "level": 0,
          "x": 218,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "black-naped-monarch",
          "name": "Black-naped Monarch",
          "rarity": "uncommon",
          "level": 0,
          "x": 218,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "capuchinbird",
          "name": "Capuchinbird",
          "rarity": "rare",
          "level": 0,
          "x": 399,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "cardinal",
          "name": "Cardinal",
          "rarity": "common",
          "level": 0,
          "x": 37,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "chicken",
          "name": "Chicken",
          "rarity": "common",
          "level": 0,
          "x": 37,
          "y": 338,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "cuckoo",
          "name": "Cuckoo",
          "rarity": "common",
          "level": 0,
          "x": 218,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "dodo",
          "name": "Dodo",
          "rarity": "extinct",
          "level": 0,
          "x": 37,
          "y": 2711,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "dove",
          "name": "Dove",
          "rarity": "common",
          "level": 0,
          "x": 218,
          "y": 338,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "fairy-penguin",
          "name": "Fairy Penguin",
          "rarity": "uncommon",
          "level": 0,
          "x": 218,
          "y": 1098,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "finch",
          "name": "Finch",
          "rarity": "common",
          "level": 0,
          "x": 399,
          "y": 151,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "fiordland-penguin",
          "name": "Fiordland Penguin",
          "rarity": "rare",
          "level": 0,
          "x": 581,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "golden-dove",
          "name": "Golden Dove",
          "rarity": "rare",
          "level": 0,
          "x": 762,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "great-potoo",
          "name": "Great Potoo",
          "rarity": "rare",
          "level": 0,
          "x": 943,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "hummingbird",
          "name": "Hummingbird",
          "rarity": "uncommon",
          "level": 0,
          "x": 399,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "iiwi",
          "name": "I'iwi",
          "rarity": "rare",
          "level": 0,
          "x": 1125,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "japanese-sparrowhawk",
          "name": "Japanese Sparrowhawk",
          "rarity": "uncommon",
          "level": 0,
          "x": 581,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "jungle-fowl",
          "name": "Jungle Fowl",
          "rarity": "common",
          "level": 0,
          "x": 581,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "king-quail",
          "name": "King Quail",
          "rarity": "common",
          "level": 0,
          "x": 581,
          "y": 338,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "kiwi",
          "name": "Kiwi",
          "rarity": "uncommon",
          "level": 0,
          "x": 581,
          "y": 1098,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "laughing-owl",
          "name": "Laughing Owl",
          "rarity": "extinct",
          "level": 0,
          "x": 1487,
          "y": 2711,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "little-owl",
          "name": "Little Owl",
          "rarity": "uncommon",
          "level": 0,
          "x": 762,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "long-tailed-tit",
          "name": "Long-tailed Tit",
          "rarity": "common",
          "level": 0,
          "x": 762,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "oriental-scops-owl",
          "name": "Oriental Scops Owl",
          "rarity": "uncommon",
          "level": 0,
          "x": 762,
          "y": 1098,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "parakeet",
          "name": "Parakeet",
          "rarity": "common",
          "level": 0,
          "x": 943,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "parrot",
          "name": "Parrot",
          "rarity": "uncommon",
          "level": 0,
          "x": 943,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "pennant-winged-nightjar",
          "name": "Pennant-winged Nightjar",
          "rarity": "rare",
          "level": 0,
          "x": 1306,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "phoenix",
          "name": "Phoenix",
          "rarity": "mythical",
          "level": 0,
          "x": 37,
          "y": 3471,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "puffin",
          "name": "Puffin",
          "rarity": "uncommon",
          "level": 0,
          "x": 1125,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "pygmy-cupwing",
          "name": "Pygmy Cupwing",
          "rarity": "uncommon",
          "level": 0,
          "x": 1125,
          "y": 1098,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "pygmy-falcon",
          "name": "Pygmy Falcon",
          "rarity": "uncommon",
          "level": 0,
          "x": 1306,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "resplendent-quetzal",
          "name": "Resplendent Quetzal",
          "rarity": "legendary",
          "level": 0,
          "x": 943,
          "y": 338,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "roadrunner",
          "name": "Roadrunner",
          "rarity": "uncommon",
          "level": 0,
          "x": 1306,
          "y": 1098,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "rock-kestrel",
          "name": "Rock Kestrel",
          "rarity": "common",
          "level": 0,
          "x": 1125,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "simurgh",
          "name": "Simurgh",
          "rarity": "mythical",
          "level": 0,
          "x": 1487,
          "y": 3471,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "snowy-plover",
          "name": "Snowy Plover",
          "rarity": "common",
          "level": 0,
          "x": 1306,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "sparrow",
          "name": "Sparrow",
          "rarity": "common",
          "level": 0,
          "x": 943,
          "y": 151,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "spoonbilled-sandpiper",
          "name": "Spoonbilled Sandpiper",
          "rarity": "rare",
          "level": 0,
          "x": 1487,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "tawny-frogmouth",
          "name": "Tawny Frogmouth",
          "rarity": "uncommon",
          "level": 0,
          "x": 1487,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "wilsons-bird-of-paradise",
          "name": "Wilson's Bird-of-Paradise",
          "rarity": "legendary",
          "level": 0,
          "x": 1487,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        }
      ],
      "lines": []
    },
    "anthropods": {
      "label": "Anthropods",
      "critters": [
        {
          "id": "anansi",
          "name": "Anansi",
          "rarity": "mythical",
          "level": 0,
          "x": 37,
          "y": 3471,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "asian-giant-hornet",
          "name": "Asian Giant Hornet",
          "rarity": "rare",
          "level": 0,
          "x": 37,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "atlas-moth",
          "name": "Atlas Moth",
          "rarity": "rare",
          "level": 0,
          "x": 37,
          "y": 1858,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "black-widow",
          "name": "Black Widow",
          "rarity": "rare",
          "level": 0,
          "x": 218,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "ceratomyrmex",
          "name": "Ceratomyrmex",
          "rarity": "extinct",
          "level": 0,
          "x": 37,
          "y": 2711,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "chimerarachne",
          "name": "Chimerarachne",
          "rarity": "extinct",
          "level": 0,
          "x": 399,
          "y": 2711,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "cockroach",
          "name": "Cockroach",
          "rarity": "common",
          "level": 0,
          "x": 37,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "damselfly",
          "name": "Damselfly",
          "rarity": "common",
          "level": 0,
          "x": 399,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "dragonfly",
          "name": "Dragonfly",
          "rarity": "common",
          "level": 0,
          "x": 581,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "emperor-dragonfly",
          "name": "Emperor Dragonfly",
          "rarity": "uncommon",
          "level": 0,
          "x": 37,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "emperor-scorpion",
          "name": "Emperor Scorpion",
          "rarity": "rare",
          "level": 0,
          "x": 399,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "giant-centipede",
          "name": "Giant Centipede",
          "rarity": "uncommon",
          "level": 0,
          "x": 218,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "giant-water-bug",
          "name": "Giant Water Bug",
          "rarity": "uncommon",
          "level": 0,
          "x": 399,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "giant-weta",
          "name": "Giant Weta",
          "rarity": "rare",
          "level": 0,
          "x": 581,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "beetle",
          "name": "Goliath Beetle",
          "rarity": "rare",
          "level": 0,
          "x": 399,
          "y": 1671,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "happy-face-spider",
          "name": "Happy Face Spider",
          "rarity": "rare",
          "level": 0,
          "x": 762,
          "y": 1858,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "hercules-beetle",
          "name": "Hercules Beetle",
          "rarity": "rare",
          "level": 0,
          "x": 943,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "hibbertopterus",
          "name": "Hibbertopterus",
          "rarity": "extinct",
          "level": 0,
          "x": 581,
          "y": 2711,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "khepri",
          "name": "Khepri",
          "rarity": "mythical",
          "level": 0,
          "x": 1487,
          "y": 3471,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "mazothairos",
          "name": "Mazothairos",
          "rarity": "extinct",
          "level": 0,
          "x": 943,
          "y": 2711,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "meganeuropsis",
          "name": "Meganeuropsis",
          "rarity": "extinct",
          "level": 0,
          "x": 1125,
          "y": 2711,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "mydas-fly",
          "name": "Mydas Fly",
          "rarity": "uncommon",
          "level": 0,
          "x": 581,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "portia",
          "name": "Portia",
          "rarity": "rare",
          "level": 0,
          "x": 1125,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "mantis",
          "name": "Praying Mantis",
          "rarity": "uncommon",
          "level": 0,
          "x": 943,
          "y": 911,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "pulmonoscorpius",
          "name": "Pulmonoscorpius",
          "rarity": "extinct",
          "level": 0,
          "x": 1487,
          "y": 2711,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "queen-alexandras-birdwing",
          "name": "Queen Alexandra's Birdwing",
          "rarity": "legendary",
          "level": 0,
          "x": 943,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "scorpion",
          "name": "Scorpion",
          "rarity": "common",
          "level": 0,
          "x": 1125,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "silkworm-moth",
          "name": "Silkworm Moth",
          "rarity": "common",
          "level": 0,
          "x": 1487,
          "y": 431,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "stick-insect",
          "name": "Stick Insect",
          "rarity": "uncommon",
          "level": 0,
          "x": 1125,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "tarantula-hawk",
          "name": "Tarantula Hawk",
          "rarity": "rare",
          "level": 0,
          "x": 1306,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "titan-beetle",
          "name": "Titan Beetle",
          "rarity": "rare",
          "level": 0,
          "x": 1487,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "tropidacris-grasshopper",
          "name": "Tropidacris Grasshopper",
          "rarity": "uncommon",
          "level": 0,
          "x": 1306,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "wolf-spider",
          "name": "Wolf Spider",
          "rarity": "uncommon",
          "level": 0,
          "x": 1487,
          "y": 1191,
          "imageView": null,
          "style": null,
          "requirements": []
        }
      ],
      "lines": []
    }
  }
};
