const createId = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const createItems = (entries, defaultTag) =>
  entries.map(({ label, description, tag = defaultTag, footer = null }) => ({
    id: createId(label),
    label,
    description,
    tag,
    footer,
  }));

const medalEntries = [
  { label: 'CRITZ!', description: 'Number of Critical Hits Dealt' },
  { label: 'Kills', description: 'Number of Kills' },
  { label: 'Deaths', description: 'Number of Deaths' },
  { label: 'Conquest Victories', description: 'Number of Victories in the Conquest Game Mode' },
  { label: 'Duel Victories', description: 'Number of Victories in the Duel Game Mode' },
  {
    label: "If I take one more step... it will be the farthest from home I've ever been",
    description: 'Number of steps taken',
  },
  {
    label: 'The Lesser Commission',
    description: 'Number of players who used your referral code to create an account',
  },
  { label: 'Critters', description: 'Number of Critters' },
  { label: 'Weapons & Tools', description: 'Number of Weapons' },
  { label: 'Shiny Hunter', description: 'Number of Shinies' },
  { label: 'Reptilian', description: 'Total Level of Reptiles' },
  { label: 'Amphibian', description: 'Total Level of Amphibians' },
  { label: 'Mammalian', description: 'Total Level of Mammals' },
  { label: 'Avian', description: 'Total Level of Birds' },
  { label: 'Invertebrate', description: 'Total Level of Invertebrates' },
];

