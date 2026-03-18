export const critterMapDefaultLayout = {
  "generatedAt": "2026-03-17T04:17:40.058Z",
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
          "style": null,
          "requirements": []
        },
        {
          "id": "anole",
          "name": "Anole",
          "rarity": "common",
          "level": 10,
          "x": 1306,
          "y": 524,
          "style": {
            "textScale": 100,
            "hue": 193,
            "saturation": 88,
            "lightness": 52,
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
          "x": 1125,
          "y": 911,
          "style": {
            "textScale": 100,
            "hue": 100,
            "saturation": 100,
            "lightness": 52,
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
          "x": 943,
          "y": 1671,
          "style": {
            "textScale": 100,
            "hue": 33,
            "saturation": 88,
            "lightness": 52,
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
          "x": 1306,
          "y": 1951,
          "style": {
            "textScale": 100,
            "hue": 145,
            "saturation": 88,
            "lightness": 52,
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
          "y": 3191,
          "style": {
            "textScale": 100,
            "hue": 0,
            "saturation": 100,
            "lightness": 52,
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
          "y": 1004,
          "style": {
            "textScale": 100,
            "hue": 310,
            "saturation": 88,
            "lightness": 64,
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
          "x": 37,
          "y": 3191,
          "style": null,
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
          "x": 37,
          "y": 911,
          "style": {
            "textScale": 100,
            "hue": 287,
            "saturation": 88,
            "lightness": 52,
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
          "x": 581,
          "y": 2044,
          "style": null,
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
          "x": 762,
          "y": 2804,
          "style": {
            "textScale": 100,
            "hue": 238,
            "saturation": 85,
            "lightness": 52,
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
          "x": 37,
          "y": 1858,
          "style": {
            "textScale": 100,
            "hue": 259,
            "saturation": 88,
            "lightness": 52,
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
          "y": 911,
          "style": {
            "textScale": 112,
            "hue": 143,
            "saturation": 86,
            "lightness": 32,
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
          "x": 762,
          "y": 1858,
          "style": null,
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
          "x": 218,
          "y": 618,
          "style": {
            "textScale": 100,
            "hue": 59,
            "saturation": 88,
            "lightness": 52,
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
          "style": {
            "textScale": 100,
            "hue": 19,
            "saturation": 88,
            "lightness": 52,
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
          "x": 1487,
          "y": 2431,
          "style": {
            "textScale": 100,
            "hue": 327,
            "saturation": 97,
            "lightness": 69,
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
          "style": {
            "textScale": 173,
            "hue": 131,
            "saturation": 100,
            "lightness": 43,
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
          "style": {
            "textScale": 100,
            "hue": 28,
            "saturation": 88,
            "lightness": 52,
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
          "y": 1951,
          "style": {
            "textScale": 100,
            "hue": 299,
            "saturation": 76,
            "lightness": 66,
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
          "style": {
            "textScale": 100,
            "hue": 239,
            "saturation": 100,
            "lightness": 34,
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
          "style": {
            "textScale": 173,
            "hue": 339,
            "saturation": 82,
            "lightness": 52,
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
          "style": {
            "textScale": 100,
            "hue": 0,
            "saturation": 88,
            "lightness": 40,
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
          "style": {
            "textScale": 100,
            "hue": 246,
            "saturation": 40,
            "lightness": 40,
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
          "style": {
            "textScale": 100,
            "hue": 360,
            "saturation": 88,
            "lightness": 52,
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
          "id": "fortunate-toad",
          "name": "Fortunate Toad",
          "rarity": "mythical",
          "level": 100,
          "x": 1306,
          "y": 3191,
          "style": {
            "textScale": 103,
            "hue": 41,
            "saturation": 88,
            "lightness": 52,
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
          "id": "frog-prince",
          "name": "Frog Prince",
          "rarity": "mythical",
          "level": 25,
          "x": 1487,
          "y": 3378,
          "style": {
            "textScale": 100,
            "hue": 285,
            "saturation": 88,
            "lightness": 64,
            "inputHue": null,
            "inputSaturation": null,
            "inputLightness": null,
            "inputWidth": 8
          },
          "requirements": [
            {
              "critterId": "fortunate-toad",
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
          "style": {
            "textScale": 100,
            "hue": 84,
            "saturation": 88,
            "lightness": 52,
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
          "style": {
            "textScale": 100,
            "hue": 145,
            "saturation": 88,
            "lightness": 52,
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
          "style": {
            "textScale": 100,
            "hue": 48,
            "saturation": 100,
            "lightness": 52,
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
          "style": {
            "textScale": 100,
            "hue": 20,
            "saturation": 88,
            "lightness": 52,
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
          "id": "newt",
          "name": "Newt",
          "rarity": "common",
          "level": 15,
          "x": 218,
          "y": 618,
          "style": {
            "textScale": 100,
            "hue": 22,
            "saturation": 100,
            "lightness": 52,
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
          "style": {
            "textScale": 100,
            "hue": 284,
            "saturation": 88,
            "lightness": 52,
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
          "style": {
            "textScale": 100,
            "hue": 263,
            "saturation": 88,
            "lightness": 52,
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
          "style": {
            "textScale": 131,
            "hue": 226,
            "saturation": 88,
            "lightness": 52,
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
          "style": {
            "textScale": 100,
            "hue": 231,
            "saturation": 37,
            "lightness": 45,
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
          "style": {
            "textScale": 100,
            "hue": 360,
            "saturation": 69,
            "lightness": 74,
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
          "style": {
            "textScale": 100,
            "hue": 59,
            "saturation": 88,
            "lightness": 52,
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
          "id": "ferret",
          "name": "Ferret",
          "rarity": "common",
          "level": 0,
          "x": 399,
          "y": 151,
          "style": null,
          "requirements": []
        },
        {
          "id": "hedgehog",
          "name": "Hedgehog",
          "rarity": "common",
          "level": 0,
          "x": 762,
          "y": 151,
          "style": null,
          "requirements": []
        },
        {
          "id": "porcupine",
          "name": "Porcupine",
          "rarity": "common",
          "level": 0,
          "x": 1125,
          "y": 151,
          "style": null,
          "requirements": []
        }
      ],
      "lines": []
    },
    "birds": {
      "label": "Birds",
      "critters": [
        {
          "id": "finch",
          "name": "Finch",
          "rarity": "common",
          "level": 0,
          "x": 399,
          "y": 151,
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
          "style": null,
          "requirements": []
        }
      ],
      "lines": []
    },
    "insects": {
      "label": "Insects",
      "critters": [
        {
          "id": "beetle",
          "name": "Beetle",
          "rarity": "common",
          "level": 0,
          "x": 399,
          "y": 151,
          "style": null,
          "requirements": []
        },
        {
          "id": "mantis",
          "name": "Mantis",
          "rarity": "common",
          "level": 0,
          "x": 943,
          "y": 151,
          "style": null,
          "requirements": []
        }
      ],
      "lines": []
    }
  }
};
