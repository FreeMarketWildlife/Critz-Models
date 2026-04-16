export const librarySections = {
  maps: [
    { id: 'rootport', label: 'Rootport' },
    { id: 'plains', label: 'Plains' },
    { id: 'tree', label: 'Tree' },
  ],
  gameModes: [
    { id: 'conquest', label: 'Conquest' },
    { id: 'fantastic-conquest', label: 'Fantastic Conquest' },
    { id: 'duel', label: 'Duel' },
    { id: 'hide-hunt', label: 'Hide & Hunt' },
    { id: 'apex', label: 'Apex' },
    { id: 'blitz', label: 'Blitz' },
  ],
  medalsAchievements: [
    { id: 'medals', label: 'Medals' },
    { id: 'achievements', label: 'Achievements' },
  ],
  cosmetics: [
    {
      id: 'head',
      label: 'Head',
      title: 'Head Cosmetics',
      footer: 'Cosmetics · Head',
      description:
        'Head cosmetics cover hats, hair, masks, helmets, crowns, horns, antennae, and other pieces that primarily change the silhouette and personality of the critter head.',
    },
    {
      id: 'torso',
      label: 'Torso',
      title: 'Torso Cosmetics',
      footer: 'Cosmetics · Torso',
      description:
        'Torso cosmetics cover shirts, jackets, hoodies, armor, shells, capes, dresses, and any body-centered pieces that define the main outfit.',
    },
    {
      id: 'arms',
      label: 'Arms',
      title: 'Arm Cosmetics',
      footer: 'Cosmetics · Arms',
      description:
        'Arm cosmetics cover sleeves, bracers, gloves, feathers, wraps, prosthetic variants, and other pieces that specifically style the arms or forelimbs.',
    },
    {
      id: 'legs',
      label: 'Legs',
      title: 'Leg Cosmetics',
      footer: 'Cosmetics · Legs',
      description:
        'Leg cosmetics cover pants, greaves, stockings, wraps, patterned leg variants, and other pieces that belong on the lower body above the feet.',
    },
    {
      id: 'feet',
      label: 'Feet',
      title: 'Feet Cosmetics',
      footer: 'Cosmetics · Feet',
      description:
        'Feet cosmetics cover boots, sandals, talon wraps, paw accessories, hoof styling, and anything else that changes how the critter finishes at ground level.',
    },
    {
      id: 'emotes',
      label: 'Emotes',
      title: 'Emotes',
      footer: 'Cosmetics · Emotes',
      description:
        'Emotes are expressive animations, gestures, dances, reactions, and social callouts that let players show attitude without changing combat loadouts.',
    },
    {
      id: 'finishers',
      label: 'Finishers',
      title: 'Finishers',
      footer: 'Cosmetics · Finishers',
      description:
        'Finishers are stylized takedown or victory animations that turn key eliminations into memorable character moments with extra flair.',
    },
  ],
  minigames: [
    { id: 'run', label: 'RUN!' },
    { id: 'critter-quest', label: 'Critter Quest' },
    { id: 'katana-mouse', label: 'Katana Mouse' },
  ],
  brainstorming: [
    {
      id: 'collabs-media',
      label: 'Collabs & Media',
      title: 'Collaborations & Media Cosmetics',
      footer: 'Brainstorming · Collaborations',
      description: `Beta target: collaborate with Tier Zoo while Critz is still in Beta.<br><br>Creator wishlist: TikisGeckos, SerpaDesign, Tier Zoo, and any other creators already mentioned elsewhere in the project notes.<br><br>Partnership direction: prioritize creators who talk about animals, love animals, and have audiences that also love animals.<br><br>Indie game direction: explore collabs with games like Sledding Game, that frog platformer, and other indie projects that would pair well with Critz through skins, shared mechanics, events, or crossover cosmetics.<br><br>Post-launch direction: pursue collabs with shows, creators, and media that portray animals as characters or celebrate real animal life.<br><br>Cosmetic angle: build cosmetics inspired by things like Mulan, A Bug's Life, Rick and Morty creatures, South Park's Lemmiwinks and frog wizard-style characters, Amphibia, and other animal-character media.`,
    },
    {
      id: 'ai-creation',
      label: 'AI Creation',
      title: 'AI Creation Tools',
      footer: 'Brainstorming · Creative Tools',
      description: `Low-priority but high-upside feature set: let players scan a small section of land with their phone, potentially using video, then use AI to generate a starter world from it.<br><br>Player workflow: generate a draft world first, then refine it inside the world editor with command posts, borders, placement cleanup, and polish passes.<br><br>Voice cloning direction: let players submit a voice recording together with a clear permission flow like "I give Critz permission to clone my voice."<br><br>Service model: offload the voice processing to external tooling, charge enough to cover the generation cost, and then use the resulting model to produce custom voicelines for that player's character.<br><br>Presentation layer: the generated lines should still be transformed to fit the critter, such as deeper for larger animals and higher-pitched for smaller ones like mice.`,
    },
    {
      id: 'critter-identity',
      label: 'Critter Identity',
      title: 'Critter Identity, Variants & Skins',
      footer: 'Brainstorming · Critter Customization',
      description: `Long-term goal: every critter should eventually have both male and female versions; near term, a partial mix is acceptable.<br><br>Every critter should also support skins.<br><br>Common skins should often be simple color variants, especially for animals where that matches real life. Poison dart frogs are a strong example because they can support many authentic material-only common skins.`,
    },
    {
      id: 'critter-characters',
      label: 'Critter Characters',
      title: 'Critter Names, Personalities & Voicelines',
      footer: 'Brainstorming · Character Identity',
      description: `Every single critter should eventually have its own easy-to-pronounce character name and a clear personality, similar to how champions feel distinct in League of Legends.<br><br>Examples: Stick Insect could just be Stick, Gecko could be Geek, Finch could be Atticus, Salamander could be Sally, Turtle should definitely be Plumpy, Mouse should be George, and Koala could be Ken.<br><br>Personality direction: some critters should feel grumpy, sad, happy, dumb, smart, nerdy, lazy, and so on, with that personality coming through in voicelines and overall presentation.<br><br>Species direction stays grounded: Critters should still always be based on very specific real animal species, and the Critz Library should present the species facts like scientific name, common name, real-world habitat, and a fun fact.`,
    },
    {
      id: 'named-ai-units',
      label: 'Named AI Units',
      title: 'Named AI Units, Variants & Rivalries',
      footer: 'Brainstorming · AI Personality',
      description: `AI battlefield units should have recognizable identity, even when many units share the same base species.<br><br>Battlefront 2 (2005) inspiration: even when many units on a team look identical, it is still fun to notice specific names popping up in kill feeds and at the end of a match as a nemesis or recurring target.<br><br>Direction for Critz: build a library of named AI variants where there may be many frogs on the battlefield, but only one frog wears a snapback hat and chain and has a unique name; there may be many chipmunks on the battlefield, but only one wears a medieval helmet, cape, and boots and has a specific name like Marty.<br><br>Specific callout: one named AI unit should wear an orange hoodie and be named Kenny, with an achievement tied to that encounter.<br><br>Outfit categories to support for AI and character variants: hairs, hats, sweaters and sweatshirts, jewelry, and similar standout accessories.<br><br>Behavior idea: named AI units can each have a very consistent but slightly varied behavior tree so that a recurring unit like Marty the cowboy squirrel feels recognizable from match to match.<br><br>Achievement angle: support joke achievements and memorable callouts around killing specific AI personalities, including ideas in the spirit of "YOU KILLED KENNY!" or "YOU BASTARD!" and a collectible-style reward like "I'm an action figure!" for earning your own charm.`,
    },
    {
      id: 'campaign-lore',
      label: 'Campaign',
      title: 'Campaign Direction & World Story',
      footer: 'Brainstorming · Narrative',
      description: `Create a campaign that honors the tone and structure of the Battlefront 2 (2005) campaign.<br><br>At the same time, the campaign should follow the story of Dragex, the xenofiction thread that takes place in Hokkaido, the fictional world where Critz resides.`,
    },
    {
      id: 'dragex-lore',
      label: 'Lore',
      title: 'Dragex Lore, Themes & Worldbuilding',
      footer: 'Brainstorming · Lore',
      description: `The book/story tied to Critz is called Dragex, and Archaois is the one writing it.<br><br>Prologue framing: Archaois writes to his granddaughter from Eden's Isle using his nails because he has no writing tools or parchment, hopes the story will be preserved across generations, and tries to send it out with the migrating birds after learning the angel's tongue.<br><br>Worldbuilding flavor: an alarm clock in Dragex could work like a wound music box held in place by wax or another sun-softened material so that the warmth of morning releases it and starts the melody.<br><br>Language/culture note: in Dragex, "bird brain" is a comment that plays against the fact that ravens are actually highly intelligent.<br><br>Political and spiritual theme: after the Battle of Yokai, the old racial divisions should feel challenged by the fact that everyone has shared in Fey blood. Koric's rhetoric can center on the idea that the real conflict is no longer race but perspective, and that the peoples of the world are now Feysian.<br><br>Arcane inheritance direction: some bloodlines retain distinct Fey-derived traits, such as Veratus carrying a lightning-strike effect on kills, Koric carrying fire, Moto carrying illusions, and most Critters having a far more blended inheritance.`,
    },
    {
      id: 'dragex-story-moments',
      label: 'Story Moments',
      title: 'Dragex Character Moments & Scene Ideas',
      footer: 'Brainstorming · Lore',
      description: `Possible opening idea: Veratus begins on a fishing trip to the Cape of Kalos.<br><br>Important story beats to explore: Veratus steals a chick from a legendary eagle; Archaois later reveals that he was the one who dropped off the egg; and Koric's meaning is tied to his spirit animal, the dark raven.<br><br>Dialogue note: someone tells Veratus, "Your life isn't falling apart, it's falling into place."<br><br>Character note: Psyte's best friend is a taurantula.<br><br>Koric backstory possibility: Veratus's father, the king, once showed Koric the Cave of Revelation. In an earlier life Koric was a Samuel-like figure fighting for justice and truth there and was killed by the king, while in his next life he reaches the cave much younger, more reckless, and kills Veratus's father in anger.<br><br>Visual/species inspiration: Firehawks should remain in the reference pile as a possible Dragex creature or tone piece. Reference: <a href="https://youtube.com/shorts/67OC6YDqk6M?si=eiz5FgZYrY53KHUX" target="_blank" rel="noreferrer">Firehawks short</a>.`,
    },
    {
      id: 'map-inspirations',
      label: 'Map Inspirations',
      title: 'Map Inspirations & Set-Piece Ideas',
      footer: 'Brainstorming · Maps',
      description: `Build maps that honor Battlefront 2005 locations and capture memorable set pieces.<br><br>Examples: a Hoth-inspired map with burrows and an avalanche set piece where a player can shoot an explosive into the mountain to trigger a slide that kills anything in its path; a Polis Massa-inspired underground tunnel system; a Dagobah-style swamp; and a Jabba's Palace-inspired location built inside a giant tree.<br><br>Traversal note: some maps should have areas where lily pads are already set up as permanent routes, not just temporary or improvised movement tech.<br><br>Additional multiplayer inspiration: make a map inspired by the Roblox Rivals Arena map, but with permanent lily pads on the walls so players can jump using that same style of movement. That map could also support a sniper-only mode.`,
    },
    {
      id: 'flight-combat',
      label: 'Flight Combat',
      title: 'Bird Flight Combat & Weapon Feel',
      footer: 'Brainstorming · Gameplay',
      description: `When a bird flies, the weapon should feel more bound to that critter's talents and overall movement identity.<br><br>One direction to test: birds either cannot change weapons at all while airborne, or weapon swapping is far more constrained than it is for grounded critters.<br><br>Aim-feel idea: the crosshair should travel in a predictable but wobbly figure-eight pattern while flying, so the player can still master it and land skillful shots, including satisfying headshots on grounded targets.<br><br>The goal is for flight to feel difficult, expressive, and learnable rather than simply inaccurate.`,
    },
    {
      id: 'trailer-moments',
      label: 'Trailer',
      title: 'Trailer Beats, Voice Lines & Showcase Moments',
      footer: 'Brainstorming · Marketing',
      description: `Trailer opener idea: the Critz theme starts over a calm drone shot moving across maps and peaceful lobbies before the action escalates.<br><br>Comedy beat: Salamander is crying to Lizard after missing his last rocket launcher shot and says, "You missed! How could you miss? He was three feet in front of you!"<br><br>Showcase moment: on the Hoth-style map, explosives can trigger an avalanche that sweeps units away.<br><br>Achievement tie-in: award an achievement if a player kills at least 10 units with a single avalanche.`,
    },
    {
      id: 'live-events',
      label: 'Live Events',
      title: 'Weekend King of the Rock',
      footer: 'Brainstorming · Live Ops',
      description: `Weekend-only event idea: "King of the Rock" lobbies in Eastlake.<br><br>Map fantasy: each lobby centers on a rock out in the lake, inspired by the Mulan-style "I'm king of the rock" moment.<br><br>Mode rule: PvP becomes active on the rock, and players earn points for every second they stay on the rock while no other player is standing there.`,
    },
    {
      id: 'community-growth',
      label: 'Community & Growth',
      title: 'Community Feedback, Rewards & Onboarding',
      footer: 'Brainstorming · Community',
      description: `Keep the community involved in development through constant voting, feedback prompts, and incentives for participation.<br><br>Reward social growth loops like gifting skins to other players and using referral links that lead to a new player creating an account and finishing the tutorial.<br><br>Tutorial goal: keep it under 3 minutes, make it fun, and teach everything a player needs to start playing online with friends immediately after.`,
    },
    {
      id: 'critz-timeline',
      label: 'Critz Roadmap',
      title: 'Critz Roadmap',
      footer: 'Brainstorming · Roadmap',
      description: `A roadmap view for Critz that moves from right to left across the major phases of the project.`,
      viewType: 'timeline',
      timeline: {
        sections: [
          {
            id: 'pre-launch',
            label: 'Pre Launch',
            description: 'Foundation work before the public beta begins.',
            groups: [
              {
                id: 'pre-launch-current',
                label: 'Current Build Goals',
                milestones: [
                  {
                    id: 'prelaunch-4-critters',
                    label: '4 Critters',
                    state: 'complete',
                    detail:
                      'This marks the first small critter roster target for the earliest playable version of Critz. The initial creature count is already represented in the current roadmap.',
                    detailFooter: 'Critz Roadmap · Pre Launch · Current Build Goals',
                  },
                  {
                    id: 'prelaunch-16-weapons',
                    label: '16 Weapons',
                    state: 'complete',
                    detail:
                      'This milestone covers the first meaningful weapon spread for early testing, giving the project enough combat variety to start validating feel, progression, and identity.',
                    detailFooter: 'Critz Roadmap · Pre Launch · Current Build Goals',
                  },
                  {
                    id: 'prelaunch-conquest-ai',
                    label: 'Conquest Gamemode with AI Units',
                    state: 'active',
                    detail:
                      'This is the main gameplay systems milestone for the current pre-launch phase. It represents getting the core Conquest loop online together with AI battlefield units.',
                    detailFooter: 'Critz Roadmap · Pre Launch · Current Build Goals',
                  },
                  {
                    id: 'prelaunch-1-map',
                    label: '1 Map',
                    state: 'active',
                    detail:
                      'This milestone represents having a single strong playable environment ready for repeated testing, iteration, and showcase use during early development.',
                    detailFooter: 'Critz Roadmap · Pre Launch · Current Build Goals',
                  },
                ],
              },
              {
                id: 'pre-launch-beta-ramp',
                label: 'Closer to Beta',
                milestones: [
                  {
                    id: 'prebeta-12-critters',
                    label: '12 Critters',
                    state: 'planned',
                    detail:
                      'This is the broader pre-beta creature roster target meant to make the cast feel more representative before the public beta opens.',
                    detailFooter: 'Critz Roadmap · Pre Launch · Closer to Beta',
                  },
                  {
                    id: 'prebeta-24-weapons',
                    label: '24 Weapons',
                    state: 'planned',
                    detail:
                      'This milestone expands the arsenal to a much healthier pre-beta size so players have more build variety and more reasons to explore different playstyles.',
                    detailFooter: 'Critz Roadmap · Pre Launch · Closer to Beta',
                  },
                  {
                    id: 'prebeta-3-maps',
                    label: '3 Maps',
                    state: 'planned',
                    detail:
                      'This pre-beta map target is about making sure Critz has enough environmental variety to support repetition, discovery, and early matchmaking interest.',
                    detailFooter: 'Critz Roadmap · Pre Launch · Closer to Beta',
                  },
                  {
                    id: 'prebeta-3-gamemodes',
                    label: '3 Gamemodes',
                    state: 'planned',
                    detail:
                      'This milestone expands the pre-beta structure beyond a single loop and starts testing whether multiple ways to play can coexist cleanly inside Critz.',
                    detailFooter: 'Critz Roadmap · Pre Launch · Closer to Beta',
                  },
                  {
                    id: 'prebeta-30-cosmetics',
                    label: '30 Cosmetics',
                    state: 'planned',
                    detail:
                      'This target gives the project a first real layer of self-expression so the world starts feeling more personal before the beta launch.',
                    detailFooter: 'Critz Roadmap · Pre Launch · Closer to Beta',
                  },
                ],
              },
            ],
          },
          {
            id: 'beta-launch',
            label: 'Beta Launch',
            description: 'Targets for the period when the beta is live.',
            groups: [
              {
                id: 'beta-launch-goals',
                label: 'Beta Goals',
                milestones: [
                  {
                    id: 'beta-30-critters',
                    label: '30 Critters',
                    state: 'planned',
                    detail:
                      'This is the larger creature target for the live beta era, meant to make the roster feel genuinely broad once more players arrive.',
                    detailFooter: 'Critz Roadmap · Beta Launch',
                  },
                  {
                    id: 'beta-50-weapons',
                    label: '50 Weapons',
                    state: 'planned',
                    detail:
                      'This arsenal milestone is about letting the beta feel deep enough to support experimentation, favorites, counters, and long-session discovery.',
                    detailFooter: 'Critz Roadmap · Beta Launch',
                  },
                  {
                    id: 'beta-10-maps',
                    label: '10 Maps',
                    state: 'planned',
                    detail:
                      'This map target gives the beta enough location variety to avoid staleness and to support multiple fantasies, moods, and combat rhythms.',
                    detailFooter: 'Critz Roadmap · Beta Launch',
                  },
                  {
                    id: 'beta-3-gamemodes',
                    label: '3 Different Gamemodes',
                    state: 'planned',
                    detail:
                      'This milestone keeps the beta focused while still ensuring Critz does not feel one-note once a larger player base is active.',
                    detailFooter: 'Critz Roadmap · Beta Launch',
                  },
                  {
                    id: 'beta-100-cosmetics',
                    label: '100 Cosmetics',
                    state: 'planned',
                    detail:
                      'This cosmetic target is meant to make the live beta feel socially expressive, collectible, and much more identity-driven.',
                    detailFooter: 'Critz Roadmap · Beta Launch',
                  },
                ],
              },
            ],
          },
          {
            id: 'post-launch',
            label: 'Post Launch',
            description: 'Recurring live-content cadence after launch.',
            groups: [
              {
                id: 'post-launch-cadence',
                label: 'Live Cadence',
                milestones: [
                  {
                    id: 'post-1-critter-week',
                    label: '1 New Critter a Week',
                    state: 'recurring',
                    detail:
                      'This is the live-content cadence goal for keeping the creature roster growing after launch and making the world feel constantly alive.',
                    detailFooter: 'Critz Roadmap · Post Launch',
                  },
                  {
                    id: 'post-3-cosmetics-week',
                    label: '3 New Cosmetics a Week',
                    state: 'recurring',
                    detail:
                      'This cadence keeps personalization moving quickly after launch and gives players a steady stream of visible new rewards and style options.',
                    detailFooter: 'Critz Roadmap · Post Launch',
                  },
                  {
                    id: 'post-1-map-month',
                    label: '1 New Map a Month',
                    state: 'recurring',
                    detail:
                      'This target keeps the map pool growing at a sustainable pace while still giving enough time for polish, testing, and stronger set-piece design.',
                    detailFooter: 'Critz Roadmap · Post Launch',
                  },
                  {
                    id: 'post-1-weapon-month',
                    label: '1 New Weapon a Month',
                    state: 'recurring',
                    detail:
                      'This cadence keeps combat evolving after launch without overwhelming the game with constant balance disruption.',
                    detailFooter: 'Critz Roadmap · Post Launch',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: 'monetization-economy',
      label: 'Monetization',
      title: 'Monetization & Critz Economy',
      footer: 'Brainstorming · Economy',
      description: `Players should be able to spend Critz to level up critters and weapons, and players should also be able to buy Critz directly.<br><br>Presentation rule: purchasing Critz should not feel shoved in the player's face. The game should avoid desperate monetization pressure and instead surface the option in a low-friction, respectful way.<br><br>Progression target: roughly balance paid Critz around a $10 USD to 1 hour conversion, meaning a player who pays $10 should make about the same critter and weapon progression that an efficient player could earn by grinding for about one hour.<br><br>This should be treated as a tuning target, not a final law. It will need extensive testing and iteration before implementation so the economy feels fair, readable, and not pay-to-win.`,
    },
    {
      id: 'mode-expansion',
      label: 'Mode Ideas',
      title: 'Additional Game Mode Ideas',
      footer: 'Brainstorming · Modes',
      description: `There should be a Duels mode built around clean 1v1 fights, similar to the way Roblox Rivals handles its duel format.<br><br>There should also be a Juggernaut mode where one player becomes an apex predator and fights without weapons, relying only on natural attacks like claws, teeth, and similar animal abilities.`,
    },
    {
      id: 'educational-minigames',
      label: 'Educational Minigames',
      title: 'Educational Minigames for Critz',
      footer: 'Brainstorming · Minigames',
      description: `There should be several minigames in Critz that help children learn while still feeling exciting and replayable.<br><br>Spelling Bee idea: players hear a spoken word and have to spell it correctly, with bonus score for answering faster. The words should get harder as the run continues so the difficulty ramps quickly and most games do not last much longer than 3 minutes.<br><br>Typing Race idea: a 60-second typing challenge where the text players type is lore from Dragex, so the mode teaches Critz worldbuilding while testing speed and accuracy.<br><br>Mental Math Aim Trainer idea: a fast arcade-style addition game that mixes Duck Hunt energy with mental math, where players solve simple addition problems by aiming and shooting the correct answer targets.<br><br>Overall direction: these minigames should feel educational without feeling like homework.`,
    },
  ],
};
