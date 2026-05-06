const createElement = (tag, className, textContent) => {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (textContent !== undefined) {
    element.textContent = textContent;
  }
  return element;
};

const serializeSettingValue = (value) => {
  if (typeof value === 'boolean') {
    return `bool:${value}`;
  }

  if (typeof value === 'number') {
    return `num:${value}`;
  }

  return `str:${value}`;
};

const deserializeSettingValue = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  if (value.startsWith('bool:')) {
    return value === 'bool:true';
  }

  if (value.startsWith('num:')) {
    return Number(value.slice(4));
  }

  if (value.startsWith('str:')) {
    return value.slice(4);
  }

  return value;
};

const DEFAULT_MENU_OPTIONS = [
  { id: 'singleplayer', label: 'Singleplayer' },
  { id: 'multiplayer', label: 'Multiplayer' },
  { id: 'options', label: 'Options' },
  { id: 'profile', label: 'Profile' },
];

const DEFAULT_PROFILES = [
  { id: 'arpit', label: 'Arpit' },
  { id: 'balaji', label: 'Balaji' },
  { id: 'fabian', label: 'Fabian' },
  { id: 'phil', label: 'Phil' },
];

const DEFAULT_SETTINGS_TABS = [
  { id: 'gameplay', label: 'Gameplay' },
  { id: 'video', label: 'Video' },
  { id: 'audio', label: 'Audio' },
  { id: 'keybinds', label: 'Keybinds' },
];

const DEFAULT_PROFILE_MENU_OPTIONS = [
  { id: 'avatar', label: 'Avatar' },
  { id: 'career', label: 'Career' },
  { id: 'cosmetics', label: 'Cosmetics' },
  { id: 'loadouts', label: 'Loadouts' },
];

const ON_OFF_OPTIONS = [
  { value: true, label: 'On' },
  { value: false, label: 'Off' },
];

const HOLD_TOGGLE_OPTIONS = [
  { value: 'hold', label: 'Hold' },
  { value: 'toggle', label: 'Toggle' },
];

const PERSPECTIVE_OPTIONS = [
  { value: 'third-person', label: 'Third Person' },
  { value: 'first-person', label: 'First Person' },
];

const ELIMINATION_BROADCAST_OPTIONS = [
  { value: 'all', label: 'All Eliminations' },
  { value: 'yours', label: 'Your Eliminations' },
  { value: 'off', label: 'Off' },
];

const DISPLAY_MODE_OPTIONS = [
  { value: 'fullscreen', label: 'Fullscreen' },
  { value: 'windowed', label: 'Windowed' },
  { value: 'borderless', label: 'Borderless' },
];

const RESOLUTION_OPTIONS = [
  { value: '1280x720', label: '1280 x 720' },
  { value: '1600x900', label: '1600 x 900' },
  { value: '1920x1080', label: '1920 x 1080' },
  { value: '2560x1440', label: '2560 x 1440' },
];

const FRAME_RATE_OPTIONS = [
  { value: '30', label: '30' },
  { value: '60', label: '60' },
  { value: '90', label: '90' },
  { value: '120', label: '120' },
  { value: '144', label: '144' },
  { value: 'uncapped', label: 'Uncapped' },
];

const QUALITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'ultra', label: 'Ultra' },
];

const VIEW_DISTANCE_OPTIONS = [
  { value: 'medium', label: 'Medium' },
  { value: 'far', label: 'Far' },
  { value: 'very-far', label: 'Very Far' },
  { value: 'extreme', label: 'Extreme' },
];

const ANTI_ALIASING_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'fxaa', label: 'FXAA' },
  { value: 'taa', label: 'TAA' },
];

const UPSCALING_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'dlss', label: 'DLSS' },
  { value: 'fsr', label: 'FSR' },
];

const DYNAMIC_RANGE_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const KEYBINDS_DEFAULT = {
  Movement: {
    MoveForward: 'W',
    MoveBackward: 'S',
    MoveLeft: 'A',
    MoveRight: 'D',
    Jump: 'Space',
    Sprint: 'LeftShift',
    Crouch: 'LeftCtrl',
    Slide: 'C',
  },
  Combat: {
    Fire: 'LeftMouseButton',
    AimDownSights: 'RightMouseButton',
    Reload: 'R',
    Melee: 'V',
    PrimaryWeapon: '1',
    SecondaryWeapon: '2',
    UtilityWeapon: '3',
    SwapWeapon: 'MouseWheel',
  },
  Abilities: {
    Ability1: 'Q',
    Ability2: 'E',
    Utility: 'F',
    Ultimate: 'X',
  },
  Interaction: {
    Interact: 'E',
    Pickup: 'F',
    DropItem: 'G',
    Ping: 'MiddleMouseButton',
  },
  View: {
    TogglePerspective: 'V',
    ShoulderSwap: 'Z',
    Scoreboard: 'Tab',
    Map: 'M',
  },
  Communication: {
    PushToTalk: 'T',
    TeamChat: 'Y',
  },
};

const formatBindingLabel = (value = '') =>
  String(value)
    .replace(/LeftMouseButton/g, 'Left Mouse')
    .replace(/RightMouseButton/g, 'Right Mouse')
    .replace(/MiddleMouseButton/g, 'Middle Mouse')
    .replace(/MouseWheel/g, 'Mouse Wheel')
    .replace(/LeftShift/g, 'Left Shift')
    .replace(/LeftCtrl/g, 'Left Ctrl');

