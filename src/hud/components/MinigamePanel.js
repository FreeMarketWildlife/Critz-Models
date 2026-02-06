import { minigameData } from '../../data/minigame.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const buildSpriteMarkup = (sprite) => {
  if (!sprite?.pixels || !sprite?.palette) {
    return '<div class="pixel-sprite pixel-sprite--empty"></div>';
  }

  const rows = sprite.pixels;
  const cells = rows
    .join('')
    .split('')
    .map((token) => {
      if (token === '.') {
        return '<span class="pixel-cell pixel-cell--empty"></span>';
      }
      const color = sprite.palette[token] || '#000000';
      return `<span class="pixel-cell" style="background:${color}"></span>`;
    })
    .join('');

  return `<div class="pixel-sprite">${cells}</div>`;
};

export class MinigamePanel {
  constructor({ panelElement, onExit }) {
    this.panelElement = panelElement;
    this.onExit = onExit;

    this.state = {
      heroId: null,
      heroHp: 0,
      heroGuard: false,
      heroItems: 2,
      dialogIndex: 0,
      questStatus: {},
      activeDungeonId: null,
      activeRoomIndex: -1,
      combat: null,
      log: [],
    };

    this.elements = {};
  }

  init() {
    if (!this.panelElement) return;
    this.renderShell();
    this.bindEvents();
    this.resetState();
    this.renderAll();
  }

  setActive(isActive) {
    if (!this.panelElement) return;
    this.panelElement.classList.toggle('is-active', isActive);
  }

  resetState() {
    this.state.heroId = null;
    this.state.heroHp = 0;
    this.state.heroGuard = false;
    this.state.heroItems = 2;
    this.state.dialogIndex = 0;
    this.state.activeDungeonId = null;
    this.state.activeRoomIndex = -1;
    this.state.combat = null;
    this.state.log = ['The adventure begins in Mossvale. Choose a critter hero.'];

    this.state.questStatus = minigameData.quests.reduce((acc, quest, index) => {
      acc[quest.id] = index === 0 ? 'active' : 'locked';
      return acc;
    }, {});
  }

  renderShell() {
    this.panelElement.innerHTML = `
      <div class="minigame-header">
        <div>
          <div class="minigame-kicker">Minigame</div>
          <h2>${minigameData.title}</h2>
          <p class="minigame-subtitle">${minigameData.subtitle}</p>
        </div>
        <button class="minigame-exit" type="button" data-action="exit">Return to Library</button>
      </div>
      <div class="minigame-grid">
        <section class="minigame-card" data-section="hero">
          <div class="minigame-card__header">
            <h3>Choose Your Critter</h3>
            <div class="minigame-card__note">Pick a hero to unlock quests and combat.</div>
          </div>
          <div class="hero-grid" data-role="hero-grid"></div>
          <div class="hero-stats" data-role="hero-stats"></div>
        </section>
        <section class="minigame-card" data-section="dialog">
          <div class="minigame-card__header">
            <h3>Campfire Dialog</h3>
            <div class="minigame-card__note">Meet the critter council.</div>
          </div>
          <div class="dialog-window">
            <div class="dialog-speaker" data-role="dialog-speaker"></div>
            <div class="dialog-text" data-role="dialog-text"></div>
          </div>
          <button class="minigame-button" type="button" data-action="dialog-next">Continue</button>
        </section>
        <section class="minigame-card" data-section="quests">
          <div class="minigame-card__header">
            <h3>Quest Log</h3>
            <div class="minigame-card__note">Track your heroic tasks.</div>
          </div>
          <div class="quest-list" data-role="quest-list"></div>
        </section>
        <section class="minigame-card" data-section="dungeons">
          <div class="minigame-card__header">
            <h3>Dungeon Trail</h3>
            <div class="minigame-card__note">Explore rooms, meet critters, and battle foes.</div>
          </div>
          <div class="dungeon-list" data-role="dungeon-list"></div>
          <div class="dungeon-map" data-role="dungeon-map"></div>
          <button class="minigame-button" type="button" data-action="room-next">Advance Room</button>
        </section>
        <section class="minigame-card" data-section="combat">
          <div class="minigame-card__header">
            <h3>Combat Arena</h3>
            <div class="minigame-card__note">Turn-based critter tactics.</div>
          </div>
          <div class="combat-status" data-role="combat-status"></div>
          <div class="combat-actions" data-role="combat-actions">
            <button class="minigame-button" type="button" data-action="attack">Attack</button>
            <button class="minigame-button" type="button" data-action="technique">Technique</button>
            <button class="minigame-button" type="button" data-action="guard">Guard</button>
            <button class="minigame-button" type="button" data-action="item">Berry Brew</button>
          </div>
          <div class="combat-log" data-role="combat-log"></div>
        </section>
        <section class="minigame-card" data-section="log">
          <div class="minigame-card__header">
            <h3>Adventure Notes</h3>
            <div class="minigame-card__note">Recent events from your journey.</div>
          </div>
          <div class="adventure-log" data-role="adventure-log"></div>
        </section>
      </div>
    `;

    this.elements = {
      heroGrid: this.panelElement.querySelector('[data-role="hero-grid"]'),
      heroStats: this.panelElement.querySelector('[data-role="hero-stats"]'),
      dialogSpeaker: this.panelElement.querySelector('[data-role="dialog-speaker"]'),
      dialogText: this.panelElement.querySelector('[data-role="dialog-text"]'),
      questList: this.panelElement.querySelector('[data-role="quest-list"]'),
      dungeonList: this.panelElement.querySelector('[data-role="dungeon-list"]'),
      dungeonMap: this.panelElement.querySelector('[data-role="dungeon-map"]'),
      combatStatus: this.panelElement.querySelector('[data-role="combat-status"]'),
      combatActions: this.panelElement.querySelector('[data-role="combat-actions"]'),
      combatLog: this.panelElement.querySelector('[data-role="combat-log"]'),
      adventureLog: this.panelElement.querySelector('[data-role="adventure-log"]'),
    };
  }

