const MAX_LOG_ENTRIES = 18;

export class MinigamePanel {
  constructor({ container, data }) {
    this.container = container;
    this.data = data;
    this.root = null;
    this.logElement = null;
    this.locationElement = null;
    this.questStatusElement = null;
    this.heroCardElement = null;
    this.questLogElement = null;
    this.dungeonElement = null;
    this.actionsElement = null;
    this.sceneElement = null;
    this.heroPortrait = null;
    this.enemyPortrait = null;
    this.selectOverlay = null;

    this.state = {
      active: false,
      hero: null,
      heroHp: 0,
      heroMaxHp: 0,
      heroGuard: false,
      enemy: null,
      enemyHp: 0,
      enemyStatus: null,
      locationId: 'nectarfield',
      log: [],
      questState: {},
      activeQuestId: null,
      dungeonState: null,
      turn: 'hero',
    };
  }

  init() {
    if (!this.container) {
      throw new Error('MinigamePanel requires a container element.');
    }

    this.build();
    this.seedQuestState();
    this.renderSelectOverlay();
    this.setActive(false);
  }

  build() {
    this.root = document.createElement('div');
    this.root.className = 'minigame-panel';
    this.root.innerHTML = `
      <div class="minigame-header">
        <div>
          <p class="minigame-title">${this.data.title}</p>
          <p class="minigame-subtitle">${this.data.subtitle}</p>
        </div>
        <div class="minigame-status">
          <p class="minigame-status__label">Location</p>
          <p class="minigame-status__value" data-role="location">Nectarfield Village</p>
          <p class="minigame-status__label">Quest</p>
          <p class="minigame-status__value" data-role="quest-status">Awaiting a call to adventure</p>
        </div>
      </div>
      <div class="minigame-body">
        <div class="minigame-screen">
          <div class="minigame-screen__scene" data-role="scene" data-scene="village">
            <div class="pixel-portrait" data-role="hero-portrait"></div>
            <div class="pixel-portrait pixel-portrait--enemy" data-role="enemy-portrait"></div>
          </div>
          <div class="minigame-dialog" data-role="dialog-log"></div>
        </div>
        <div class="minigame-sidebar">
          <div class="minigame-card" data-role="hero-card"></div>
          <div class="minigame-card" data-role="quest-log"></div>
          <div class="minigame-card" data-role="dungeon-info"></div>
        </div>
      </div>
      <div class="minigame-actions" data-role="actions"></div>
    `;

    this.container.appendChild(this.root);

    this.logElement = this.root.querySelector('[data-role="dialog-log"]');
    this.locationElement = this.root.querySelector('[data-role="location"]');
    this.questStatusElement = this.root.querySelector('[data-role="quest-status"]');
    this.heroCardElement = this.root.querySelector('[data-role="hero-card"]');
    this.questLogElement = this.root.querySelector('[data-role="quest-log"]');
    this.dungeonElement = this.root.querySelector('[data-role="dungeon-info"]');
    this.actionsElement = this.root.querySelector('[data-role="actions"]');
    this.sceneElement = this.root.querySelector('[data-role="scene"]');
    this.heroPortrait = this.root.querySelector('[data-role="hero-portrait"]');
    this.enemyPortrait = this.root.querySelector('[data-role="enemy-portrait"]');
  }

  setActive(isActive) {
    this.state.active = Boolean(isActive);
    if (this.root) {
      this.root.classList.toggle('is-active', this.state.active);
    }
  }

  load() {
    this.resetState();
    this.renderSelectOverlay();
  }

  resetState() {
    this.state.hero = null;
    this.state.heroHp = 0;
    this.state.heroMaxHp = 0;
    this.state.heroGuard = false;
    this.state.enemy = null;
    this.state.enemyHp = 0;
    this.state.enemyStatus = null;
    this.state.locationId = 'nectarfield';
    this.state.log = [];
    this.state.activeQuestId = null;
    this.state.dungeonState = null;
    this.state.turn = 'hero';
    this.seedQuestState();
    this.updateLocation();
    this.clearLog();
    this.renderHeroCard();
    this.renderQuestLog();
    this.renderDungeonInfo();
    this.setActions([]);
    this.updatePortraits();
  }

