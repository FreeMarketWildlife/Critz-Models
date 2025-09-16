export const WeaponStatSchema = [
  {
    id: 'combatProfile',
    title: 'Combat Profile',
    fields: [
      { key: 'damage', label: 'Damage' },
      { key: 'fireRate', label: 'Fire Rate', format: 'rate' },
      { key: 'burstCount', label: 'Burst Count' },
      { key: 'projectileCount', label: 'Projectiles' },
      { key: 'range', label: 'Effective Range', suffix: 'm' },
      { key: 'criticalChance', label: 'Critical Chance', suffix: '%' },
      { key: 'statusEffect', label: 'Status Effect' },
    ],
  },
  {
    id: 'handling',
    title: 'Handling',
    fields: [
      { key: 'reloadSpeed', label: 'Reload Speed', format: 'time' },
      { key: 'drawTime', label: 'Draw Time', format: 'time' },
      { key: 'castTime', label: 'Cast Time', format: 'time' },
      { key: 'staminaCost', label: 'Stamina Cost' },
      { key: 'concentrationCost', label: 'Concentration Cost' },
      { key: 'weight', label: 'Weight' },
    ],
  },
  {
    id: 'capacity',
    title: 'Capacity & Supply',
    fields: [
      { key: 'magazineSize', label: 'Magazine Size' },
      { key: 'quiverCapacity', label: 'Quiver Capacity' },
      { key: 'capacity', label: 'Total Capacity' },
      { key: 'cooldown', label: 'Cooldown', format: 'time' },
      { key: 'chargeTime', label: 'Charge Time', format: 'time' },
    ],
  },
  {
    id: 'infusions',
    title: 'Infusions & Elementals',
    fields: [
      { key: 'element', label: 'Element' },
      { key: 'infusion', label: 'Infusion' },
      { key: 'altFire', label: 'Alt Fire' },
      { key: 'utilityEffect', label: 'Utility Effect' },
    ],
  },
];

export const WeaponSchemaKeySet = new Set(
  WeaponStatSchema.flatMap((group) => group.fields.map((field) => field.key)),
);