  bindEvents() {
    this.panelElement.addEventListener('click', (event) => {
      const action = event.target?.dataset?.action;
      if (!action) return;

      if (action === 'exit') {
        this.onExit?.();
        return;
      }

      if (action === 'dialog-next') {
        this.advanceDialog();
        return;
      }

      if (action === 'room-next') {
        this.advanceRoom();
        return;
      }

      if (action === 'attack' || action === 'technique' || action === 'guard' || action === 'item') {
        this.performCombatAction(action);
      }
    });

    this.panelElement.addEventListener('click', (event) => {
      const heroId = event.target?.closest('[data-hero-id]')?.dataset?.heroId;
      if (heroId) {
        this.selectHero(heroId);
      }

      const dungeonId = event.target?.closest('[data-dungeon-id]')?.dataset?.dungeonId;
      if (dungeonId) {
        this.enterDungeon(dungeonId);
      }
    });
  }

  renderAll() {
    this.renderHeroCards();
    this.renderDialog();
    this.renderQuests();
    this.renderDungeons();
    this.renderCombat();
    this.renderAdventureLog();
  }

  renderHeroCards() {
    if (!this.elements.heroGrid) return;

    this.elements.heroGrid.innerHTML = minigameData.heroes
      .map((hero) => {
        const isActive = hero.id === this.state.heroId;
        return `
          <button class="hero-card${isActive ? ' is-active' : ''}" type="button" data-hero-id="${hero.id}">
            <div class="hero-card__sprite">${buildSpriteMarkup(hero)}</div>
            <div>
              <div class="hero-card__name">${hero.name}</div>
              <div class="hero-card__title">${hero.title}</div>
              <div class="hero-card__bonus">${hero.bonus}</div>
            </div>
          </button>
        `;
      })
      .join('');

    this.renderHeroStats();
  }

  renderHeroStats() {
    const hero = this.getHero();
    if (!this.elements.heroStats) return;

    if (!hero) {
      this.elements.heroStats.innerHTML = '<p class="helper-text">Select a critter to reveal stats and skills.</p>';
      return;
    }

    const stats = hero.stats;
    const abilities = hero.abilities
      .map((ability) => `<li><strong>${ability.name}</strong>: ${ability.note}</li>`)
      .join('');

    this.elements.heroStats.innerHTML = `
      <div class="hero-stats__grid">
        <div>HP <span>${this.state.heroHp}</span></div>
        <div>Attack <span>${stats.attack}</span></div>
        <div>Defense <span>${stats.defense}</span></div>
        <div>Speed <span>${stats.speed}</span></div>
      </div>
      <div class="hero-stats__abilities">
        <div class="hero-stats__title">Techniques</div>
        <ul>${abilities}</ul>
      </div>
    `;
  }