const formatActionLabel = (value = '') => {
  const normalized = String(value)
    .replace(/AimDownSights/g, 'Aim Down Sights')
    .replace(/PushToTalk/g, 'Push To Talk')
    .replace(/TeamChat/g, 'Team Chat')
    .replace(/ShoulderSwap/g, 'Shoulder Swap')
    .replace(/TogglePerspective/g, 'Toggle Perspective')
    .replace(/SwapWeapon/g, 'Swap Weapon')
    .replace(/PrimaryWeapon/g, 'Primary Weapon')
    .replace(/SecondaryWeapon/g, 'Secondary Weapon')
    .replace(/UtilityWeapon/g, 'Utility Weapon')
    .replace(/DropItem/g, 'Drop Item')
    .replace(/MoveForward/g, 'Move Forward')
    .replace(/MoveBackward/g, 'Move Backward')
    .replace(/MoveLeft/g, 'Move Left')
    .replace(/MoveRight/g, 'Move Right');

  return normalized
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Za-z])([0-9])/g, '$1 $2');
};

const buildKeybindGroups = () =>
  Object.entries(KEYBINDS_DEFAULT).map(([groupTitle, bindings]) => ({
    title: groupTitle,
    rows: Object.entries(bindings).map(([action, binding]) => ({
      type: 'keybind',
      label: formatActionLabel(action),
      keys: [formatBindingLabel(binding)],
    })),
  }));

const DEFAULT_SETTINGS = {
  tutorialTips: true,
  fov: 90,
  defaultPerspective: 'third-person',
  aimDownSightToggle: false,
  damageNumbers: true,
  eliminationBroadcast: 'all',
  sprintMode: 'hold',
  autoReload: true,
  displayMode: 'fullscreen',
  resolution: '1920x1080',
  frameRateLimit: '120',
  textureQuality: 'high',
  shadowQuality: 'high',
  effectsQuality: 'high',
  foliageDensity: 'high',
  viewDistance: 'very-far',
  motionBlur: false,
  vSync: true,
  antiAliasing: 'taa',
  upscaling: 'off',
  masterVolume: 80,
  musicVolume: 56,
  sfxVolume: 78,
  voiceVolume: 68,
  hitmarkerVolume: 72,
  footstepVolume: 66,
  weaponVolume: 80,
  spatialAudio: true,
  dynamicRange: 'high',
};

const SETTINGS_LAYOUT = {
  gameplay: {
    groups: [
      {
        title: null,
        rows: [
          {
            key: 'tutorialTips',
            label: 'Tutorial Tips',
            control: 'segmented',
            options: ON_OFF_OPTIONS,
          },
        ],
      },
      {
        title: 'Perspective',
        rows: [
          {
            key: 'fov',
            label: 'FOV Slider',
            control: 'slider',
            min: 60,
            max: 120,
            step: 1,
            scaleLabels: ['60', '90', '120'],
            formatValue: (value) => `${value}°`,
          },
          {
            key: 'defaultPerspective',
            label: 'Default Perspective',
            control: 'segmented',
            options: PERSPECTIVE_OPTIONS,
          },
          {
            key: 'aimDownSightToggle',
            label: 'Aim Down Sight Toggle',
            control: 'segmented',
            options: ON_OFF_OPTIONS,
          },
        ],
      },
      {
        title: 'Combat',
        rows: [
          {
            key: 'damageNumbers',
            label: 'Damage Numbers',
            control: 'segmented',
            options: ON_OFF_OPTIONS,
          },
          {
            key: 'eliminationBroadcast',
            label: 'Elimination Broadcast',
            control: 'segmented',
            options: ELIMINATION_BROADCAST_OPTIONS,
          },
        ],
      },
      {
        title: 'Movement',
        rows: [
          {
            key: 'sprintMode',
            label: 'Sprint',
            control: 'segmented',
            options: HOLD_TOGGLE_OPTIONS,
          },
          {
            key: 'autoReload',
            label: 'Auto Reload',
            control: 'segmented',
            options: ON_OFF_OPTIONS,
          },
        ],
      },
    ],
  },
  video: {
    groups: [
      {
        title: 'Display',
        rows: [
          {
            key: 'displayMode',
            label: 'Display Mode',
            control: 'segmented',
            options: DISPLAY_MODE_OPTIONS,
          },
          {
            key: 'resolution',
            label: 'Resolution',
            control: 'segmented',
            options: RESOLUTION_OPTIONS,
          },
          {
            key: 'frameRateLimit',
            label: 'Frame Rate Limit',
            control: 'segmented',
            options: FRAME_RATE_OPTIONS,
          },
        ],
      },
      {
        title: 'Graphics',
        rows: [
          {
            key: 'textureQuality',
            label: 'Texture Quality',
            control: 'segmented',
            options: QUALITY_OPTIONS,
          },
          {
            key: 'shadowQuality',
            label: 'Shadow Quality',
            control: 'segmented',
            options: QUALITY_OPTIONS,
          },
          {
            key: 'effectsQuality',
            label: 'Effects Quality',
            control: 'segmented',
            options: QUALITY_OPTIONS,
          },
          {
            key: 'foliageDensity',
            label: 'Foliage Density',
            control: 'segmented',
            options: QUALITY_OPTIONS,
          },
          {
            key: 'viewDistance',
            label: 'View Distance',
            control: 'segmented',
            options: VIEW_DISTANCE_OPTIONS,
          },
        ],
      },
      {
        title: 'Advanced',
        rows: [
          {
            key: 'motionBlur',
            label: 'Motion Blur',
            control: 'segmented',
            options: ON_OFF_OPTIONS,
          },
          {
            key: 'vSync',
            label: 'VSync',
            control: 'segmented',
            options: ON_OFF_OPTIONS,
          },
          {
            key: 'antiAliasing',
            label: 'Anti-Aliasing',
            control: 'segmented',
            options: ANTI_ALIASING_OPTIONS,
          },
          {
            key: 'upscaling',
            label: 'Upscaling',
            control: 'segmented',
            options: UPSCALING_OPTIONS,
          },
        ],
      },
    ],
  },
  audio: {
    groups: [
      {
        title: 'Volume',
        rows: [
          {
            key: 'masterVolume',
            label: 'Master Volume',
            control: 'slider',
            min: 0,
            max: 100,
            step: 1,
            scaleLabels: ['0', '50', '100'],
            formatValue: (value) => `${value}%`,
          },
          {
            key: 'musicVolume',
            label: 'Music Volume',
            control: 'slider',
            min: 0,
            max: 100,
            step: 1,
            scaleLabels: ['0', '50', '100'],
            formatValue: (value) => `${value}%`,
          },
          {
            key: 'sfxVolume',
            label: 'SFX Volume',
            control: 'slider',
            min: 0,
            max: 100,
            step: 1,
            scaleLabels: ['0', '50', '100'],
            formatValue: (value) => `${value}%`,
          },
          {
            key: 'voiceVolume',
            label: 'Voice / Announcer Volume',
            control: 'slider',
            min: 0,
            max: 100,
            step: 1,
            scaleLabels: ['0', '50', '100'],
            formatValue: (value) => `${value}%`,
          },
        ],
      },
      {
        title: 'Gameplay Audio',
        rows: [
          {
            key: 'hitmarkerVolume',
            label: 'Hitmarker Sound Volume',
            control: 'slider',
            min: 0,
            max: 100,
            step: 1,
            scaleLabels: ['0', '50', '100'],
            formatValue: (value) => `${value}%`,
          },
          {
            key: 'footstepVolume',
            label: 'Footstep Volume',
            control: 'slider',
            min: 0,
            max: 100,
            step: 1,
            scaleLabels: ['0', '50', '100'],
            formatValue: (value) => `${value}%`,
          },
          {
            key: 'weaponVolume',
            label: 'Weapon Volume',
            control: 'slider',
            min: 0,
            max: 100,
            step: 1,
            scaleLabels: ['0', '50', '100'],
            formatValue: (value) => `${value}%`,
          },
        ],
      },
      {
        title: 'Advanced',
        rows: [
          {
            key: 'spatialAudio',
            label: 'Spatial Audio',
            control: 'segmented',
            options: ON_OFF_OPTIONS,
          },
          {
            key: 'dynamicRange',
            label: 'Dynamic Range',
            control: 'segmented',
            options: DYNAMIC_RANGE_OPTIONS,
          },
        ],
      },
    ],
  },
  keybinds: {
    groups: buildKeybindGroups(),
  },
};

