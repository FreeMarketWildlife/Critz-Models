export const PHASE_UNASSIGNED = 'unassigned';
export const MAX_PHASE = 5;
export const DEFAULT_PHASE_FILTER = 1;

export const PHASE_OPTIONS = Object.freeze([
  { value: PHASE_UNASSIGNED, label: 'Phase Unassigned' },
  { value: 1, label: 'Phase 1' },
  { value: 2, label: 'Phase 2' },
  { value: 3, label: 'Phase 3' },
  { value: 4, label: 'Phase 4' },
  { value: 5, label: 'Phase 5' },
]);

export const normalizePhaseValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    value === 0 ||
    value === '0' ||
    value === PHASE_UNASSIGNED
  ) {
    return PHASE_UNASSIGNED;
  }

  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    const rounded = Math.round(numeric);
    if (rounded >= 1 && rounded <= MAX_PHASE) {
      return rounded;
    }
  }

  return PHASE_UNASSIGNED;
};

export const normalizePhaseFilter = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return DEFAULT_PHASE_FILTER;
  }

  return Math.max(1, Math.min(MAX_PHASE, Math.round(numeric)));
};

export const isPhaseVisibleForFilter = (phase, filterPhase = DEFAULT_PHASE_FILTER) => {
  const normalizedPhase = normalizePhaseValue(phase);
  if (normalizedPhase === PHASE_UNASSIGNED) {
    return true;
  }

  return normalizedPhase <= normalizePhaseFilter(filterPhase);
};

export const getPhaseOptionValue = (value) =>
  value === PHASE_UNASSIGNED ? PHASE_UNASSIGNED : String(normalizePhaseValue(value));