  renderDialog() {
    if (!this.elements.dialogSpeaker || !this.elements.dialogText) return;

    const entry = minigameData.dialogues[this.state.dialogIndex % minigameData.dialogues.length];
    this.elements.dialogSpeaker.textContent = entry.speaker;
    this.elements.dialogText.textContent = entry.text;
  }

  renderQuests() {
    if (!this.elements.questList) return;

    this.elements.questList.innerHTML = minigameData.quests
      .map((quest) => {
        const status = this.state.questStatus[quest.id] || 'locked';
        return `
          <div class="quest-card quest-card--${status}">
            <div class="quest-card__title">
              <span>${quest.title}</span>
              <span class="quest-card__status">${status}</span>
            </div>
            <div class="quest-card__body">${quest.objective}</div>
            <div class="quest-card__reward">Reward: ${quest.reward}</div>
          </div>
        `;
      })
      .join('');
  }

  renderDungeons() {
    if (!this.elements.dungeonList) return;

    this.elements.dungeonList.innerHTML = minigameData.dungeons
      .map((dungeon) => {
        const isActive = dungeon.id === this.state.activeDungeonId;
        const isLocked = this.state.questStatus[dungeon.id] === 'locked' && !this.isDungeonUnlocked(dungeon.id);
        return `
          <button class="dungeon-card${isActive ? ' is-active' : ''}" type="button" data-dungeon-id="${dungeon.id}" ${
          isLocked ? 'disabled' : ''
        }>
            <div class="dungeon-card__title">${dungeon.title}</div>
            <div class="dungeon-card__summary">${dungeon.summary}</div>
          </button>
        `;
      })
      .join('');

    this.renderDungeonMap();
  }

  renderDungeonMap() {
    if (!this.elements.dungeonMap) return;

    const dungeon = this.getActiveDungeon();
    if (!dungeon) {
      this.elements.dungeonMap.innerHTML = '<p class="helper-text">Choose a dungeon to view its rooms.</p>';
      return;
    }

    const rooms = dungeon.rooms.map((room, index) => {
      const isCurrent = index === this.state.activeRoomIndex;
      const isCleared = index < this.state.activeRoomIndex;
      const label = room.type === 'combat' ? 'Battle' : room.type === 'treasure' ? 'Relic' : 'Dialog';
      return `
        <div class="dungeon-room${isCurrent ? ' is-current' : ''}${isCleared ? ' is-cleared' : ''}">
          <span>${label}</span>
        </div>
      `;
    });

    this.elements.dungeonMap.innerHTML = `
      <div class="dungeon-map__header">
        <div>${dungeon.title}</div>
        <div class="dungeon-map__progress">Room ${Math.max(this.state.activeRoomIndex, 0) + 1} / ${dungeon.rooms.length}</div>
      </div>
      <div class="dungeon-map__grid">${rooms.join('')}</div>
    `;
  }

  renderCombat() {
    if (!this.elements.combatStatus) return;

    const hero = this.getHero();
    const combat = this.state.combat;

    if (!hero) {
      this.elements.combatStatus.innerHTML = '<p class="helper-text">Select a hero to unlock combat actions.</p>';
      this.toggleCombatButtons(false);
      return;
    }

    if (!combat) {
      this.elements.combatStatus.innerHTML = `
        <div class="combat-setup">
          <div class="combat-portrait">${buildSpriteMarkup(hero)}</div>
          <div>
            <div class="combat-name">${hero.name}</div>
            <div class="combat-hp">HP ${this.state.heroHp} / ${hero.stats.hp}</div>
            <div class="combat-hint">Enter a dungeon room to encounter a foe.</div>
          </div>
        </div>
      `;
      this.toggleCombatButtons(false);
      return;
    }

    const enemy = minigameData.enemies[combat.enemyId];

    this.elements.combatStatus.innerHTML = `
      <div class="combat-setup">
        <div>
          <div class="combat-portrait">${buildSpriteMarkup(hero)}</div>
          <div class="combat-name">${hero.name}</div>
          <div class="combat-hp">HP ${this.state.heroHp} / ${hero.stats.hp}</div>
        </div>
        <div class="combat-versus">VS</div>
        <div>
          <div class="combat-portrait">${buildSpriteMarkup(enemy)}</div>
          <div class="combat-name">${enemy.name}</div>
          <div class="combat-hp">HP ${combat.enemyHp} / ${enemy.stats.hp}</div>
        </div>
      </div>
    `;

    this.toggleCombatButtons(true);
  }