const SETTINGS_CONTROL_INDEX = new Map();

Object.values(SETTINGS_LAYOUT).forEach((tab) => {
  tab.groups.forEach((group) => {
    group.rows.forEach((row) => {
      if (row.key) {
        SETTINGS_CONTROL_INDEX.set(row.key, row);
      }
    });
  });
});

const AMBIENT_MOTES = [
  { x: '12%', y: '12%', size: '10px', delay: '0s', duration: '5.2s' },
  { x: '24%', y: '20%', size: '7px', delay: '1.1s', duration: '6.5s' },
  { x: '39%', y: '14%', size: '12px', delay: '0.5s', duration: '7.2s' },
  { x: '58%', y: '10%', size: '8px', delay: '2.2s', duration: '6.9s' },
  { x: '70%', y: '25%', size: '9px', delay: '0.8s', duration: '7.4s' },
  { x: '83%', y: '18%', size: '6px', delay: '1.6s', duration: '5.7s' },
  { x: '18%', y: '72%', size: '8px', delay: '2.4s', duration: '6.3s' },
  { x: '77%', y: '68%', size: '10px', delay: '0.3s', duration: '7.9s' },
];

export class DesignShowcaseView {
  constructor({ element, onSelect = null }) {
    this.element = element;
    this.onSelect = onSelect;
    this.item = null;
    this.sceneElement = null;
    this.resizeObserver = null;
    this.brandAnchorElement = null;
    this.menuPanelElement = null;
    this.profilePanelElement = null;
    this.settingsPanelElement = null;
    this.profileMenuPanelElement = null;
    this.settingsTabsElement = null;
    this.settingsContentElement = null;
    this.optionsBackButtonElement = null;
    this.profileActionsElement = null;
    this.profileMenuPickerElement = null;
    this.profileBackButtonElement = null;
    this.profileChangeButtonElement = null;
    this.actionButtons = new Map();
    this.profileButtons = new Map();
    this.settingsTabButtons = new Map();
    this.profileMenuButtons = new Map();
    this.activationTimers = new Map();
    this.state = {
      selectedOptionId: null,
      selectedProfileId: 'phil',
      activeView: 'main',
      activeSettingsTab: 'gameplay',
      activeProfileMenuId: 'avatar',
      isProfilePickerOpen: false,
      settingsValues: this.buildDefaultSettings(),
    };
  }

  render(item) {
    const defaultProfileId = this.getDefaultProfileId(item);
    const defaultSettingsTab = this.getDefaultSettingsTab(item);
    const defaultProfileMenuId = this.getDefaultProfileMenuId(item);

    this.item = item || null;
    this.state = {
      selectedOptionId: null,
      selectedProfileId: defaultProfileId,
      activeView: 'main',
      activeSettingsTab: defaultSettingsTab,
      activeProfileMenuId: defaultProfileMenuId,
      isProfilePickerOpen: false,
      settingsValues: this.buildDefaultSettings(item),
    };
    this.clearActivationTimers();
    this.teardownResizeObserver();
    this.actionButtons.clear();
    this.profileButtons.clear();
    this.settingsTabButtons.clear();
    this.profileMenuButtons.clear();
    this.sceneElement = null;
    this.brandAnchorElement = null;
    this.menuPanelElement = null;
    this.profilePanelElement = null;
    this.settingsPanelElement = null;
    this.profileMenuPanelElement = null;
    this.settingsTabsElement = null;
    this.settingsContentElement = null;
    this.optionsBackButtonElement = null;
    this.profileActionsElement = null;
    this.profileMenuPickerElement = null;
    this.profileBackButtonElement = null;
    this.profileChangeButtonElement = null;

    if (!this.element) {
      return;
    }

    this.element.innerHTML = '';

    if (!item) {
      return;
    }

    if (item.viewType === 'main-menu-sim') {
      this.renderMainMenu(item);
      return;
    }

    this.renderFallback(item);
  }