  seedQuestState() {
    this.state.questState = this.data.quests.reduce((acc, quest) => {
      acc[quest.id] = 'available';
      return acc;
    }, {});
  }

  renderSelectOverlay() {
    if (this.selectOverlay) {
      this.selectOverlay.remove();
    }

    this.selectOverlay = document.createElement('div');
    this.selectOverlay.className = 'minigame-select';
    this.selectOverlay.innerHTML = `
      <div class="minigame-select__panel">
        <p class="minigame-select__title">Choose Your Critter</p>
        <p class="minigame-select__copy">Pick a hero to begin the adventure across the Great Tangle.</p>
        <div class="minigame-choice-grid" data-role="choices"></div>
      </div>
    `;

    const grid = this.selectOverlay.querySelector('[data-role="choices"]');

    this.data.heroes.forEach((hero) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'minigame-choice';
      card.innerHTML = `
        <div class="minigame-choice__portrait" data-role="choice-portrait"></div>
        <div class="minigame-choice__meta">
          <p class="minigame-choice__name">${hero.name}</p>
          <p class="minigame-choice__title">${hero.title}</p>
          <p class="minigame-choice__stats">HP ${hero.stats.hp} · ATK ${hero.stats.attack} · DEF ${hero.stats.defense}</p>
          <p class="minigame-choice__skill">Skill: ${hero.skill.name}</p>
        </div>
      `;
      const portrait = card.querySelector('[data-role="choice-portrait"]');
      this.renderSprite(portrait, hero.sprite, hero.palette);
      card.addEventListener('click', () => this.startAdventure(hero.id));
      grid.appendChild(card);
    });

    this.root.appendChild(this.selectOverlay);
    this.selectOverlay.classList.add('is-visible');