  renderAdventureLog() {
    if (!this.elements.adventureLog) return;

    this.elements.adventureLog.innerHTML = this.state.log
      .slice(-6)
      .map((entry) => `<div class="adventure-log__entry">${entry}</div>`)
      .join('');
  }

  renderCombatLog(message) {
    if (!this.elements.combatLog) return;

    if (message) {
      this.state.log.push(message);
    }

    this.elements.combatLog.innerHTML = this.state.log
      .slice(-4)
      .map((entry) => `<div class="combat-log__entry">${entry}</div>`)
      .join('');

    this.renderAdventureLog();
  }

  selectHero(heroId) {
    const hero = minigameData.heroes.find((entry) => entry.id === heroId);
    if (!hero) return;

    this.state.heroId = heroId;
    this.state.heroHp = hero.stats.hp;
    this.state.heroGuard = false;
    this.state.heroItems = 2;
    this.state.combat = null;
    this.state.log.push(`${hero.name} joins the adventure party.`);

    this.renderHeroCards();
    this.renderCombat();
    this.renderAdventureLog();
  }

  advanceDialog() {
    this.state.dialogIndex = (this.state.dialogIndex + 1) % minigameData.dialogues.length;
    const entry = minigameData.dialogues[this.state.dialogIndex];
    this.state.log.push(`${entry.speaker} shares: "${entry.text}"`);

    if (this.state.dialogIndex === 2) {
      this.unlockQuest('dewdrop-ruins');
    }
    if (this.state.dialogIndex === 4) {
      this.unlockQuest('tidepool-hollow');
    }
    if (this.state.dialogIndex === 5) {
      this.unlockQuest('bark-citadel');
    }

    this.renderDialog();
    this.renderQuests();
    this.renderAdventureLog();
  }

  enterDungeon(dungeonId) {
    const dungeon = minigameData.dungeons.find((entry) => entry.id === dungeonId);
    if (!dungeon) return;

    if (!this.isDungeonUnlocked(dungeonId)) {
      this.state.log.push(`${dungeon.title} is still sealed.`);
      this.renderAdventureLog();
      return;
    }

    this.state.activeDungeonId = dungeonId;
    this.state.activeRoomIndex = -1;
    this.state.combat = null;
    this.state.log.push(`You step into ${dungeon.title}.`);

    this.renderDungeons();
    this.renderCombat();
    this.renderAdventureLog();
  }

  advanceRoom() {
    const dungeon = this.getActiveDungeon();
    if (!dungeon) return;

    if (!this.state.heroId) {
      this.state.log.push('Choose a hero before exploring the dungeon.');
      this.renderAdventureLog();
      return;
    }

    if (this.state.combat) {
      this.state.log.push('Finish the current battle before advancing.');
      this.renderAdventureLog();
      return;
    }

    const nextIndex = this.state.activeRoomIndex + 1;
    if (nextIndex >= dungeon.rooms.length) {
      this.state.log.push(`${dungeon.title} is fully explored.`);
      this.renderAdventureLog();
      return;
    }

    this.state.activeRoomIndex = nextIndex;
    const room = dungeon.rooms[nextIndex];

    if (room.type === 'combat') {
      this.startCombat(room.enemy);
    } else if (room.type === 'dialog') {
      this.state.log.push(`${room.speaker}: ${room.text}`);
      this.renderAdventureLog();
    } else if (room.type === 'treasure') {
      this.state.log.push(room.text);
      this.completeDungeon(dungeon.id);
      this.renderAdventureLog();
    }

    this.renderDungeonMap();
  }

  startCombat(enemyId) {
    const enemy = minigameData.enemies[enemyId];
    if (!enemy) return;

    this.state.combat = {
      enemyId,
      enemyHp: enemy.stats.hp,
      enemyGuard: false,
    };

    this.state.log.push(`A ${enemy.name} appears!`);
    this.renderCombat();
    this.renderCombatLog();
  }