  renderFallback(item) {
    const article = createElement('article', 'design-showcase design-showcase--fallback');
    article.append(
      createElement('p', 'design-showcase__eyebrow', item.footer || 'Design'),
      createElement('h3', 'design-showcase__title', item.title || item.label || 'Design'),
      createElement(
        'p',
        'design-showcase__copy',
        item.description || 'A design simulation has not been authored for this entry yet.'
      )
    );
    this.element.appendChild(article);
  }

  renderMainMenu(item) {
    const options = Array.isArray(item.options) && item.options.length ? item.options : DEFAULT_MENU_OPTIONS;
    const settingsTabs = this.getSettingsTabs(item);
    const profileMenuOptions = this.getProfileMenuOptions(item);

    const board = createElement('section', 'design-showcase design-showcase--main-menu');
    const scene = createElement('div', 'design-main-menu');
    scene.style.setProperty('--design-firefly-x', '148px');
    scene.style.setProperty('--design-firefly-y', '164px');
    this.sceneElement = scene;

    scene.innerHTML = `
      <div class="design-main-menu__backdrop" aria-hidden="true">
        <div class="design-main-menu__sun"></div>
        <div class="design-main-menu__canopy design-main-menu__canopy--left"></div>
        <div class="design-main-menu__canopy design-main-menu__canopy--right"></div>
        <div class="design-main-menu__mist"></div>
        <div class="design-main-menu__citadel">
          <span class="design-main-menu__citadel-spire design-main-menu__citadel-spire--left"></span>
          <span class="design-main-menu__citadel-spire design-main-menu__citadel-spire--main"></span>
          <span class="design-main-menu__citadel-spire design-main-menu__citadel-spire--right"></span>
          <span class="design-main-menu__citadel-banner design-main-menu__citadel-banner--main"></span>
          <span class="design-main-menu__citadel-banner design-main-menu__citadel-banner--side"></span>
        </div>
        <div class="design-main-menu__path"></div>
        <div class="design-main-menu__traveler">
          <span class="design-main-menu__traveler-ear design-main-menu__traveler-ear--left"></span>
          <span class="design-main-menu__traveler-ear design-main-menu__traveler-ear--right"></span>
          <span class="design-main-menu__traveler-pack"></span>
          <span class="design-main-menu__traveler-map"></span>
        </div>
        <div class="design-main-menu__lantern"></div>
        <div class="design-main-menu__mushrooms design-main-menu__mushrooms--left">
          <span></span><span></span><span></span>
        </div>
        <div class="design-main-menu__mushrooms design-main-menu__mushrooms--right">
          <span></span><span></span>
        </div>
        <div class="design-main-menu__flowers design-main-menu__flowers--left"></div>
        <div class="design-main-menu__flowers design-main-menu__flowers--center"></div>
        <div class="design-main-menu__motes" data-role="ambient-motes"></div>
      </div>
      <div class="design-main-menu__layout">
        <div class="design-main-menu__menu">
          <div class="design-main-menu__panel design-main-menu__panel--menu" data-role="menu-panel">
            <header class="design-main-menu__brand" data-role="design-brand">
              <div class="design-main-menu__logo-wrap">
                <div class="design-main-menu__logo-plate">
                  <span class="design-main-menu__logo-bug"></span>
                  <h2 class="design-main-menu__logo">CRITZ</h2>
                </div>
              </div>
            </header>
            <div class="design-main-menu__actions" data-role="menu-actions"></div>
            <div class="design-main-menu__profile-panel" data-role="profile-panel">
              <div class="design-main-menu__profile-list" data-role="profile-list"></div>
            </div>
          </div>
          <section class="design-main-menu__panel design-main-menu__panel--settings design-settings" data-role="settings-panel" aria-hidden="true">
            <header class="design-settings__header">
              <button class="design-settings__back" type="button" data-role="options-back">Back</button>
              <h3 class="design-settings__title">Options</h3>
            </header>
            <div class="design-settings__shell">
              <nav class="design-settings__tabs" data-role="settings-tabs" aria-label="Options sections"></nav>
              <div class="design-settings__content-frame">
                <div class="design-settings__content" data-role="settings-content"></div>
              </div>
            </div>
          </section>
          <section class="design-main-menu__panel design-main-menu__panel--profile design-profile" data-role="profile-menu-panel" aria-hidden="true">
            <header class="design-settings__header">
              <button class="design-settings__back" type="button" data-role="profile-back">Back</button>
              <h3 class="design-settings__title">Profile</h3>
            </header>
            <div class="design-profile__body">
              <div class="design-profile__actions" data-role="profile-actions"></div>
              <div class="design-profile__footer">
                <div class="design-profile__picker" data-role="profile-picker" aria-hidden="true">
                  <div class="design-profile__picker-list" data-role="profile-picker-list"></div>
                </div>
                <button class="design-profile__change-button" type="button" data-role="profile-change">Change Profile</button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div class="design-main-menu__firefly" data-role="menu-firefly">
        <span class="design-main-menu__firefly-core"></span>
      </div>
    `;

    const actionsElement = scene.querySelector('[data-role="menu-actions"]');
    const motesElement = scene.querySelector('[data-role="ambient-motes"]');
    this.brandAnchorElement = scene.querySelector('[data-role="design-brand"]');
    this.menuPanelElement = scene.querySelector('[data-role="menu-panel"]');
    this.profilePanelElement = scene.querySelector('[data-role="profile-panel"]');
    this.settingsPanelElement = scene.querySelector('[data-role="settings-panel"]');
    this.profileMenuPanelElement = scene.querySelector('[data-role="profile-menu-panel"]');
    this.settingsTabsElement = scene.querySelector('[data-role="settings-tabs"]');
    this.settingsContentElement = scene.querySelector('[data-role="settings-content"]');
    this.optionsBackButtonElement = scene.querySelector('[data-role="options-back"]');
    this.profileActionsElement = scene.querySelector('[data-role="profile-actions"]');
    this.profileMenuPickerElement = scene.querySelector('[data-role="profile-picker"]');
    this.profileBackButtonElement = scene.querySelector('[data-role="profile-back"]');
    this.profileChangeButtonElement = scene.querySelector('[data-role="profile-change"]');
    const profileListElement = scene.querySelector('[data-role="profile-picker-list"]');

    if (motesElement) {
      AMBIENT_MOTES.forEach((mote) => {
        const particle = createElement('span', 'design-main-menu__mote');
        particle.style.setProperty('--mote-x', mote.x);
        particle.style.setProperty('--mote-y', mote.y);
        particle.style.setProperty('--mote-size', mote.size);
        particle.style.setProperty('--mote-delay', mote.delay);
        particle.style.setProperty('--mote-duration', mote.duration);
        motesElement.appendChild(particle);
      });
    }

    options.forEach((option) => {
      const button = createElement('button', 'design-main-menu__action');
      button.type = 'button';
      button.dataset.optionId = option.id;

      const ornament = createElement('span', 'design-main-menu__action-ornament');
      ornament.setAttribute('aria-hidden', 'true');

      button.append(ornament, createElement('span', 'design-main-menu__action-label', option.label));

      button.addEventListener('mouseenter', () => this.handleOptionHover(button));
      button.addEventListener('focus', () => this.handleOptionHover(button));
      button.addEventListener('mouseleave', () => this.handleOptionLeave());
      button.addEventListener('blur', () => this.handleOptionLeave());
      button.addEventListener('click', () => this.handleOptionClick(button, option));

      actionsElement?.appendChild(button);
      this.actionButtons.set(option.id, button);
    });

    const profiles =
      Array.isArray(item.profiles) && item.profiles.length ? item.profiles : DEFAULT_PROFILES;

    profiles.forEach((profile) => {
      const button = createElement('button', 'design-main-menu__profile-button', profile.label);
      button.type = 'button';
      button.dataset.profileId = profile.id;
      button.addEventListener('mouseenter', () =>
        this.moveFireflyToElement(button, { offsetX: -28, offsetY: 14 })
      );
      button.addEventListener('focus', () =>
        this.moveFireflyToElement(button, { offsetX: -28, offsetY: 14 })
      );
      button.addEventListener('mouseleave', () => this.restoreFireflyAnchor());
      button.addEventListener('blur', () => this.restoreFireflyAnchor());
      button.addEventListener('click', () => this.handleProfileSelect(profile));
      profileListElement?.appendChild(button);
      this.profileButtons.set(profile.id, button);
    });

    settingsTabs.forEach((tab) => {
      const button = createElement('button', 'design-settings__tab', tab.label);
      button.type = 'button';
      button.dataset.settingsTabId = tab.id;
      button.addEventListener('mouseenter', () =>
        this.moveFireflyToElement(button, { offsetX: -28, offsetY: 10 })
      );
      button.addEventListener('focus', () =>
        this.moveFireflyToElement(button, { offsetX: -28, offsetY: 10 })
      );
      button.addEventListener('mouseleave', () => this.restoreFireflyAnchor());
      button.addEventListener('blur', () => this.restoreFireflyAnchor());
      button.addEventListener('click', () => this.handleSettingsTabSelect(button, tab.id));
      this.settingsTabsElement?.appendChild(button);
      this.settingsTabButtons.set(tab.id, button);
    });

    profileMenuOptions.forEach((option) => {
      const button = createElement(
        'button',
        'design-settings__tab design-settings__tab--profile',
        option.label
      );
      button.type = 'button';
      button.dataset.profileMenuId = option.id;
      button.addEventListener('mouseenter', () =>
        this.moveFireflyToElement(button, { offsetX: -28, offsetY: 10 })
      );
      button.addEventListener('focus', () =>
        this.moveFireflyToElement(button, { offsetX: -28, offsetY: 10 })
      );
      button.addEventListener('mouseleave', () => this.restoreFireflyAnchor());
      button.addEventListener('blur', () => this.restoreFireflyAnchor());
      button.addEventListener('click', () => this.handleProfileMenuSelect(button, option));
      this.profileActionsElement?.appendChild(button);
      this.profileMenuButtons.set(option.id, button);
    });

    this.optionsBackButtonElement?.addEventListener('mouseenter', () =>
      this.moveFireflyToElement(this.optionsBackButtonElement, { offsetX: -28, offsetY: 8 })
    );
    this.optionsBackButtonElement?.addEventListener('focus', () =>
      this.moveFireflyToElement(this.optionsBackButtonElement, { offsetX: -28, offsetY: 8 })
    );
    this.optionsBackButtonElement?.addEventListener('mouseleave', () => this.restoreFireflyAnchor());
    this.optionsBackButtonElement?.addEventListener('blur', () => this.restoreFireflyAnchor());
    this.optionsBackButtonElement?.addEventListener('click', () => this.handleOptionsBack());

    this.profileBackButtonElement?.addEventListener('mouseenter', () =>
      this.moveFireflyToElement(this.profileBackButtonElement, { offsetX: -28, offsetY: 8 })
    );
    this.profileBackButtonElement?.addEventListener('focus', () =>
      this.moveFireflyToElement(this.profileBackButtonElement, { offsetX: -28, offsetY: 8 })
    );
    this.profileBackButtonElement?.addEventListener('mouseleave', () => this.restoreFireflyAnchor());
    this.profileBackButtonElement?.addEventListener('blur', () => this.restoreFireflyAnchor());
    this.profileBackButtonElement?.addEventListener('click', () => this.handleProfileBack());

    this.profileChangeButtonElement?.addEventListener('mouseenter', () =>
      this.moveFireflyToElement(this.profileChangeButtonElement, { offsetX: -28, offsetY: 8 })
    );
    this.profileChangeButtonElement?.addEventListener('focus', () =>
      this.moveFireflyToElement(this.profileChangeButtonElement, { offsetX: -28, offsetY: 8 })
    );
    this.profileChangeButtonElement?.addEventListener('mouseleave', () => this.restoreFireflyAnchor());
    this.profileChangeButtonElement?.addEventListener('blur', () => this.restoreFireflyAnchor());
    this.profileChangeButtonElement?.addEventListener('click', () => this.handleProfileChangeToggle());

    this.renderSettingsContent();

    board.appendChild(scene);
    this.element.appendChild(board);
    this.setupResponsiveObserver();

    requestAnimationFrame(() => {
      this.syncResponsiveMode();
      this.syncSelectedOption();
      this.syncSelectedProfile();
      this.syncSettingsTabs();
      this.syncProfileMenuOptions();
      this.syncProfilePanel();
      this.syncProfilePicker();
      this.syncViewState();
      this.syncSettingsControlStates();
      this.restoreFireflyAnchor();
    });
  }