const achievementEntries = [
  { label: 'You made it!', description: 'Complete Tutorial' },
  { label: "We're 99% Sure You're Human", description: 'Verify Account' },
  { label: 'I Choose You!', description: 'Purchase a New Critter' },
  { label: 'CRITZ!', description: 'Deal Critical Hits with Every Weapon & Tool' },
  { label: 'Kakorot!', description: 'Grapple an Enemy Whilst They Die' },
  {
    label: 'CLAYTON!',
    description:
      "Needs to be some form of unintentional suicide while trying to kill someone. It'll definitely be best if there is hanging involved, perhaps with a whip or vine in the future as a melee.",
    tag: 'Needs Rule',
  },
  { label: "It's Over 9000!", description: 'Deal Over 9000 Damage with 1 attack' },
  { label: 'Yer a Wizard', description: "Use Wizard's Wand" },
  { label: 'Mischief Managed', description: 'Capture the Flag without Taking Damage' },
  { label: 'The Critter Who Lived', description: 'Win a Game with 1 HP left' },
  { label: 'Diamonds!', description: 'Unlock a Diamond Wrap' },
  { label: 'Just Keep Swimming', description: 'Spend 90% of the Game in Water' },
  { label: 'To Infinity & Beyond', description: 'Glide' },
  { label: 'The Bare Necessities', description: 'Win a Game using Only the Default Loadout' },
  { label: 'Pentakill!', description: 'Get 5 Kills back to back' },
  {
    label: 'A Fine Addition',
    description: 'Take an Item from a Player using the High Stakes Duel Arena',
  },
  {
    label: 'Hello There',
    description: 'Drop down to an enemy unit and use an emote before dealing damage',
  },
  { label: 'Unlimited Power!', description: 'Kill an enemy using an Electric attack' },
  {
    label: 'Get Outta My Swamp!',
    description: 'Defend a Command Post by Yourself for 60 seconds',
  },
  { label: 'Just Like the Simulations', description: 'Win Your First Multiplayer Game' },
  { label: 'Reinforcements Are Depleted', description: 'Be the last reinforcement on your team' },
  {
    label: "Comin' Around!",
    description: 'Go to an area of the map where a friendly player pinged for help',
  },
  { label: 'Press F', description: 'Use Quick Melee' },
  { label: 'No Scoped', description: 'Get a Kill with Sniper without Scoping' },
  { label: 'Lag Spike', description: 'Have Over 1000ms lag' },
  { label: 'Cowabunga!', description: 'Use Bo Staff While Playing as a Turtle' },
  { label: 'Avengers Assemble', description: 'Play in a party of 6 on multiplayer' },
  { label: 'Speedrun Strats', description: 'Win a Game in Less than 60 seconds' },
  { label: 'Calculated', description: 'Survive a Fight with 1 HP' },
  { label: 'High Ground', description: 'Kill an Enemy who is significantly below you' },
  {
    label: 'Fool of a Took',
    description: 'Have the Worst KDA on Your Team at the end of a Game',
  },
  {
    label: 'Wombo Combo!',
    description: 'Keep an enemy unit Crowd Controlled from Full HP to Death',
  },
  {
    label: 'So Uncivilized',
    description: 'Win the Game with a Kill from the Blaster Pistol',
  },
  { label: 'Second Breakfast', description: 'Replenish your Resources' },
  {
    label: 'Dishonor on Your Cow',
    description: 'Loose a Game with the Worst KDA on your team while playing Guinea Pig',
  },
  { label: 'Great Stone Dragon', description: 'Get Frozen Whilst Playing as Dragon' },
  {
    label: 'King of the ROCK!',
    description: 'Need to figure this one out.',
    tag: 'TBD',
  },
  { label: "Trashin' the Camp", description: 'Destroy 25 Objects in 60 Seconds' },
  { label: 'Street Rat', description: 'Pickpocket an NPC while playing Rat' },
  {
    label: 'Royal Suitor',
    description: 'Wear an Outfit that costs over 1,000,000 Bells',
  },
  {
    label: 'Itty Bitty Living Space',
    description: 'Win a Game of Conquest without Leaving Your Command Post',
  },
  {
    label: 'Fus Ro Dah',
    description: 'Kill an Enemy by Pushing them off a Cliff using Bo Staff',
  },
  { label: 'Squeakity Squeak', description: 'Emote while playing Squirrel' },
  { label: 'Wrong Lever!', description: 'Accidently Kill an Enemy' },
  { label: 'Boom Baby!', description: 'Kill 3 or more Enemies with 1 explosive' },
  {
    label: "Where's My Super Suit?",
    description: 'TBD',
    tag: 'TBD',
  },
  {
    label: 'I can carry you',
    description: 'Win a Multiplayer Game with the Highest KDA on Your Team',
  },
  { label: 'Be Fruitful and Multiply', description: 'Command 1 minion' },
  { label: 'Biblically Accurate Quiver', description: 'Command 7 minions at once' },
  {
    label: 'Five Smooth Stones',
    description: 'Defeat an enemy twice your size using the Sling Shot',
  },
  {
    label: 'No Touchy!',
    description: 'Kill an enemy immediately after they grapple you',
  },
  { label: 'Skadoosh', description: 'Kill an enemy using fall damage' },
  {
    label: 'Strangers Like Me',
    description: 'Emote at a fellow player using the same Critter as you',
  },
  {
    label: 'You Shall Not Pass',
    description: 'Kill an enemy when they spawn, before they leave their command post',
  },
  { label: 'My Precious', description: 'Play an entire game using only 1 weapon or tool' },
  {
    label: 'The Chosen One',
    description: 'Win a match, being the last surviving unit on your team',
  },
  { label: 'My Line Has Ended!', description: 'Have all of your minions die in battle' },
  { label: 'That Still Only Counts as One!', description: 'Defeat an Apex predator' },
  { label: 'The Beacons Are Lit!', description: 'Ping for Help' },
  {
    label: 'A Wizard Is Never Late',
    description:
      "Be AFK for 15 seconds at the beginning of a multiplayer match, then equip the Wizard's staff",
  },
  {
    label: 'I Never Doubted you for a Second',
    description:
      'In Multiplayer, be the lowest ranked player on your team, and end with the highest KDA',
  },
  {
    label: 'You Dare Use My Own Spells Against Me?',
    description: 'Be attacked by enemy using Wand, then Defeat them using Wand',
  },
  { label: 'Good Samaritan', description: 'Heal an enemy' },
  { label: 'The Prodigal Son', description: 'Go out of bounds, then come back to the fight' },
  {
    label: 'Let Me Die with the Enemies!',
    description:
      "Defeat more enemies with an environmental interaction that kills yourself than you've killed this game",
  },
  {
    label: 'Come, my lord, come right in',
    description: 'Backstab an enemy while they are immobilized',
  },
  {
    label: 'Get out of here, baldy!',
    description: 'Call a beast to maul an enemy who has emoted at you',
  },
  { label: 'The Valley of Slaughter', description: 'Walk amongst 10 or more dead bodies' },
  { label: 'The Good Shepherd', description: 'Heal a minion' },
  { label: 'Time for a Shower', description: 'Play Critz for 12 hours straight' },
  {
    label: 'You like jazz?',
    description: 'Use the Flirt Emoji in front of another player whilst playing a Hornet',
  },
  { label: "Bees don't smoke!", description: 'Kill an enemy in Smoke with Bee' },
  { label: "I'm talking to a bee!", description: 'Emote to a Bee' },
  {
    label: "That's a pretty big difference",
    description: 'Deplete enemy resources to 0 whilst having over 100 resources',
  },
  { label: 'You bastards!', description: 'Kill Kenny' },
  {
    label: "Screw You Guys, I'm Going Home",
    description: 'Leave a multiplayer match whilst on the losing team',
  },
  { label: 'Respect My Authoritah!', description: 'Successfully get a player banned' },
  { label: 'Blame Canada', description: 'Lose a game after being massively ahead' },
  {
    label: 'Student a-tho-letes',
    description: 'End a game with a lower KDA than your minions',
  },
  {
    label: 'They Took Our Jobs!',
    description: 'Win with every NPC on your team having more victory points than you',
  },
  {
    label: 'Tegridy',
    description: 'All participating players honor each other at the end of a multiplayer match',
  },
  { label: "And That's the Way the News Goes!", description: 'Read a Critz Newspaper' },
  { label: 'Existence Is Pain', description: 'Die over 100 times in a single match' },
  {
    label: 'You Crazy Son of a Doe, I\'m In',
    description: 'Accept an invite from a friend to a limited time event',
  },
  {
    label: 'I Turn Now, Good Luck Everybody Else!',
    description: 'Run over 3 or more enemies with a vehicle in a single moment',
  },
  {
    label: 'Roadhouse',
    description: 'Kill an enemy with a Roadhouse kick playing Roadrunner',
  },
  {
    label: 'One Eternity Later...',
    description: 'Finally get into a multiplayer match after waiting over 10 minutes',
  },
];

export const medalsAchievementsCatalog = {
  medals: {
    id: 'medals',
    title: 'Medals',
    eyebrow: 'Career totals',
    description:
      'Lifetime stats, collection totals, and progression tallies that define a full Critz career.',
    detailFooter: 'Medal · Career total',
    emptyMessage: 'No medals have been listed yet.',
    items: createItems(medalEntries, 'Career Total'),
  },
  achievements: {
    id: 'achievements',
    title: 'Achievements',
    eyebrow: 'Unlock challenges',
    description:
      'Gameplay feats, situational challenges, and long-tail goals players can unlock across Critz.',
    detailFooter: 'Achievement · Unlock challenge',
    emptyMessage: 'No achievements have been listed yet.',
    items: createItems(achievementEntries, 'Unlock Challenge'),
  },
};
