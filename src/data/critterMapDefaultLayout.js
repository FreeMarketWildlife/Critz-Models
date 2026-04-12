export const critterMapDefaultLayout = {
  "generatedAt": "2026-04-12T06:24:38.643Z",
  "board": {
    "width": 2390,
    "height": 4073.4285714285716,
    "nodeWidth": 176,
    "nodeHeight": 84,
    "gridColumnsPerRarity": 9,
    "gridRowsPerRarity": 7
  },
  "categories": {
    "reptiles": {
      "label": "Reptiles",
      "lanes": {
        "common": {
          "rows": 9,
          "columns": 9
        },
        "uncommon": {
          "rows": 6,
          "columns": 11
        },
        "rare": {
          "rows": 6,
          "columns": 11
        },
        "extinct": {
          "rows": 5,
          "columns": 9
        },
        "mythical": {
          "rows": 5,
          "columns": 9
        }
      },
      "critters": [
        {
          "id": "lizard",
          "name": "Lizard",
          "rarity": "common",
          "phase": 1,
          "level": 0,
          "x": 1107,
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
          "id": "african-dwarf-mud-turtle",
          "name": "African Dwarf Mud Turtle",
          "rarity": "rare",
          "phase": 3,
          "level": 15,
          "x": 200,
          "y": 1858,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 29,
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
              "critterId": "stinkpot",
              "level": 15
            }
          ]
        },
        {
          "id": "african-sideneck-turtle",
          "name": "African Sideneck Turtle",
          "rarity": "uncommon",
          "phase": 2,
          "level": 5,
          "x": 200,
          "y": 1378,
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
            "hue": 325,
            "saturation": 90,
            "lightness": 67,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 5
          },
          "requirements": [
            {
              "critterId": "red-eared-slider",
              "level": 5
            }
          ]
        },
        {
          "id": "anole",
          "name": "Anole",
          "rarity": "common",
          "phase": 1,
          "level": 10,
          "x": 1288,
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
          "phase": 2,
          "level": 20,
          "x": 1470,
          "y": 1471,
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
              "critterId": "anole",
              "level": 20
            }
          ]
        },
        {
          "id": "bearded-dragon",
          "name": "Bearded Dragon",
          "rarity": "rare",
          "phase": 2,
          "level": 10,
          "x": 1651,
          "y": 2138,
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
              "critterId": "trioceros",
              "level": 10
            },
            {
              "critterId": "leachs-giant-gecko",
              "level": 5
            }
          ]
        },
        {
          "id": "chameleon",
          "name": "Chameleon",
          "rarity": "uncommon",
          "phase": 2,
          "level": 10,
          "x": 1651,
          "y": 1565,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 167,
            "saturation": 82,
            "lightness": 48,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "gecko",
              "level": 10
            }
          ]
        },
        {
          "id": "crested-gecko",
          "name": "Crested Gecko",
          "rarity": "uncommon",
          "phase": 2,
          "level": 20,
          "x": 1832,
          "y": 1098,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 71,
            "saturation": 88,
            "lightness": 63,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "gecko",
              "level": 20
            },
            {
              "critterId": "tokay-gecko",
              "level": 10
            }
          ]
        },
        {
          "id": "diamondback-terrapin",
          "name": "Diamondback Terrapin",
          "rarity": "rare",
          "phase": 2,
          "level": 100,
          "x": 926,
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
            "hue": 64,
            "saturation": 94,
            "lightness": 49,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "turtle",
              "level": 100
            }
          ]
        },
        {
          "id": "draco",
          "name": "Draco",
          "rarity": "rare",
          "phase": 2,
          "level": 15,
          "x": 1832,
          "y": 2231,
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
            "hue": 256,
            "saturation": 56,
            "lightness": 48,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "lance-nosed-chameleon",
              "level": 15
            },
            {
              "critterId": "leachs-giant-gecko",
              "level": 10
            }
          ]
        },
        {
          "id": "dragon",
          "name": "Dragon",
          "rarity": "mythical",
          "phase": 2,
          "level": 50,
          "x": 1651,
          "y": 3003,
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
            },
            {
              "critterId": "pterosaur",
              "level": 25
            }
          ]
        },
        {
          "id": "eastern-mud-turtle",
          "name": "Eastern Mud Turtle",
          "rarity": "uncommon",
          "phase": 2,
          "level": 15,
          "x": 1107,
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
            "textScale": 100,
            "hue": 24,
            "saturation": 54,
            "lightness": 39,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "painted-turtle",
              "level": 15
            }
          ]
        },
        {
          "id": "eunotosaurus",
          "name": "Eunotosaurus",
          "rarity": "extinct",
          "phase": 3,
          "level": 50,
          "x": 382,
          "y": 2430,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 99,
            "saturation": 86,
            "lightness": 33,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "pigsnouted-turtle",
              "level": 50
            },
            {
              "critterId": "african-dwarf-mud-turtle",
              "level": 25
            }
          ]
        },
        {
          "id": "frog-eyed-gecko",
          "name": "Frog-Eyed Gecko",
          "rarity": "rare",
          "phase": 2,
          "level": 15,
          "x": 1832,
          "y": 1762,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 302,
            "saturation": 84,
            "lightness": 66,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "crested-gecko",
              "level": 15
            }
          ]
        },
        {
          "id": "gecko",
          "name": "Gecko",
          "rarity": "common",
          "phase": 1,
          "level": 15,
          "x": 1651,
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
          "phase": 3,
          "level": 50,
          "x": 563,
          "y": 3003,
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
              "critterId": "eunotosaurus",
              "level": 30
            },
            {
              "critterId": "pigsnouted-turtle",
              "level": 50
            }
          ]
        },
        {
          "id": "lance-nosed-chameleon",
          "name": "Lance-Nosed Chameleon",
          "rarity": "rare",
          "phase": 2,
          "level": 15,
          "x": 1470,
          "y": 1764,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 103,
            "saturation": 82,
            "lightness": 46,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "chameleon",
              "level": 15
            }
          ]
        },
        {
          "id": "leachs-giant-gecko",
          "name": "Leach's Giant Gecko",
          "rarity": "rare",
          "phase": 2,
          "level": 15,
          "x": 2014,
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
            "hue": 198,
            "saturation": 82,
            "lightness": 63,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "frog-eyed-gecko",
              "level": 15
            }
          ]
        },
        {
          "id": "legless-lizard",
          "name": "Legless Lizard",
          "rarity": "rare",
          "phase": 4,
          "level": 50,
          "x": 1288,
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
            "hue": 217,
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
              "critterId": "lizard",
              "level": 50
            }
          ]
        },
        {
          "id": "painted-turtle",
          "name": "Painted Turtle",
          "rarity": "common",
          "phase": 2,
          "level": 10,
          "x": 926,
          "y": 898,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 273,
            "saturation": 91,
            "lightness": 75,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "red-eared-slider",
              "level": 10
            }
          ]
        },
        {
          "id": "pancake-tortoise",
          "name": "Pancake Tortoise",
          "rarity": "uncommon",
          "phase": 3,
          "level": 15,
          "x": 200,
          "y": 1096,
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
          "id": "pappochelys",
          "name": "Pappochelys",
          "rarity": "extinct",
          "phase": 3,
          "level": 25,
          "x": 563,
          "y": 2617,
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
            "hue": 253,
            "saturation": 88,
            "lightness": 63,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 5
          },
          "requirements": [
            {
              "critterId": "eunotosaurus",
              "level": 25
            },
            {
              "critterId": "snakeneck-turtle",
              "level": 25
            }
          ]
        },
        {
          "id": "pigsnouted-turtle",
          "name": "Pigsnouted Turtle",
          "rarity": "rare",
          "phase": 2,
          "level": 15,
          "x": 926,
          "y": 2138,
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
              "critterId": "softshell-turtle",
              "level": 15
            }
          ]
        },
        {
          "id": "pterosaur",
          "name": "Pterosaur",
          "rarity": "extinct",
          "phase": 2,
          "level": 30,
          "x": 1832,
          "y": 2711,
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
          "id": "red-eared-slider",
          "name": "Red-Eared Slider",
          "rarity": "common",
          "phase": 2,
          "level": 5,
          "x": 926,
          "y": 524,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 351,
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
              "level": 5
            }
          ]
        },
        {
          "id": "snakeneck-turtle",
          "name": "Snakeneck Turtle",
          "rarity": "rare",
          "phase": 2,
          "level": 15,
          "x": 382,
          "y": 2044,
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
              "critterId": "snapping-turtle",
              "level": 15
            },
            {
              "critterId": "african-sideneck-turtle",
              "level": 10
            }
          ]
        },
        {
          "id": "snapping-turtle",
          "name": "Snapping Turtle",
          "rarity": "uncommon",
          "phase": 2,
          "level": 15,
          "x": 563,
          "y": 1378,
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
              "critterId": "turtle",
              "level": 15
            }
          ]
        },
        {
          "id": "softshell-turtle",
          "name": "Softshell Turtle",
          "rarity": "rare",
          "phase": 2,
          "level": 15,
          "x": 744,
          "y": 1762,
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
            "hue": 162,
            "saturation": 92,
            "lightness": 35,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "eastern-mud-turtle",
              "level": 15
            },
            {
              "critterId": "stinkpot",
              "level": 5
            }
          ]
        },
        {
          "id": "stinkpot",
          "name": "Stinkpot",
          "rarity": "uncommon",
          "phase": 2,
          "level": 10,
          "x": 382,
          "y": 1565,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 195,
            "saturation": 88,
            "lightness": 64,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "african-sideneck-turtle",
              "level": 10
            },
            {
              "critterId": "painted-turtle",
              "level": 10
            }
          ]
        },
        {
          "id": "tokay-gecko",
          "name": "Tokay Gecko",
          "rarity": "common",
          "phase": 2,
          "level": 15,
          "x": 1832,
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
            "hue": 280,
            "saturation": 85,
            "lightness": 64,
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
            }
          ]
        },
        {
          "id": "tortoise",
          "name": "Tortoise",
          "rarity": "common",
          "phase": 1,
          "level": 10,
          "x": 563,
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
          "id": "trioceros",
          "name": "Trioceros",
          "rarity": "rare",
          "phase": 2,
          "level": 15,
          "x": 1288,
          "y": 2138,
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
            "saturation": 100,
            "lightness": 70,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "lance-nosed-chameleon",
              "level": 15
            }
          ]
        },
        {
          "id": "turtle",
          "name": "Turtle",
          "rarity": "common",
          "phase": 1,
          "level": 5,
          "x": 926,
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
          "phase": 2,
          "level": 30,
          "x": 1107,
          "y": 2430,
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
          "phase": 3,
          "level": 100,
          "x": 1107,
          "y": 3377,
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
      "lanes": {
        "common": {
          "rows": 7,
          "columns": 9
        },
        "uncommon": {
          "rows": 5,
          "columns": 11
        },
        "rare": {
          "rows": 5,
          "columns": 9
        },
        "extinct": {
          "rows": 5,
          "columns": 9
        },
        "mythical": {
          "rows": 5,
          "columns": 9
        }
      },
      "critters": [
        {
          "id": "frog",
          "name": "Frog",
          "rarity": "common",
          "phase": 1,
          "level": 0,
          "x": 1107,
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
          "phase": 2,
          "level": 20,
          "x": 1470,
          "y": 911,
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
          "phase": 2,
          "level": 30,
          "x": 744,
          "y": 1484,
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
          "phase": 2,
          "level": 30,
          "x": 1107,
          "y": 1577,
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
            "hue": 239,
            "saturation": 100,
            "lightness": 61,
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
          "phase": 1,
          "level": 15,
          "x": 1470,
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
          "phase": 3,
          "level": 100,
          "x": 1651,
          "y": 2152,
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
          "phase": 2,
          "level": 25,
          "x": 744,
          "y": 2245,
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
            "hue": 248,
            "saturation": 40,
            "lightness": 53,
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
          "phase": 2,
          "level": 10,
          "x": 1832,
          "y": 1098,
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
          "phase": 2,
          "level": 25,
          "x": 1832,
          "y": 2820,
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
          "phase": 2,
          "level": 25,
          "x": 1107,
          "y": 2152,
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
          "phase": 2,
          "level": 15,
          "x": 1107,
          "y": 911,
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
          "phase": 2,
          "level": 100,
          "x": 1832,
          "y": 2338,
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
          "phase": 3,
          "level": 30,
          "x": 382,
          "y": 1764,
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
          "phase": 2,
          "level": 100,
          "x": 1651,
          "y": 2633,
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
          "phase": 3,
          "level": 50,
          "x": 563,
          "y": 2632,
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
          "phase": 3,
          "level": 20,
          "x": 1288,
          "y": 2725,
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
          "phase": "unassigned",
          "level": 15,
          "x": 563,
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
          "phase": 2,
          "level": 15,
          "x": 926,
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
          "phase": 3,
          "level": 20,
          "x": 200,
          "y": 1191,
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
          "phase": 1,
          "level": 5,
          "x": 744,
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
          "phase": 2,
          "level": 20,
          "x": 563,
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
          "phase": 2,
          "level": 25,
          "x": 1288,
          "y": 1764,
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
          "phase": 1,
          "level": 5,
          "x": 1651,
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
      "lanes": {
        "common": {
          "rows": 8,
          "columns": 11
        },
        "uncommon": {
          "rows": 7,
          "columns": 9
        },
        "rare": {
          "rows": 7,
          "columns": 11
        },
        "extinct": {
          "rows": 7,
          "columns": 9
        },
        "mythical": {
          "rows": 7,
          "columns": 9
        }
      },
      "critters": [
        {
          "id": "mouse",
          "name": "Mouse",
          "rarity": "common",
          "phase": 1,
          "level": 0,
          "x": 1107,
          "y": 151,
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
          "id": "armadillo",
          "name": "Armadillo",
          "rarity": "uncommon",
          "phase": 2,
          "level": 20,
          "x": 1288,
          "y": 1564,
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
            "hue": 228,
            "saturation": 71,
            "lightness": 66,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "mole",
              "level": 20
            }
          ]
        },
        {
          "id": "badger",
          "name": "Badger",
          "rarity": "rare",
          "phase": 4,
          "level": 15,
          "x": 744,
          "y": 2325,
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
          "phase": 3,
          "level": 10,
          "x": 926,
          "y": 2044,
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
          "rarity": "uncommon",
          "phase": 2,
          "level": 10,
          "x": 382,
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
            "textScale": 100,
            "hue": 144,
            "saturation": 19,
            "lightness": 62,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
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
          "phase": 1,
          "level": 5,
          "x": 382,
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
          "id": "colugo",
          "name": "Colugo",
          "rarity": "rare",
          "phase": 2,
          "level": 20,
          "x": 382,
          "y": 1764,
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
            "hue": 187,
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
              "level": 20
            }
          ]
        },
        {
          "id": "elephant-shrew",
          "name": "Elephant Shrew",
          "rarity": "rare",
          "phase": 3,
          "level": 20,
          "x": 1470,
          "y": 2325,
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
            "hue": 86,
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
              "level": 20
            }
          ]
        },
        {
          "id": "eomaia",
          "name": "Eomaia",
          "rarity": "extinct",
          "phase": 4,
          "level": 30,
          "x": 926,
          "y": 2991,
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
            "hue": 253,
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
              "level": 30
            }
          ]
        },
        {
          "id": "ferret",
          "name": "Ferret",
          "rarity": "rare",
          "phase": 3,
          "level": 15,
          "x": 563,
          "y": 2044,
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
          "phase": 3,
          "level": 15,
          "x": 382,
          "y": 2231,
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
          "phase": 2,
          "level": 25,
          "x": 563,
          "y": 1004,
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
          "id": "fruitafossor",
          "name": "Fruitafossor",
          "rarity": "extinct",
          "phase": 4,
          "level": 30,
          "x": 1470,
          "y": 3085,
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
            "hue": 113,
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
              "critterId": "armadillo",
              "level": 30
            }
          ]
        },
        {
          "id": "gopher",
          "name": "Gopher",
          "rarity": "common",
          "phase": 2,
          "level": 5,
          "x": 2014,
          "y": 805,
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
          "rarity": "uncommon",
          "phase": 2,
          "level": 15,
          "x": 1288,
          "y": 1004,
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
            "inputWidth": 8
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
          "id": "juramaia",
          "name": "Juramaia",
          "rarity": "extinct",
          "phase": 4,
          "level": 30,
          "x": 1288,
          "y": 2524,
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
            "hue": 233,
            "saturation": 95,
            "lightness": 66,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "squirrel",
              "level": 30
            }
          ]
        },
        {
          "id": "koala",
          "name": "Koala",
          "rarity": "rare",
          "phase": 3,
          "level": 10,
          "x": 1288,
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
            "hue": 291,
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
              "critterId": "opossum",
              "level": 10
            }
          ]
        },
        {
          "id": "lemur",
          "name": "Lemur",
          "rarity": "rare",
          "phase": 2,
          "level": 20,
          "x": 1832,
          "y": 1764,
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
            "hue": 181,
            "saturation": 100,
            "lightness": 84,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 5
          },
          "requirements": [
            {
              "critterId": "squirrel",
              "level": 20
            }
          ]
        },
        {
          "id": "megazostrodon",
          "name": "Megazostrodon",
          "rarity": "extinct",
          "phase": 3,
          "level": 50,
          "x": 1288,
          "y": 2991,
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
            "hue": 41,
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
              "critterId": "elephant-shrew",
              "level": 50
            }
          ]
        },
        {
          "id": "mole",
          "name": "Mole",
          "rarity": "uncommon",
          "phase": 2,
          "level": 25,
          "x": 1832,
          "y": 1098,
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
          "id": "mouse-lemur",
          "name": "Mouse Lemur",
          "rarity": "rare",
          "phase": 2,
          "level": 20,
          "x": 1651,
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
            "hue": 253,
            "saturation": 100,
            "lightness": 84,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "lemur",
              "level": 20
            }
          ]
        },
        {
          "id": "necrolestes",
          "name": "Necrolestes",
          "rarity": "extinct",
          "phase": 4,
          "level": 50,
          "x": 1832,
          "y": 2991,
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
            "hue": 64,
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
              "critterId": "star-nosed-mole",
              "level": 50
            }
          ]
        },
        {
          "id": "opossum",
          "name": "Opossum",
          "rarity": "uncommon",
          "phase": 2,
          "level": 10,
          "x": 1107,
          "y": 1378,
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
          "id": "pangolin",
          "name": "Pangolin",
          "rarity": "rare",
          "phase": 2,
          "level": 20,
          "x": 1470,
          "y": 1764,
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
            "hue": 256,
            "saturation": 18,
            "lightness": 55,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "armadillo",
              "level": 20
            }
          ]
        },
        {
          "id": "plesiadapis",
          "name": "Plesiadapis",
          "rarity": "extinct",
          "phase": 4,
          "level": 50,
          "x": 563,
          "y": 2524,
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
            "hue": 211,
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
              "critterId": "finger-monkey",
              "level": 50
            }
          ]
        },
        {
          "id": "porcupine",
          "name": "Porcupine",
          "rarity": "uncommon",
          "phase": 2,
          "level": 15,
          "x": 1470,
          "y": 1471,
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
          "phase": 2,
          "level": 15,
          "x": 2014,
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
          "phase": 1,
          "level": 10,
          "x": 744,
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
          "id": "rat",
          "name": "Rat",
          "rarity": "common",
          "phase": "unassigned",
          "level": 20,
          "x": 1832,
          "y": 338,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 12,
            "saturation": 68,
            "lightness": 36,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "mouse",
              "level": 20
            }
          ]
        },
        {
          "id": "spinolestes",
          "name": "Spinolestes",
          "rarity": "extinct",
          "phase": 4,
          "level": 30,
          "x": 1651,
          "y": 2898,
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
            "hue": 18,
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
              "critterId": "hedgehog",
              "level": 30
            }
          ]
        },
        {
          "id": "squirrel",
          "name": "Squirrel",
          "rarity": "common",
          "phase": 1,
          "level": 5,
          "x": 1470,
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
          "id": "star-nosed-mole",
          "name": "Star-Nosed Mole",
          "rarity": "rare",
          "phase": 2,
          "level": 25,
          "x": 2014,
          "y": 2325,
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
            "hue": 112,
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
              "level": 25
            }
          ]
        },
        {
          "id": "stylinodon",
          "name": "Stylinodon",
          "rarity": "extinct",
          "phase": 3,
          "level": 30,
          "x": 563,
          "y": 2991,
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
            "hue": 190,
            "saturation": 88,
            "lightness": 68,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "badger",
              "level": 30
            }
          ]
        },
        {
          "id": "sugar-glider",
          "name": "Sugar Glider",
          "rarity": "rare",
          "phase": 2,
          "level": 15,
          "x": 200,
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
          "phase": 2,
          "level": 15,
          "x": 1651,
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
          "phase": 3,
          "level": 15,
          "x": 1107,
          "y": 2231,
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
          "phase": 2,
          "level": 5,
          "x": 744,
          "y": 1378,
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
        },
        {
          "id": "zalambdalestes",
          "name": "Zalambdalestes",
          "rarity": "extinct",
          "phase": 4,
          "level": 50,
          "x": 1107,
          "y": 2804,
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
            "hue": 279,
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
              "critterId": "bandicoot",
              "level": 50
            }
          ]
        }
      ],
      "lines": []
    },
    "birds": {
      "label": "Birds",
      "lanes": {
        "common": {
          "rows": 5,
          "columns": 5
        },
        "uncommon": {
          "rows": 8,
          "columns": 9
        },
        "rare": {
          "rows": 7,
          "columns": 9
        },
        "extinct": {
          "rows": 7,
          "columns": 9
        },
        "mythical": {
          "rows": 7,
          "columns": 9
        }
      },
      "critters": [
        {
          "id": "finch",
          "name": "Finch",
          "rarity": "common",
          "phase": 3,
          "level": 0,
          "x": 1107,
          "y": 151,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "aplomado-falcon",
          "name": "Aplomado Falcon",
          "rarity": "uncommon",
          "phase": 4,
          "level": 10,
          "x": 1288,
          "y": 1378,
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
            "hue": 354,
            "saturation": 94,
            "lightness": 73,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 4
          },
          "requirements": [
            {
              "critterId": "little-owl",
              "level": 5
            },
            {
              "critterId": "pygmy-falcon",
              "level": 10
            }
          ]
        },
        {
          "id": "bat-falcon",
          "name": "Bat Falcon",
          "rarity": "uncommon",
          "phase": 4,
          "level": 10,
          "x": 1832,
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
            "textScale": 100,
            "hue": 242,
            "saturation": 26,
            "lightness": 27,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "pygmy-falcon",
              "level": 10
            }
          ]
        },
        {
          "id": "cardinal",
          "name": "Cardinal",
          "rarity": "common",
          "phase": 3,
          "level": 5,
          "x": 1470,
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
            "hue": 0,
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
              "critterId": "sparrow",
              "level": 5
            }
          ]
        },
        {
          "id": "chicken",
          "name": "Chicken",
          "rarity": "common",
          "phase": 4,
          "level": 10,
          "x": 1107,
          "y": 524,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 41,
            "saturation": 80,
            "lightness": 45,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 5
          },
          "requirements": [
            {
              "critterId": "jungle-fowl",
              "level": 10
            }
          ]
        },
        {
          "id": "cuckoo",
          "name": "Cuckoo",
          "rarity": "uncommon",
          "phase": 4,
          "level": 15,
          "x": 563,
          "y": 724,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 145,
            "saturation": 31,
            "lightness": 65,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "dove",
              "level": 15
            }
          ]
        },
        {
          "id": "dove",
          "name": "Dove",
          "rarity": "common",
          "phase": 3,
          "level": 5,
          "x": 926,
          "y": 431,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 146,
            "saturation": 21,
            "lightness": 62,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "finch",
              "level": 5
            }
          ]
        },
        {
          "id": "golden-dove",
          "name": "Golden Dove",
          "rarity": "uncommon",
          "phase": 5,
          "level": 50,
          "x": 563,
          "y": 1004,
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
            "hue": 64,
            "saturation": 100,
            "lightness": 49,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 4
          },
          "requirements": [
            {
              "critterId": "dove",
              "level": 50
            }
          ]
        },
        {
          "id": "hummingbird",
          "name": "Hummingbird",
          "rarity": "common",
          "phase": 3,
          "level": 30,
          "x": 744,
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
            "hue": 284,
            "saturation": 63,
            "lightness": 75,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "finch",
              "level": 30
            }
          ]
        },
        {
          "id": "iiwi",
          "name": "I'iwi",
          "rarity": "uncommon",
          "phase": 4,
          "level": 10,
          "x": 382,
          "y": 724,
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
            "hue": 7,
            "saturation": 68,
            "lightness": 57,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "hummingbird",
              "level": 10
            }
          ]
        },
        {
          "id": "jungle-fowl",
          "name": "Jungle Fowl",
          "rarity": "uncommon",
          "phase": 4,
          "level": 10,
          "x": 926,
          "y": 1098,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 328,
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
              "critterId": "puffin",
              "level": 10
            }
          ]
        },
        {
          "id": "king-quail",
          "name": "King Quail",
          "rarity": "uncommon",
          "phase": 4,
          "level": 10,
          "x": 382,
          "y": 1098,
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
            "hue": 256,
            "saturation": 60,
            "lightness": 50,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "iiwi",
              "level": 10
            }
          ]
        },
        {
          "id": "little-owl",
          "name": "Little Owl",
          "rarity": "uncommon",
          "phase": 4,
          "level": 20,
          "x": 1107,
          "y": 1004,
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
            "hue": 241,
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
              "critterId": "dove",
              "level": 20
            }
          ]
        },
        {
          "id": "parakeet",
          "name": "Parakeet",
          "rarity": "uncommon",
          "phase": 4,
          "level": 10,
          "x": 1288,
          "y": 911,
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
            "hue": 119,
            "saturation": 100,
            "lightness": 57,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 5
          },
          "requirements": [
            {
              "critterId": "cardinal",
              "level": 10
            }
          ]
        },
        {
          "id": "parrot",
          "name": "Parrot",
          "rarity": "uncommon",
          "phase": 4,
          "level": 20,
          "x": 1470,
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
            "textScale": 100,
            "hue": 58,
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
              "critterId": "parakeet",
              "level": 20
            }
          ]
        },
        {
          "id": "puffin",
          "name": "Puffin",
          "rarity": "uncommon",
          "phase": 4,
          "level": 15,
          "x": 744,
          "y": 911,
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
            "hue": 220,
            "saturation": 100,
            "lightness": 76,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 5
          },
          "requirements": [
            {
              "critterId": "cuckoo",
              "level": 15
            }
          ]
        },
        {
          "id": "pygmy-falcon",
          "name": "Pygmy Falcon",
          "rarity": "uncommon",
          "phase": 4,
          "level": 30,
          "x": 1470,
          "y": 1004,
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
            "hue": 225,
            "saturation": 74,
            "lightness": 65,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "snowy-plover",
              "level": 10
            },
            {
              "critterId": "sparrow",
              "level": 30
            }
          ]
        },
        {
          "id": "roadrunner",
          "name": "Roadrunner",
          "rarity": "uncommon",
          "phase": 4,
          "level": 15,
          "x": 1107,
          "y": 817,
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
            "hue": 21,
            "saturation": 95,
            "lightness": 53,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 7
          },
          "requirements": [
            {
              "critterId": "sparrow",
              "level": 15
            }
          ]
        },
        {
          "id": "rock-kestrel",
          "name": "Rock Kestrel",
          "rarity": "uncommon",
          "phase": 4,
          "level": 5,
          "x": 1651,
          "y": 724,
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
            "hue": 239,
            "saturation": 41,
            "lightness": 61,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 6
          },
          "requirements": [
            {
              "critterId": "cardinal",
              "level": 5
            }
          ]
        },
        {
          "id": "snowy-plover",
          "name": "Snowy Plover",
          "rarity": "uncommon",
          "phase": 4,
          "level": 10,
          "x": 1832,
          "y": 817,
          "imageView": null,
          "style": {
            "textScale": 100,
            "hue": 200,
            "saturation": 100,
            "lightness": 84,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 5
          },
          "requirements": [
            {
              "critterId": "rock-kestrel",
              "level": 10
            }
          ]
        },
        {
          "id": "sparrow",
          "name": "Sparrow",
          "rarity": "common",
          "phase": 3,
          "level": 5,
          "x": 1288,
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
            "hue": 55,
            "saturation": 42,
            "lightness": 58,
            "glow": false,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 5
          },
          "requirements": [
            {
              "critterId": "finch",
              "level": 5
            }
          ]
        },
        {
          "id": "african-finfoot",
          "name": "African Finfoot",
          "rarity": "uncommon",
          "phase": 5,
          "level": 0,
          "x": 382,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "black-and-yellow-broadbill",
          "name": "Black-and-Yellow Broadbill",
          "rarity": "rare",
          "phase": 4,
          "level": 0,
          "x": 382,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "black-naped-monarch",
          "name": "Black-naped Monarch",
          "rarity": "rare",
          "phase": 4,
          "level": 0,
          "x": 382,
          "y": 1765,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "capuchinbird",
          "name": "Capuchinbird",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 563,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "dodo",
          "name": "Dodo",
          "rarity": "extinct",
          "phase": 4,
          "level": 0,
          "x": 382,
          "y": 2618,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "fairy-penguin",
          "name": "Fairy Penguin",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 563,
          "y": 1765,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "fiordland-penguin",
          "name": "Fiordland Penguin",
          "rarity": "uncommon",
          "phase": 5,
          "level": 0,
          "x": 563,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "great-potoo",
          "name": "Great Potoo",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 744,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "japanese-sparrowhawk",
          "name": "Japanese Sparrowhawk",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 926,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "kiwi",
          "name": "Kiwi",
          "rarity": "rare",
          "phase": 4,
          "level": 0,
          "x": 926,
          "y": 1765,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "laughing-owl",
          "name": "Laughing Owl",
          "rarity": "extinct",
          "phase": 4,
          "level": 0,
          "x": 1832,
          "y": 2618,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "long-tailed-tit",
          "name": "Long-tailed Tit",
          "rarity": "rare",
          "phase": 4,
          "level": 0,
          "x": 1107,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "oriental-scops-owl",
          "name": "Oriental Scops Owl",
          "rarity": "rare",
          "phase": 4,
          "level": 0,
          "x": 1288,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "pennant-winged-nightjar",
          "name": "Pennant-winged Nightjar",
          "rarity": "rare",
          "phase": 4,
          "level": 0,
          "x": 1288,
          "y": 1765,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "phoenix",
          "name": "Phoenix",
          "rarity": "mythical",
          "phase": 5,
          "level": 0,
          "x": 382,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "pygmy-cupwing",
          "name": "Pygmy Cupwing",
          "rarity": "rare",
          "phase": 4,
          "level": 0,
          "x": 1470,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "resplendent-quetzal",
          "name": "Resplendent Quetzal",
          "rarity": "rare",
          "phase": 4,
          "level": 0,
          "x": 1651,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "simurgh",
          "name": "Simurgh",
          "rarity": "mythical",
          "phase": 5,
          "level": 0,
          "x": 1832,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "spoonbilled-sandpiper",
          "name": "Spoonbilled Sandpiper",
          "rarity": "uncommon",
          "phase": 5,
          "level": 0,
          "x": 563,
          "y": 1191,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "tawny-frogmouth",
          "name": "Tawny Frogmouth",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 1651,
          "y": 1765,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "wilsons-bird-of-paradise",
          "name": "Wilson's Bird-of-Paradise",
          "rarity": "rare",
          "phase": 4,
          "level": 0,
          "x": 1832,
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
          "style": null,
          "requirements": []
        }
      ],
      "lines": []
    },
    "anthropods": {
      "label": "Anthropods",
      "lanes": {
        "common": {
          "rows": 7,
          "columns": 9
        },
        "uncommon": {
          "rows": 7,
          "columns": 9
        },
        "rare": {
          "rows": 7,
          "columns": 9
        },
        "extinct": {
          "rows": 7,
          "columns": 9
        },
        "mythical": {
          "rows": 7,
          "columns": 9
        }
      },
      "critters": [
        {
          "id": "anansi",
          "name": "Anansi",
          "rarity": "mythical",
          "phase": 5,
          "level": 0,
          "x": 382,
          "y": 3471,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "asian-giant-hornet",
          "name": "Asian Giant Hornet",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 382,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "atlas-moth",
          "name": "Atlas Moth",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 382,
          "y": 1858,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "attercopus",
          "name": "Attercopus",
          "rarity": "extinct",
          "phase": 5,
          "level": 0,
          "x": 382,
          "y": 2711,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "black-widow",
          "name": "Black Widow",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 563,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "ceratomyrmex",
          "name": "Ceratomyrmex",
          "rarity": "extinct",
          "phase": 5,
          "level": 0,
          "x": 563,
          "y": 2711,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "chimerarachne",
          "name": "Chimerarachne",
          "rarity": "extinct",
          "phase": 5,
          "level": 0,
          "x": 926,
          "y": 2711,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "cockroach",
          "name": "Cockroach",
          "rarity": "common",
          "phase": 4,
          "level": 0,
          "x": 382,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "damselfly",
          "name": "Damselfly",
          "rarity": "common",
          "phase": 4,
          "level": 0,
          "x": 744,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "dragonfly",
          "name": "Dragonfly",
          "rarity": "common",
          "phase": 4,
          "level": 0,
          "x": 926,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "emperor-dragonfly",
          "name": "Emperor Dragonfly",
          "rarity": "uncommon",
          "phase": 4,
          "level": 0,
          "x": 382,
          "y": 1191,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "emperor-scorpion",
          "name": "Emperor Scorpion",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 744,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "giant-centipede",
          "name": "Giant Centipede",
          "rarity": "uncommon",
          "phase": 4,
          "level": 0,
          "x": 563,
          "y": 1191,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "giant-water-bug",
          "name": "Giant Water Bug",
          "rarity": "uncommon",
          "phase": 4,
          "level": 0,
          "x": 744,
          "y": 1191,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "giant-weta",
          "name": "Giant Weta",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 926,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "goliath-beetle",
          "name": "Goliath Beetle",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 1107,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "happy-face-spider",
          "name": "Happy Face Spider",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 1107,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "hercules-beetle",
          "name": "Hercules Beetle",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 1288,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "hibbertopterus",
          "name": "Hibbertopterus",
          "rarity": "extinct",
          "phase": 5,
          "level": 0,
          "x": 1107,
          "y": 2711,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "khepri",
          "name": "Khepri",
          "rarity": "mythical",
          "phase": 5,
          "level": 0,
          "x": 1832,
          "y": 3471,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "mazothairos",
          "name": "Mazothairos",
          "rarity": "extinct",
          "phase": 5,
          "level": 0,
          "x": 1288,
          "y": 2711,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "meganeuropsis",
          "name": "Meganeuropsis",
          "rarity": "extinct",
          "phase": 5,
          "level": 0,
          "x": 1651,
          "y": 2711,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "mydas-fly",
          "name": "Mydas Fly",
          "rarity": "uncommon",
          "phase": 4,
          "level": 0,
          "x": 926,
          "y": 1191,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "portia",
          "name": "Portia",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 1470,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "praying-mantis",
          "name": "Praying Mantis",
          "rarity": "uncommon",
          "phase": 4,
          "level": 0,
          "x": 1288,
          "y": 1191,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "pulmonoscorpius",
          "name": "Pulmonoscorpius",
          "rarity": "extinct",
          "phase": 5,
          "level": 0,
          "x": 1832,
          "y": 2711,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "queen-alexandras-birdwing",
          "name": "Queen Alexandra's Birdwing",
          "rarity": "legendary",
          "phase": 4,
          "level": 0,
          "x": 1288,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "scorpion",
          "name": "Scorpion",
          "rarity": "common",
          "phase": 4,
          "level": 0,
          "x": 1470,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "silkworm-moth",
          "name": "Silkworm Moth",
          "rarity": "common",
          "phase": 4,
          "level": 0,
          "x": 1832,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "stick-insect",
          "name": "Stick Insect",
          "rarity": "uncommon",
          "phase": 4,
          "level": 0,
          "x": 1470,
          "y": 1191,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "tarantula-hawk",
          "name": "Tarantula Hawk",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 1651,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "titan-beetle",
          "name": "Titan Beetle",
          "rarity": "rare",
          "phase": 5,
          "level": 0,
          "x": 1832,
          "y": 1951,
          "imageView": null,
          "style": null,
          "requirements": []
        },
        {
          "id": "tropidacris-grasshopper",
          "name": "Tropidacris Grasshopper",
          "rarity": "uncommon",
          "phase": 4,
          "level": 0,
          "x": 1651,
          "y": 1191,
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
          "style": null,
          "requirements": []
        },
        {
          "id": "wolf-spider",
          "name": "Wolf Spider",
          "rarity": "uncommon",
          "phase": 4,
          "level": 0,
          "x": 1832,
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
