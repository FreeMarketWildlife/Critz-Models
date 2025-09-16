export const weaponData = {
  categories: [
    {
      id: 'primary',
      label: 'Primary',
      title: 'Primary Arsenal',
      description: 'Siege-shaping implements that anchor every Critz loadout with overwhelming presence.',
      lore: 'Forged by the Emberwright conclaves, these weapons channel leyfire into disciplined volleys.',
      defaultWeaponId: 'ember-repeater',
      theme: {
        primaryColor: '#ff9d5c',
        secondaryColor: '#ffd6a1',
        rune: 'Sigil of the First Flame',
      },
      weapons: [
        {
          id: 'ember-repeater',
          name: 'Ember Repeater',
          categoryId: 'primary',
          type: 'Repeating Crossbow',
          role: 'Siege Piercer',
          description:
            'Launches magma-charged bolts in sustained bursts. Each quarrel brands targets with scorch sigils that detonate on stagger.',
          stats: {
            damage: 54,
            fireRate: 3.4,
            reloadSpeed: 2.1,
            magazineSize: 8,
            capacity: 48,
            range: 70,
            criticalChance: 18,
            statusEffect: 'Scorch (burn buildup)',
            element: 'Fire',
            staminaCost: 12,
            weight: 'Medium',
          },
          tags: ['Repeater', 'Leyfire', 'Mid-Range'],
          notes: 'Overheats if the magazine is cycled more than three times without pause; vent animation incoming.',
          model: {
            path: 'assets/models/primary/ember-repeater.glb',
            scale: 0.92,
            position: [0, 0.12, 0],
            rotation: [0, Math.PI / 9, 0],
            thumbnail: 'assets/textures/primary/ember-repeater.png',
          },
          audio: {
            fire: 'assets/audio/weapons/primary/ember-repeater-fire.ogg',
            reload: 'assets/audio/weapons/primary/ember-repeater-reload.ogg',
          },
        },
        {
          id: 'stormspire-cannon',
          name: 'Stormspire Cannon',
          categoryId: 'primary',
          type: 'Arc Lightning Cannon',
          role: 'Siege Disruptor',
          description:
            'Charges a shard of the Stormspire to unleash chained lightning bursts. Holding the trigger unleashes a siege pulse that detonates shields.',
          stats: {
            damage: 120,
            fireRate: 0.8,
            reloadSpeed: 3.6,
            magazineSize: 1,
            capacity: 12,
            range: 110,
            statusEffect: 'Overcharge (chain lightning)',
            element: 'Lightning',
            staminaCost: 22,
            weight: 'Heavy',
            altFire: 'Siege Pulse (hold for shockwave)',
            cooldown: 12,
          },
          tags: ['Channel', 'AoE', 'Shield Breaker'],
          notes: 'Requires grounding pylons to reach full overcharge potential. Siege pulse VFX to be prototyped.',
          model: {
            path: 'assets/models/primary/stormspire-cannon.glb',
            scale: 1.1,
            position: [0, -0.05, 0],
            rotation: [0, -Math.PI / 8, 0],
            thumbnail: 'assets/textures/primary/stormspire-cannon.png',
          },
          audio: {
            fire: 'assets/audio/weapons/primary/stormspire-cannon-fire.ogg',
            reload: 'assets/audio/weapons/primary/stormspire-cannon-reload.ogg',
          },
        },
      ],
    },
    {
      id: 'secondary',
      label: 'Secondary',
      title: 'Secondary Arsenal',
      description: 'Quick-draw implements that complement primaries with precision or burst control.',
      lore: 'Issued by the Veilwatch, these sidearms slip between realms to bypass mundane armor.',
      defaultWeaponId: 'veilpiercer-pistol',
      theme: {
        primaryColor: '#73d7ff',
        secondaryColor: '#c0f2ff',
        rune: 'Sigil of the Veilwatch',
      },
      weapons: [
        {
          id: 'veilpiercer-pistol',
          name: 'Veilpiercer Pistol',
          categoryId: 'secondary',
          type: 'Phase Pistol',
          role: 'Precision Sidearm',
          description:
            'Fires phase-shifting shots that mark weak points. Activating the mark teleports the wielder behind the target in a flash of voidlight.',
          stats: {
            damage: 42,
            fireRate: 4.6,
            reloadSpeed: 1.3,
            magazineSize: 10,
            capacity: 90,
            criticalChance: 26,
            statusEffect: 'Phase Rupture (armor shred)',
            element: 'Void',
            staminaCost: 6,
            weight: 'Light',
            range: 55,
            altFire: 'Blink Shot (reactivate mark)',
          },
          tags: ['Precision', 'Mobility', 'Void'],
          notes: 'Phase mark indicator UI pending. Teleport destination preview to be added to HUD overlay.',
          model: {
            path: 'assets/models/secondary/veilpiercer-pistol.glb',
            scale: 0.8,
            position: [0.02, -0.04, 0],
            rotation: [0, Math.PI / 5, 0],
            thumbnail: 'assets/textures/secondary/veilpiercer-pistol.png',
          },
          audio: {
            fire: 'assets/audio/weapons/secondary/veilpiercer-fire.ogg',
            reload: 'assets/audio/weapons/secondary/veilpiercer-reload.ogg',
          },
        },
        {
          id: 'glacial-needler',
          name: 'Glacial Needler',
          categoryId: 'secondary',
          type: 'Cryo Burst Pistol',
          role: 'Control Burst',
          description:
            'Vents cryo shards in tri-bursts. Continuous fire layers frostbite stacks that shatter frozen foes.',
          stats: {
            damage: 28,
            fireRate: 8.5,
            burstCount: 3,
            projectileCount: 3,
            reloadSpeed: 2.5,
            magazineSize: 30,
            capacity: 150,
            statusEffect: 'Frostbite (slow 40%)',
            element: 'Frost',
            staminaCost: 9,
            weight: 'Medium',
            range: 60,
          },
          tags: ['Control', 'Frost', 'Burst'],
          notes: 'Needs shader variant for layered frost. Consider additive layering on the 3D model.',
          model: {
            path: 'assets/models/secondary/glacial-needler.glb',
            scale: 0.85,
            position: [0, 0.06, 0],
            rotation: [0, -Math.PI / 6, 0],
            thumbnail: 'assets/textures/secondary/glacial-needler.png',
          },
          audio: {
            fire: 'assets/audio/weapons/secondary/glacial-needler-fire.ogg',
            reload: 'assets/audio/weapons/secondary/glacial-needler-reload.ogg',
          },
        },
      ],
    },
    {
      id: 'melee',
      label: 'Melee',
      title: 'Melee Arsenal',
      description: 'Up-close implements that weave martial prowess with spellcraft.',
      lore: 'Tempered by the Wyvern lords, each blade carries the memory of ancient duels.',
      defaultWeaponId: 'wyrmfang-glaive',
      theme: {
        primaryColor: '#f7a1ff',
        secondaryColor: '#ffd5ff',
        rune: 'Sigil of the Skywyrm',
      },
      weapons: [
        {
          id: 'wyrmfang-glaive',
          name: 'Wyrmfang Glaive',
          categoryId: 'melee',
          type: 'Polearm',
          role: 'Reach Control',
          description:
            'Sweeping polearm crowned with a drake fang. Each third strike unleashes a flame ribbon that extends the combo.',
          stats: {
            damage: 78,
            fireRate: 1.2,
            drawTime: 0.8,
            range: 4,
            statusEffect: 'Bleed (10s)',
            element: 'Draconic Flame',
            staminaCost: 18,
            weight: 'Medium',
            infusion: 'Flame Ribbon (combo finisher)',
          },
          tags: ['Combo', 'Bleed', 'Reach'],
          notes: 'Needs chained animation clips for the flame ribbon extension. Hitstop polish pass pending.',
          model: {
            path: 'assets/models/melee/wyrmfang-glaive.glb',
            scale: 1.35,
            position: [0, 0.35, 0],
            rotation: [0, Math.PI / 10, 0],
            thumbnail: 'assets/textures/melee/wyrmfang-glaive.png',
          },
          audio: {
            swing: 'assets/audio/weapons/melee/wyrmfang-swing.ogg',
            impact: 'assets/audio/weapons/melee/wyrmfang-impact.ogg',
          },
        },
        {
          id: 'starforge-hammer',
          name: 'Starforge Hammer',
          categoryId: 'melee',
          type: 'Warhammer',
          role: 'Breaker',
          description:
            'Collapsed star-iron bound in runic rings. Builds stellar charge that detonates on heavy slam.',
          stats: {
            damage: 142,
            fireRate: 0.7,
            chargeTime: 1.8,
            range: 3,
            statusEffect: 'Stagger (heavy)',
            element: 'Solar',
            staminaCost: 26,
            weight: 'Heavy',
            altFire: 'Meteor Slam (hold to detonate)',
            cooldown: 10,
          },
          tags: ['Impact', 'Solar', 'Crowd Control'],
          notes: 'Requires screen shake tuning on Meteor Slam. Radiant cracks shader to be authored.',
          model: {
            path: 'assets/models/melee/starforge-hammer.glb',
            scale: 1.25,
            position: [0, 0.4, 0],
            rotation: [0, -Math.PI / 12, 0],
            thumbnail: 'assets/textures/melee/starforge-hammer.png',
          },
          audio: {
            swing: 'assets/audio/weapons/melee/starforge-swing.ogg',
            impact: 'assets/audio/weapons/melee/starforge-impact.ogg',
          },
        },
      ],
    },
    {
      id: 'utility',
      label: 'Utility',
      title: 'Utility Arsenal',
      description: 'Tools and relics that bend the flow of battle—control space, bolster allies, or manipulate time itself.',
      lore: 'Concocted by the Chronomancers, these devices trade raw damage for tactical mastery.',
      defaultWeaponId: 'chronoweave-bomb',
      theme: {
        primaryColor: '#7df7c1',
        secondaryColor: '#c4ffe7',
        rune: 'Sigil of the Chronomancer',
      },
      weapons: [
        {
          id: 'chronoweave-bomb',
          name: 'Chronoweave Bomb',
          categoryId: 'utility',
          type: 'Temporal Charge',
          role: 'Area Control',
          description:
            'Detonates a temporal weave that slows enemies and accelerates ally cooldowns within the sphere.',
          stats: {
            damage: 35,
            projectileCount: 5,
            cooldown: 18,
            capacity: 3,
            utilityEffect: 'Temporal Snare (slow 50%)',
            element: 'Arcane',
            weight: 'Light',
          },
          tags: ['Control', 'Support', 'Temporal'],
          notes: 'Needs ripple shader for temporal field. Cooldown reduction aura to be exposed as aura data.',
          model: {
            path: 'assets/models/utility/chronoweave-bomb.glb',
            scale: 0.75,
            position: [0, -0.1, 0],
            rotation: [0, Math.PI / 4, 0],
            thumbnail: 'assets/textures/utility/chronoweave-bomb.png',
          },
          audio: {
            trigger: 'assets/audio/weapons/utility/chronoweave-trigger.ogg',
            detonate: 'assets/audio/weapons/utility/chronoweave-detonate.ogg',
          },
        },
        {
          id: 'aether-bolster-kit',
          name: 'Aether Bolster Kit',
          categoryId: 'utility',
          type: 'Support Relic',
          role: 'Restoration',
          description:
            'Deploys a hovering sigil that overclocks allied warding. Projects a barrier dome that regenerates shields over time.',
          stats: {
            utilityEffect: 'Restores 45 shields over 8s',
            cooldown: 22,
            capacity: 2,
            castTime: 1.4,
            concentrationCost: 35,
            element: 'Aether',
            weight: 'Medium',
          },
          tags: ['Support', 'Barrier', 'Aether'],
          notes: 'Requires channel animation set. Shield regen numbers to be synced with balance sheet.',
          model: {
            path: 'assets/models/utility/aether-bolster-kit.glb',
            scale: 0.82,
            position: [0, -0.08, 0],
            rotation: [0, -Math.PI / 6, 0],
            thumbnail: 'assets/textures/utility/aether-bolster-kit.png',
          },
          audio: {
            activate: 'assets/audio/weapons/utility/aether-bolster-activate.ogg',
            sustain: 'assets/audio/weapons/utility/aether-bolster-sustain.ogg',
          },
        },
      ],
    },
  ],
};

export class WeaponRepository {
  constructor(data = weaponData) {
    this.data = data;
    this.categoryMap = new Map();
    this.weaponMap = new Map();
    this.#indexData();
  }

  #indexData() {
    for (const category of this.data.categories) {
      this.categoryMap.set(category.id, category);
      if (!Array.isArray(category.weapons)) {
        category.weapons = [];
      }
      for (const weapon of category.weapons) {
        if (!weapon.categoryId) {
          weapon.categoryId = category.id;
        }
        this.weaponMap.set(weapon.id, weapon);
      }
    }
  }

  getCategories() {
    return this.data.categories;
  }

  getDefaultCategory() {
    return this.data.categories[0] || null;
  }

  findCategory(categoryId) {
    return this.categoryMap.get(categoryId) || null;
  }

  findWeapon(weaponId) {
    return this.weaponMap.get(weaponId) || null;
  }

  getDefaultWeaponByCategory(categoryId) {
    const category = this.findCategory(categoryId);
    if (!category || !category.weapons.length) {
      return null;
    }
    if (category.defaultWeaponId) {
      const defaultWeapon = this.findWeapon(category.defaultWeaponId);
      if (defaultWeapon) {
        return defaultWeapon;
      }
    }
    return category.weapons[0];
  }
}