  handleOptionHover(button) {
    this.moveFireflyToElement(button, { offsetX: -28, offsetY: 16 });
  }

  handleOptionLeave() {
    this.restoreFireflyAnchor();
  }

  handleOptionClick(button, option) {
    this.state.selectedOptionId = option.id;

    if (option.id === 'options') {
      this.state.activeView = 'options';
      this.state.activeSettingsTab = this.getDefaultSettingsTab(this.item);
      this.renderSettingsContent();
      this.state.isProfilePickerOpen = false;
    } else if (option.id === 'profile') {
      this.state.activeView = 'profile';
      this.state.activeProfileMenuId = this.getDefaultProfileMenuId(this.item);
      this.state.isProfilePickerOpen = false;
    } else {
      this.state.activeView = 'main';
      this.state.isProfilePickerOpen = false;
    }

    this.syncSelectedOption();
    this.syncProfilePanel();
    this.syncViewState();
    this.animateActivation(button, `menu:${option.id}`);
    this.moveFireflyToElement(button, { offsetX: -28, offsetY: 16 });

    this.onSelect?.({
      type: 'design-action',
      item: this.item,
      action: option,
    });
  }

  handleOptionsBack() {
    this.state.activeView = 'main';
    this.state.selectedOptionId = null;
    this.state.isProfilePickerOpen = false;
    this.syncSelectedOption();
    this.syncProfilePanel();
    this.syncProfilePicker();
    this.syncViewState();
    this.restoreFireflyAnchor();
  }