    this.clearLog();
    this.data.intro.forEach((line) => this.pushLog(line, 'story'));
  }

  startAdventure(heroId) {
    const hero = this.data.heroes.find((entry) => entry.id === heroId);
    if (!hero) return;

    this.state.hero = hero;
    this.state.heroHp = hero.stats.hp;
    this.state.heroMaxHp = hero.stats.hp;
    this.state.heroGuard = false;
    this.state.enemy = null;
    this.state.enemyHp = 0;
    this.state.enemyStatus = null;
    this.state.turn = 'hero';
    this.state.locationId = 'nectarfield';

    this.selectOverlay?.remove();

    this.clearLog();
    this.pushLog(`${hero.name} steps into the village square.`, 'story');
    this.pushLog('Critters gather, whispering about the Great Tangle.', 'story');
    this.updateLocation();
    this.renderHeroCard();
    this.renderQuestLog();
    this.renderDungeonInfo();
    this.updatePortraits();
    this.setActions([
      { id: 'talk', label: 'Talk' },
      { id: 'explore', label: 'Explore' },
      { id: 'quest', label: 'Quest Log' },
      { id: 'dungeon', label: 'Dungeon' },
      { id: 'rest', label: 'Rest' },
    ]);
  }

  setActions(actions) {
    if (!this.actionsElement) return;
    this.actionsElement.innerHTML = '';

    actions.forEach((action) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'minigame-action';
      button.textContent = action.label;
      button.addEventListener('click', () => this.handleAction(action.id));
      this.actionsElement.appendChild(button);
    });
  }

  handleAction(actionId) {
    if (!this.state.hero) {
      return;
    }

    if (this.state.enemy) {
      this.handleCombatAction(actionId);
      return;
    }

    switch (actionId) {
      case 'talk':
        this.handleTalk();
        break;
      case 'explore':
        this.handleExplore();
        break;
      case 'quest':
        this.handleQuestLog();
        break;
      case 'dungeon':
        this.handleDungeon();
        break;
      case 'rest':
        this.handleRest();
        break;
      default:
        break;
    }
  }

  handleTalk() {
    const npc = this.pickNpc();
    this.pushLog(`${npc.name} (${npc.role})`, 'npc');
    const line = npc.dialog[Math.floor(Math.random() * npc.dialog.length)];
    this.pushLog(line, 'dialog');

    if (npc.questId) {
      this.offerQuest(npc.questId);
    }
  }

  handleExplore() {
    const roll = Math.random();
    if (roll < 0.45) {
      const enemy = this.pickEnemy();
      this.startCombat(enemy);
      return;
    }

    if (roll < 0.7) {
      const location = this.pickLocation();
      this.state.locationId = location.id;
      this.updateLocation();
      this.pushLog(`You wander toward ${location.name}.`, 'story');
      this.pushLog(location.description, 'story');
      return;
    }

    const bonus = 4 + Math.floor(Math.random() * 4);
    this.state.heroHp = Math.min(this.state.heroMaxHp, this.state.heroHp + bonus);
    this.pushLog('You discover a pouch of dewberries. Restored some health!', 'system');
    this.renderHeroCard();
  }

  handleQuestLog() {
    this.renderQuestLog(true);
    this.pushLog('You review the quests etched into your travel journal.', 'system');
  }

  handleDungeon() {
    if (!this.state.activeQuestId) {
      this.pushLog('No dungeon marked yet. Talk to village critters for guidance.', 'system');
      return;
    }

    if (!this.state.dungeonState) {
      const quest = this.data.quests.find((entry) => entry.id === this.state.activeQuestId);
      const dungeon = this.data.dungeons.find((entry) => entry.id === quest.dungeonId);
      this.state.dungeonState = {
        dungeonId: dungeon.id,
        floor: 1,
      };
      this.pushLog(`You enter ${dungeon.name}.`, 'story');
      this.pushLog(dungeon.theme, 'story');
      this.updateSceneForDungeon(dungeon.id);
      this.renderDungeonInfo();
      return;
    }

    this.advanceDungeon();
  }

  handleRest() {
    this.state.heroHp = this.state.heroMaxHp;
    this.state.heroGuard = false;
    this.pushLog('You settle by a warm lantern and recover fully.', 'system');
    this.renderHeroCard();
  }

  startCombat(enemy) {
    this.state.enemy = enemy;
    this.state.enemyHp = enemy.hp;
    this.state.enemyStatus = null;
    this.state.turn = 'hero';
    this.pushLog(`A wild ${enemy.name} scurries into view!`, 'combat');
    this.updatePortraits();
    this.setActions([
      { id: 'attack', label: 'Strike' },
      { id: 'skill', label: this.state.hero.skill.name },
      { id: 'guard', label: 'Guard' },
      { id: 'snack', label: 'Snack' },
    ]);
    this.renderHeroCard();
  }

  handleCombatAction(actionId) {
    if (!this.state.enemy) {
      return;
    }

    if (this.state.turn !== 'hero') {
      return;
    }

    switch (actionId) {
      case 'attack':
        this.performAttack();
        break;
      case 'skill':
        this.performSkill();
        break;
      case 'guard':
        this.performGuard();
        break;
      case 'snack':
        this.performSnack();
        break;
      default:
        break;
    }

    if (this.state.enemyHp > 0) {
      this.state.turn = 'enemy';
      setTimeout(() => this.performEnemyTurn(), 350);
    }
  }

  performAttack() {
    const damage = this.calculateDamage(this.state.hero.stats.attack, this.state.enemy.defense);
    this.state.enemyHp = Math.max(0, this.state.enemyHp - damage);
    this.pushLog(`${this.state.hero.name} strikes for ${damage} damage.`, 'combat');
    this.updatePortraits();
    this.checkCombatEnd();
  }

  performSkill() {
    const skill = this.state.hero.skill.effect;
    if (skill === 'double') {
      const first = this.calculateDamage(this.state.hero.stats.attack - 1, this.state.enemy.defense);
      const second = this.calculateDamage(this.state.hero.stats.attack - 1, this.state.enemy.defense);
      const total = first + second;
      this.state.enemyHp = Math.max(0, this.state.enemyHp - total);
      this.pushLog(`Leaf Flurry hits twice for ${total} damage.`, 'combat');
    } else if (skill === 'burn') {
      const damage = this.calculateDamage(this.state.hero.stats.attack + 1, this.state.enemy.defense);
      this.state.enemyHp = Math.max(0, this.state.enemyHp - damage);
      this.state.enemyStatus = 'burn';
      this.pushLog('Ember Flick ignites the foe. They are burning!', 'combat');
    } else if (skill === 'guard') {
      const heal = 6;
      this.state.heroHp = Math.min(this.state.heroMaxHp, this.state.heroHp + heal);
      this.state.heroGuard = true;
      this.pushLog('Bubble Guard restores health and raises a shield.', 'combat');
      this.renderHeroCard();
    } else if (skill === 'stun') {
      const damage = this.calculateDamage(this.state.hero.stats.attack, this.state.enemy.defense);
      this.state.enemyHp = Math.max(0, this.state.enemyHp - damage);
      this.state.enemyStatus = 'stun';
      this.pushLog('Shell Bash rattles the foe. They are stunned!', 'combat');
    }

    this.updatePortraits();
    this.checkCombatEnd();
  }

  performGuard() {
    this.state.heroGuard = true;
    this.pushLog('You brace for impact. Guard raised!', 'combat');
  }

  performSnack() {
    const heal = 8;
    this.state.heroHp = Math.min(this.state.heroMaxHp, this.state.heroHp + heal);
    this.pushLog('You munch a crunchy leaf. Restored some health.', 'combat');
    this.renderHeroCard();
  }

  performEnemyTurn() {
    if (!this.state.enemy) return;

    if (this.state.enemyStatus === 'stun') {
      this.pushLog(`${this.state.enemy.name} is stunned and misses a turn.`, 'combat');
      this.state.enemyStatus = null;
      this.state.turn = 'hero';
      return;
    }

    const damage = this.calculateDamage(this.state.enemy.attack, this.state.hero.stats.defense);
    const guardedDamage = this.state.heroGuard ? Math.max(1, Math.floor(damage / 2)) : damage;
    this.state.heroHp = Math.max(0, this.state.heroHp - guardedDamage);
    this.pushLog(`${this.state.enemy.name} attacks for ${guardedDamage} damage.`, 'combat');

    if (this.state.enemyStatus === 'burn') {
      const burnDamage = 3;
      this.state.enemyHp = Math.max(0, this.state.enemyHp - burnDamage);
      this.pushLog(`${this.state.enemy.name} takes ${burnDamage} burn damage.`, 'combat');
    }

    this.state.heroGuard = false;
    this.renderHeroCard();
    this.updatePortraits();

    if (this.state.heroHp <= 0) {
      this.pushLog('You wobble, but a gentle glow revives you at camp.', 'system');
      this.state.heroHp = Math.ceil(this.state.heroMaxHp * 0.6);
      this.state.enemy = null;
      this.state.enemyHp = 0;
      this.state.enemyStatus = null;
      this.state.turn = 'hero';
      this.updatePortraits();
      this.renderHeroCard();
      this.setActions([
        { id: 'talk', label: 'Talk' },
        { id: 'explore', label: 'Explore' },
        { id: 'quest', label: 'Quest Log' },
        { id: 'dungeon', label: 'Dungeon' },
        { id: 'rest', label: 'Rest' },
      ]);
      return;
    }

    this.state.turn = 'hero';
  }

  checkCombatEnd() {
    if (this.state.enemyHp > 0) {
      return;
    }

    const defeated = this.state.enemy;
    if (!defeated) return;

    this.pushLog(`${defeated.name} scampers away in defeat.`, 'combat');

    if (defeated.boss) {
      this.handleBossDefeated();
    }

    this.state.enemy = null;
    this.state.enemyHp = 0;
    this.state.enemyStatus = null;
    this.state.turn = 'hero';
    this.updatePortraits();

    this.setActions([
      { id: 'talk', label: 'Talk' },
      { id: 'explore', label: 'Explore' },
      { id: 'quest', label: 'Quest Log' },
      { id: 'dungeon', label: 'Dungeon' },
      { id: 'rest', label: 'Rest' },
    ]);
  }

  handleBossDefeated() {
    const dungeonState = this.state.dungeonState;
    if (!dungeonState) return;

    const questId = this.state.activeQuestId;
    if (questId) {
      this.state.questState[questId] = 'completed';
      const quest = this.data.quests.find((entry) => entry.id === questId);
      this.pushLog(`Quest complete: ${quest.title}.`, 'system');
      this.pushLog(`Reward: ${quest.reward}`, 'system');
      this.state.activeQuestId = null;
      this.state.dungeonState = null;
      this.state.locationId = 'nectarfield';
      this.updateLocation();
      this.renderQuestLog();
      this.renderDungeonInfo();
    }
  }

  advanceDungeon() {
    const dungeonState = this.state.dungeonState;
    if (!dungeonState) return;

    const dungeon = this.data.dungeons.find((entry) => entry.id === dungeonState.dungeonId);
    if (!dungeon) return;

    if (dungeonState.floor < dungeon.floors) {
      dungeonState.floor += 1;
      this.pushLog(`You descend to floor ${dungeonState.floor}.`, 'story');
      this.renderDungeonInfo();
      if (Math.random() < 0.65) {
        const enemy = this.pickEnemy(false);
        this.startCombat(enemy);
      }
      return;
    }

    const boss = this.data.enemies.find((entry) => entry.id === dungeon.bossId);
    if (boss) {
      this.pushLog(`A boss appears: ${boss.name}!`, 'combat');
      this.startCombat(boss);
    }
  }

  offerQuest(questId) {
    if (this.state.questState[questId] !== 'available') {
      return;
    }

    this.state.questState[questId] = 'active';
    this.state.activeQuestId = questId;
    const quest = this.data.quests.find((entry) => entry.id === questId);
    this.pushLog(`Quest accepted: ${quest.title}.`, 'system');
    this.pushLog(quest.description, 'system');
    this.renderQuestLog();
    this.updateQuestStatus();
  }

  pickNpc() {
    return this.data.npcs[Math.floor(Math.random() * this.data.npcs.length)];
  }

  pickEnemy(allowBoss = false) {
    const pool = allowBoss
      ? this.data.enemies
      : this.data.enemies.filter((enemy) => !enemy.boss);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  pickLocation() {
    return this.data.locations[Math.floor(Math.random() * this.data.locations.length)];
  }

  updateLocation() {
    const location = this.data.locations.find((entry) => entry.id === this.state.locationId);
    if (!location) return;
    if (this.locationElement) {
      this.locationElement.textContent = location.name;
    }
    if (this.sceneElement) {
      const sceneByLocation = {
        nectarfield: 'village',
        'canopy-trail': 'trail',
        dewgate: 'trail',
      };
      this.sceneElement.dataset.scene = sceneByLocation[location.id] || 'trail';
    }
    this.updateQuestStatus();
  }

  updateQuestStatus() {
    if (!this.questStatusElement) return;
    if (!this.state.activeQuestId) {
      this.questStatusElement.textContent = 'Awaiting a call to adventure';
      return;
    }
    const quest = this.data.quests.find((entry) => entry.id === this.state.activeQuestId);
    if (quest) {
      this.questStatusElement.textContent = quest.title;
    }
  }

  renderHeroCard() {
    if (!this.heroCardElement) return;
    if (!this.state.hero) {
      this.heroCardElement.innerHTML = `
        <p class="minigame-card__title">Hero</p>
        <p class="minigame-card__body">Select a critter to begin.</p>
      `;
      return;
    }

    const hero = this.state.hero;
    const hpPercent = Math.floor((this.state.heroHp / this.state.heroMaxHp) * 100);

    this.heroCardElement.innerHTML = `
      <p class="minigame-card__title">${hero.name}</p>
      <p class="minigame-card__subtitle">${hero.title}</p>
      <div class="minigame-meter">
        <div class="minigame-meter__fill" style="width: ${hpPercent}%;"></div>
      </div>
      <p class="minigame-card__stat">HP ${this.state.heroHp}/${this.state.heroMaxHp}</p>
      <p class="minigame-card__stat">ATK ${hero.stats.attack} · DEF ${hero.stats.defense} · SPD ${hero.stats.speed}</p>
      <p class="minigame-card__stat">Skill: ${hero.skill.name}</p>
    `;
  }

  renderQuestLog(force) {
    if (!this.questLogElement) return;

    const entries = this.data.quests.map((quest) => {
      const status = this.state.questState[quest.id];
      return { quest, status };
    });

    this.questLogElement.innerHTML = `
      <p class="minigame-card__title">Quests</p>
      ${entries
        .map(
          ({ quest, status }) => `
            <div class="minigame-quest">
              <p class="minigame-quest__name">${quest.title}</p>
              <p class="minigame-quest__status">${this.formatQuestStatus(status)}</p>
            </div>
          `
        )
        .join('')}
      ${force ? '<p class="minigame-card__hint">Check the nav for new rumors.</p>' : ''}
    `;
  }

  renderDungeonInfo() {
    if (!this.dungeonElement) return;

    if (!this.state.dungeonState) {
      this.dungeonElement.innerHTML = `
        <p class="minigame-card__title">Dungeon</p>
        <p class="minigame-card__body">No dungeon entered yet.</p>
      `;
      return;
    }

    const dungeon = this.data.dungeons.find((entry) => entry.id === this.state.dungeonState.dungeonId);
    if (!dungeon) return;

    this.dungeonElement.innerHTML = `
      <p class="minigame-card__title">${dungeon.name}</p>
      <p class="minigame-card__subtitle">${dungeon.theme}</p>
      <p class="minigame-card__stat">Floor ${this.state.dungeonState.floor} of ${dungeon.floors}</p>
      <p class="minigame-card__stat">Boss: ${this.resolveEnemyName(dungeon.bossId)}</p>
    `;
  }

  updateSceneForDungeon(dungeonId) {
    if (!this.sceneElement) return;
    const sceneMap = {
      'glimmer-grotto': 'grotto',
      'shellridge-ruins': 'ruins',
      'rootspire-hollow': 'hollow',
    };
    this.sceneElement.dataset.scene = sceneMap[dungeonId] || 'trail';
  }

  resolveEnemyName(enemyId) {
    const enemy = this.data.enemies.find((entry) => entry.id === enemyId);
    return enemy ? enemy.name : 'Unknown';
  }

  formatQuestStatus(status) {
    if (status === 'completed') return 'Completed';
    if (status === 'active') return 'Active';
    return 'Available';
  }

  renderSprite(container, sprite, palette) {
    if (!container || !sprite || !palette) return;
    container.innerHTML = '';
    container.classList.add('pixel-grid');
    sprite.forEach((row) => {
      row.split('').forEach((digit) => {
        const cell = document.createElement('span');
        cell.className = 'pixel-cell';
        const colorIndex = Number(digit);
        if (colorIndex > 0) {
          cell.style.background = palette[colorIndex - 1];
        }
        container.appendChild(cell);
      });
    });
  }

  updatePortraits() {
    if (this.state.hero && this.heroPortrait) {
      this.renderSprite(this.heroPortrait, this.state.hero.sprite, this.state.hero.palette);
    }

    if (this.state.enemy && this.enemyPortrait) {
      this.renderSprite(this.enemyPortrait, this.state.enemy.sprite, this.state.enemy.palette);
      this.enemyPortrait.classList.add('is-visible');
    } else if (this.enemyPortrait) {
      this.enemyPortrait.innerHTML = '';
      this.enemyPortrait.classList.remove('is-visible');
    }
  }

  pushLog(text, type) {
    this.state.log.push({ text, type });
    if (this.state.log.length > MAX_LOG_ENTRIES) {
      this.state.log.shift();
    }
    this.renderLog();
  }

  clearLog() {
    this.state.log = [];
    this.renderLog();
  }

  renderLog() {
    if (!this.logElement) return;
    this.logElement.innerHTML = this.state.log
      .map((entry) => `<p class="minigame-log minigame-log--${entry.type}">${entry.text}</p>`)
      .join('');
    this.logElement.scrollTop = this.logElement.scrollHeight;
  }

  calculateDamage(attack, defense) {
    const base = Math.max(1, attack - Math.floor(defense / 2));
    return base + Math.floor(Math.random() * 3);
  }
}
