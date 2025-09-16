export const createStatBars = (stats, { compact = false } = {}) => {
  if (!Array.isArray(stats) || stats.length === 0) {
    return null;
  }

  const container = document.createElement('div');
  container.classList.add('stat-bars');
  if (compact) {
    container.classList.add('stat-bars--compact');
  }

  stats.forEach((stat) => {
    const bar = document.createElement('div');
    bar.classList.add('stat-bar');
    bar.dataset.statKey = stat.key;
    if (!stat.hasValue) {
      bar.classList.add('is-empty');
    }

    const label = document.createElement('span');
    label.className = 'stat-bar-label';
    label.textContent = stat.label || stat.key;
    bar.appendChild(label);

    const track = document.createElement('div');
    track.className = 'stat-bar-track';
    const descriptor = stat.hasValue ? String(stat.displayValue) : 'No data';
    track.setAttribute('role', 'img');
    track.setAttribute('aria-label', `${label.textContent}: ${descriptor}`);
    track.title = `${label.textContent}: ${descriptor}`;

    const fill = document.createElement('div');
    fill.className = 'stat-bar-fill';
    const ratio = typeof stat.percentage === 'number' ? stat.percentage : 0;
    const clamped = Math.max(0, Math.min(1, ratio));
    fill.style.width = `${Math.round(clamped * 100)}%`;

    track.appendChild(fill);
    bar.appendChild(track);

    container.appendChild(bar);
  });

  return container;
};