  handleProfileBack() {
    this.state.activeView = 'main';
    this.state.selectedOptionId = null;
    this.state.isProfilePickerOpen = false;
    this.syncSelectedOption();
    this.syncProfilePanel();
    this.syncProfilePicker();
    this.syncViewState();
    this.restoreFireflyAnchor();
  }

  syncSelectedOption() {
    this.actionButtons.forEach((button, optionId) => {
      const isSelected = optionId === this.state.selectedOptionId;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
  }

  handleProfileSelect(profile) {
    this.state.selectedProfileId = profile.id;
    this.state.isProfilePickerOpen = false;
    this.syncSelectedProfile();
    this.syncProfilePicker();
    this.animateActivation(this.profileButtons.get(profile.id), `profile:${profile.id}`);
  }

  syncSelectedProfile() {
    this.profileButtons.forEach((button, profileId) => {
      const isSelected = profileId === this.state.selectedProfileId;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
  }

  syncProfilePanel() {
    const isOpen = this.state.activeView === 'main' && this.state.selectedOptionId === 'change-profile';
    this.profilePanelElement?.classList.toggle('is-visible', isOpen);
    this.profilePanelElement?.setAttribute('aria-hidden', String(!isOpen));
  }

  handleProfileMenuSelect(button, option) {
    if (this.state.activeProfileMenuId === option.id) {
      this.animateActivation(button, `profile-menu:${option.id}`);
      return;
    }

    this.state.activeProfileMenuId = option.id;
    this.syncProfileMenuOptions();
    this.moveFireflyToElement(button, { offsetX: -28, offsetY: 10 });
    this.animateActivation(button, `profile-menu:${option.id}`);

    this.onSelect?.({
      type: 'design-profile-action',
      item: this.item,
      action: option,
    });
  }

  syncProfileMenuOptions() {
    this.profileMenuButtons.forEach((button, optionId) => {
      const isSelected = optionId === this.state.activeProfileMenuId;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
  }

  handleProfileChangeToggle() {
    this.state.isProfilePickerOpen = !this.state.isProfilePickerOpen;
    this.syncProfilePicker();
    this.animateActivation(this.profileChangeButtonElement, 'profile-change');
    if (this.state.isProfilePickerOpen) {
      this.moveFireflyToElement(this.profileChangeButtonElement, { offsetX: -28, offsetY: 8 });
    } else {
      this.restoreFireflyAnchor();
    }
  }

  syncProfilePicker() {
    const isOpen = this.state.activeView === 'profile' && this.state.isProfilePickerOpen;
    this.profileMenuPickerElement?.classList.toggle('is-visible', isOpen);
    this.profileMenuPickerElement?.setAttribute('aria-hidden', String(!isOpen));
    this.profileChangeButtonElement?.classList.toggle('is-selected', isOpen);
    this.profileChangeButtonElement?.setAttribute('aria-pressed', String(isOpen));
  }

  handleSettingsTabSelect(button, tabId) {
    if (this.state.activeSettingsTab === tabId) {
      this.animateActivation(button, `settings-tab:${tabId}`);
      return;
    }

    this.state.activeSettingsTab = tabId;
    this.renderSettingsContent();
    this.syncSettingsTabs();
    this.moveFireflyToElement(button, { offsetX: -28, offsetY: 10 });
    this.animateActivation(button, `settings-tab:${tabId}`);
  }

  syncSettingsTabs() {
    this.settingsTabButtons.forEach((button, tabId) => {
      const isSelected = tabId === this.state.activeSettingsTab;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
  }

  syncViewState() {
    const isOptionsView = this.state.activeView === 'options';
    const isProfileView = this.state.activeView === 'profile';
    const isSubmenuView = isOptionsView || isProfileView;
    this.sceneElement?.classList.toggle('is-options-view', isOptionsView);
    this.sceneElement?.classList.toggle('is-profile-view', isProfileView);
    this.menuPanelElement?.classList.toggle('is-hidden', isSubmenuView);
    this.menuPanelElement?.setAttribute('aria-hidden', String(isSubmenuView));
    this.settingsPanelElement?.classList.toggle('is-visible', isOptionsView);
    this.settingsPanelElement?.setAttribute('aria-hidden', String(!isOptionsView));
    this.profileMenuPanelElement?.classList.toggle('is-visible', isProfileView);
    this.profileMenuPanelElement?.setAttribute('aria-hidden', String(!isProfileView));

    if (isOptionsView) {
      this.syncSettingsTabs();
      this.syncSettingsControlStates();
    }

    if (isProfileView) {
      this.syncProfileMenuOptions();
      this.syncProfilePicker();
    }
  }

  renderSettingsContent() {
    if (!this.settingsContentElement) {
      return;
    }

    const tab = SETTINGS_LAYOUT[this.state.activeSettingsTab] || SETTINGS_LAYOUT.gameplay;
    this.settingsContentElement.innerHTML = '';

    tab.groups.forEach((group) => {
      const groupElement = createElement('section', 'design-settings__group');

      if (group.title) {
        groupElement.appendChild(createElement('h4', 'design-settings__group-title', group.title));
      }

      const rowsElement = createElement('div', 'design-settings__rows');

      group.rows.forEach((row) => {
        const rowElement = createElement(
          'div',
          row.type === 'keybind'
            ? 'design-settings__row design-settings__row--keybind'
            : 'design-settings__row'
        );

        rowElement.addEventListener('mouseenter', () =>
          this.moveFireflyToElement(rowElement, { offsetX: -24, offsetY: 12 })
        );
        rowElement.addEventListener('focusin', () =>
          this.moveFireflyToElement(rowElement, { offsetX: -24, offsetY: 12 })
        );
        rowElement.addEventListener('mouseleave', () => this.restoreFireflyAnchor());
        rowElement.addEventListener('focusout', () => this.restoreFireflyAnchor());

        if (row.type === 'keybind') {
          this.renderKeybindRow(rowElement, row);
        } else {
          this.renderSettingRow(rowElement, row);
        }

        rowsElement.appendChild(rowElement);
      });

      groupElement.appendChild(rowsElement);
      this.settingsContentElement.appendChild(groupElement);
    });

    this.syncSettingsControlStates();
  }

  renderSettingRow(rowElement, row) {
    const currentValue = this.state.settingsValues[row.key];
    const header = createElement('div', 'design-settings__row-head');
    header.appendChild(createElement('span', 'design-settings__row-label', row.label));

    if (row.control === 'slider') {
      const valueChip = createElement(
        'span',
        'design-settings__value-chip',
        this.formatSettingValue(row, currentValue)
      );
      valueChip.dataset.settingValueFor = row.key;
      header.appendChild(valueChip);
    }

    rowElement.appendChild(header);

    if (row.control === 'slider') {
      rowElement.appendChild(this.buildSliderControl(row, currentValue));
      return;
    }

    rowElement.appendChild(this.buildSegmentedControl(row));
  }

  renderKeybindRow(rowElement, row) {
    rowElement.appendChild(createElement('span', 'design-settings__row-label', row.label));

    const keysElement = createElement('div', 'design-settings__keycaps');
    row.keys.forEach((key) => {
      keysElement.appendChild(createElement('span', 'design-settings__keycap', key));
    });
    rowElement.appendChild(keysElement);
  }

  buildSliderControl(row, value) {
    const wrapper = createElement('div', 'design-settings__slider-wrap');
    const input = createElement('input', 'design-settings__slider-input');
    input.type = 'range';
    input.min = String(row.min);
    input.max = String(row.max);
    input.step = String(row.step ?? 1);
    input.value = String(value);
    input.dataset.settingKey = row.key;

    input.addEventListener('input', (event) => {
      const nextValue = Number(event.currentTarget.value);
      this.setSettingValue(row.key, nextValue);
    });

    wrapper.appendChild(input);

    const scale = createElement('div', 'design-settings__slider-scale');
    (row.scaleLabels || []).forEach((label) => {
      scale.appendChild(createElement('span', '', label));
    });
    wrapper.appendChild(scale);

    return wrapper;
  }

  buildSegmentedControl(row) {
    const group = createElement('div', 'design-settings__segmented');

    row.options.forEach((option) => {
      const button = createElement('button', 'design-settings__segment', option.label);
      button.type = 'button';
      button.dataset.settingKey = row.key;
      button.dataset.settingValue = serializeSettingValue(option.value);
      button.addEventListener('click', () => {
        this.setSettingValue(row.key, option.value);
        this.animateActivation(button, `setting:${row.key}:${serializeSettingValue(option.value)}`);
      });
      group.appendChild(button);
    });

    return group;
  }

  setSettingValue(settingKey, value) {
    if (Object.is(this.state.settingsValues[settingKey], value)) {
      this.syncSettingsControlStates();
      return;
    }

    this.state.settingsValues = {
      ...this.state.settingsValues,
      [settingKey]: value,
    };
    this.syncSettingsControlStates();

    this.onSelect?.({
      type: 'design-setting-change',
      item: this.item,
      key: settingKey,
      value,
    });
  }

  syncSettingsControlStates() {
    if (!this.settingsContentElement) {
      return;
    }

    const segmentedButtons = this.settingsContentElement.querySelectorAll(
      '.design-settings__segment[data-setting-key][data-setting-value]'
    );

    segmentedButtons.forEach((button) => {
      const key = button.dataset.settingKey;
      const rawValue = button.dataset.settingValue;
      const isSelected = Object.is(
        this.state.settingsValues[key],
        deserializeSettingValue(rawValue)
      );
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });

    const sliders = this.settingsContentElement.querySelectorAll(
      '.design-settings__slider-input[data-setting-key]'
    );

    sliders.forEach((slider) => {
      const key = slider.dataset.settingKey;
      const control = SETTINGS_CONTROL_INDEX.get(key);
      const value = this.state.settingsValues[key];

      if (slider.value !== String(value)) {
        slider.value = String(value);
      }

      const valueChip = this.settingsContentElement.querySelector(
        `[data-setting-value-for="${key}"]`
      );

      if (valueChip && control) {
        valueChip.textContent = this.formatSettingValue(control, value);
      }
    });
  }

  formatSettingValue(control, value) {
    if (typeof control?.formatValue === 'function') {
      return control.formatValue(value);
    }

    const matchedOption = Array.isArray(control?.options)
      ? control.options.find((option) => Object.is(option.value, value))
      : null;

    if (matchedOption?.label) {
      return matchedOption.label;
    }

    return String(value);
  }

  animateActivation(button, activationId) {
    if (!button) {
      return;
    }

    const existingTimer = this.activationTimers.get(activationId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    button.classList.remove('is-activating');
    void button.offsetWidth;
    button.classList.add('is-activating');

    const timerId = setTimeout(() => {
      button.classList.remove('is-activating');
      this.activationTimers.delete(activationId);
    }, 760);

    this.activationTimers.set(activationId, timerId);
  }

  clearActivationTimers() {
    this.activationTimers.forEach((timerId) => {
      clearTimeout(timerId);
    });
    this.activationTimers.clear();
  }

  setupResponsiveObserver() {
    this.syncResponsiveMode();

    if (!this.sceneElement || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.syncResponsiveMode();
      this.restoreFireflyAnchor();
    });

    this.resizeObserver.observe(this.sceneElement);
  }

  teardownResizeObserver() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  syncResponsiveMode() {
    if (!this.sceneElement) {
      return;
    }

    const isCompact = this.sceneElement.clientHeight < 300;
    this.sceneElement.classList.toggle('is-compact-menu', isCompact);
  }

  buildDefaultSettings(item) {
    const itemDefaults =
      item?.defaultSettings && typeof item.defaultSettings === 'object' ? item.defaultSettings : {};

    return {
      ...DEFAULT_SETTINGS,
      ...itemDefaults,
    };
  }

  getDefaultProfileId(item) {
    const profileId = item?.defaultProfileId;
    if (typeof profileId === 'string' && profileId.trim()) {
      return profileId.trim();
    }

    return 'phil';
  }

  getDefaultSettingsTab(item) {
    const tabId = item?.defaultSettingsTab;
    if (typeof tabId === 'string' && SETTINGS_LAYOUT[tabId]) {
      return tabId;
    }

    return DEFAULT_SETTINGS_TABS[0].id;
  }

  getSettingsTabs(item) {
    const tabs = Array.isArray(item?.settingsTabs) ? item.settingsTabs : DEFAULT_SETTINGS_TABS;
    return tabs.filter((tab) => tab && typeof tab.id === 'string' && SETTINGS_LAYOUT[tab.id]);
  }

  getDefaultProfileMenuId(item) {
    const optionId = item?.defaultProfileMenuId;
    if (typeof optionId === 'string' && this.getProfileMenuOptions(item).some((option) => option.id === optionId)) {
      return optionId;
    }

    return DEFAULT_PROFILE_MENU_OPTIONS[0].id;
  }

  getProfileMenuOptions(item) {
    const options = Array.isArray(item?.profileMenuOptions)
      ? item.profileMenuOptions
      : DEFAULT_PROFILE_MENU_OPTIONS;

    return options.filter(
      (option) => option && typeof option.id === 'string' && typeof option.label === 'string'
    );
  }

  restoreFireflyAnchor() {
    if (this.state.activeView === 'options') {
      const activeTabButton = this.settingsTabButtons.get(this.state.activeSettingsTab);
      if (activeTabButton) {
        this.moveFireflyToElement(activeTabButton, { offsetX: -28, offsetY: 10 });
        return;
      }

      this.moveFireflyToElement(this.optionsBackButtonElement, { offsetX: -28, offsetY: 8 });
      return;
    }

    if (this.state.activeView === 'profile') {
      if (this.state.isProfilePickerOpen) {
        this.moveFireflyToElement(this.profileChangeButtonElement, { offsetX: -28, offsetY: 8 });
        return;
      }

      const activeProfileButton = this.profileMenuButtons.get(this.state.activeProfileMenuId);
      if (activeProfileButton) {
        this.moveFireflyToElement(activeProfileButton, { offsetX: -28, offsetY: 10 });
        return;
      }

      this.moveFireflyToElement(this.profileBackButtonElement, { offsetX: -28, offsetY: 8 });
      return;
    }

    const selectedButton = this.state.selectedOptionId
      ? this.actionButtons.get(this.state.selectedOptionId)
      : null;

    if (selectedButton) {
      this.moveFireflyToElement(selectedButton, { offsetX: -28, offsetY: 16 });
      return;
    }

    this.moveFireflyToElement(this.brandAnchorElement, { offsetX: 200, offsetY: 42 });
  }

  moveFireflyToElement(element, { offsetX = 0, offsetY = 0 } = {}) {
    if (!element || !this.sceneElement) {
      return;
    }

    const sceneRect = this.sceneElement.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const nextX = Math.max(
      16,
      Math.min(sceneRect.width - 56, elementRect.left - sceneRect.left + offsetX)
    );
    const nextY = Math.max(
      18,
      Math.min(sceneRect.height - 56, elementRect.top - sceneRect.top + offsetY)
    );

    this.sceneElement.style.setProperty('--design-firefly-x', `${nextX}px`);
    this.sceneElement.style.setProperty('--design-firefly-y', `${nextY}px`);
  }
}