  performCombatAction(action) {
    if (!this.state.combat) return;

    const hero = this.getHero();
    const enemy = minigameData.enemies[this.state.combat.enemyId];
    if (!hero || !enemy) return;

    if (action === 'item') {
      if (this.state.heroItems <= 0) {
        this.renderCombatLog('No Berry Brew left.');
        return;
      }
      const healAmount = 8 + (hero.id === 'frog' ? 3 : 0);
      this.state.heroHp = clamp(this.state.heroHp + healAmount, 0, hero.stats.hp);
      this.state.heroItems -= 1;
      this.state.log.push(`${hero.name} sips Berry Brew and restores ${healAmount} HP.`);
      this.enemyTurn(hero, enemy);
      this.renderCombat();
      this.renderCombatLog();
      return;
    }

    if (action === 'guard') {
      this.state.heroGuard = true;
      this.state.log.push(`${hero.name} braces for impact.`);
      this.enemyTurn(hero, enemy);
      this.renderCombat();
      this.renderCombatLog();
      return;
    }

    const basePower = action === 'technique' ? hero.abilities[0]?.power ?? hero.stats.attack : hero.stats.attack;
    let damage = Math.max(1, basePower + this.randomRange(0, 3) - enemy.stats.defense);

    if (hero.id === 'lizard' && Math.random() < 0.2) {
      const bonus = Math.max(1, Math.floor(damage * 0.6));
      damage += bonus;
      this.state.log.push('Sunrock combo! The lizard strikes twice.');
    }

    this.state.combat.enemyHp = clamp(this.state.combat.enemyHp - damage, 0, enemy.stats.hp);
    this.state.log.push(`${hero.name} hits ${enemy.name} for ${damage} damage.`);

    if (hero.id === 'salamander' && action === 'technique') {
      this.state.heroHp = clamp(this.state.heroHp + 2, 0, hero.stats.hp);
      this.state.log.push('Mistflame heals 2 HP.');
    }

    if (this.state.combat.enemyHp <= 0) {
      this.state.log.push(`${enemy.name} is defeated!`);
      this.state.combat = null;
      this.renderCombat();
      this.renderCombatLog();
      return;
    }

    this.enemyTurn(hero, enemy);
    this.renderCombat();
    this.renderCombatLog();
  }

  enemyTurn(hero, enemy) {
    if (!this.state.combat) return;

    const guardMultiplier = this.state.heroGuard ? 0.6 : 1;
    this.state.heroGuard = false;

    const damage = Math.max(1, enemy.stats.attack + this.randomRange(0, 2) - hero.stats.defense);
    const adjustedDamage = Math.max(1, Math.floor(damage * guardMultiplier));

    this.state.heroHp = clamp(this.state.heroHp - adjustedDamage, 0, hero.stats.hp);
    this.state.log.push(`${enemy.name} counters for ${adjustedDamage} damage.`);

    if (this.state.heroHp <= 0) {
      this.state.log.push(`${hero.name} needs a rest. Return to camp to recover.`);
      this.state.combat = null;
    }
  }

  completeDungeon(dungeonId) {
    if (dungeonId === 'dew-meadow') {
      this.completeQuest('sproutlights');
      this.unlockQuest('dewdrop-ruins');
    }
    if (dungeonId === 'dewdrop-ruins') {
      this.completeQuest('dewdrop-ruins');
      this.unlockQuest('tidepool-hollow');
    }
    if (dungeonId === 'tidepool-hollow') {
      this.completeQuest('tidepool-hollow');
      this.unlockQuest('bark-citadel');
    }
    if (dungeonId === 'bark-citadel') {
      this.completeQuest('bark-citadel');
    }

    this.renderQuests();
  }

  unlockQuest(questId) {
    if (this.state.questStatus[questId] === 'locked') {
      this.state.questStatus[questId] = 'active';
    }
  }

  completeQuest(questId) {
    this.state.questStatus[questId] = 'complete';
  }

  isDungeonUnlocked(dungeonId) {
    if (dungeonId === 'dew-meadow') return true;
    return this.state.questStatus[dungeonId] !== 'locked';
  }

  getHero() {
    return minigameData.heroes.find((entry) => entry.id === this.state.heroId) || null;
  }

  getActiveDungeon() {
    return minigameData.dungeons.find((entry) => entry.id === this.state.activeDungeonId) || null;
  }

  toggleCombatButtons(isEnabled) {
    if (!this.elements.combatActions) return;
    this.elements.combatActions.querySelectorAll('button').forEach((button) => {
      button.disabled = !isEnabled;
    });
  }

  randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
