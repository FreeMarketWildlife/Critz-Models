import * as THREE from 'https://esm.sh/three@0.160.0';

const GROUP_ORDER = ['Face', 'Body', 'Arms', 'Legs', 'Tail'];

const CONTROL_DEFINITIONS = [
  {
    id: 'mouthOpen',
    label: 'Mouth Open',
    group: 'Face',
    order: 0,
    morph: {
      keywords: ['mouth_open', 'jaw_open', 'mouth', 'jaw'],
      prefer: ['mouth_open', 'jaw_open'],
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
    bone: {
      axis: 'x',
      keywords: ['jaw', 'mouth'],
      prefer: ['jaw'],
      min: -0.2,
      max: 0.9,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    id: 'headPitch',
    label: 'Head Pitch',
    group: 'Face',
    order: 1,
    bone: {
      axis: 'x',
      keywords: ['head'],
      min: -0.7,
      max: 0.7,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    id: 'headYaw',
    label: 'Head Turn',
    group: 'Face',
    order: 2,
    bone: {
      axis: 'y',
      keywords: ['head'],
      min: -0.9,
      max: 0.9,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    id: 'headRoll',
    label: 'Head Roll',
    group: 'Face',
    order: 3,
    bone: {
      axis: 'z',
      keywords: ['head'],
      min: -0.7,
      max: 0.7,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    id: 'torsoLean',
    label: 'Body Lean',
    group: 'Body',
    order: 0,
    bone: {
      axis: 'x',
      keywords: ['spine', 'chest', 'torso'],
      prefer: ['spine2', 'spine_02', 'chest'],
      min: -0.6,
      max: 0.6,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    id: 'torsoTwist',
    label: 'Body Twist',
    group: 'Body',
    order: 1,
    bone: {
      axis: 'y',
      keywords: ['spine', 'chest', 'torso'],
      prefer: ['spine2', 'spine_02', 'chest'],
      min: -0.8,
      max: 0.8,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    id: 'tailCurl',
    label: 'Tail Curl',
    group: 'Tail',
    order: 0,
    bone: {
      axis: 'x',
      keywords: ['tail'],
      min: -0.9,
      max: 0.9,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    id: 'tailSwing',
    label: 'Tail Swing',
    group: 'Tail',
    order: 1,
    bone: {
      axis: 'y',
      keywords: ['tail'],
      min: -0.9,
      max: 0.9,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    id: 'armLiftL',
    label: 'Left Arm Lift',
    group: 'Arms',
    order: 0,
    bone: {
      axis: 'z',
      keywords: ['arm', 'shoulder', 'front'],
      prefer: ['upperarm', 'frontleg', 'shoulder'],
      side: 'left',
      min: -1.4,
      max: 1.4,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    id: 'armLiftR',
    label: 'Right Arm Lift',
    group: 'Arms',
    order: 1,
    bone: {
      axis: 'z',
      keywords: ['arm', 'shoulder', 'front'],
      prefer: ['upperarm', 'frontleg', 'shoulder'],
      side: 'right',
      min: -1.4,
      max: 1.4,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    id: 'legLiftL',
    label: 'Left Leg Lift',
    group: 'Legs',
    order: 0,
    bone: {
      axis: 'z',
      keywords: ['leg', 'thigh', 'hind', 'knee'],
      prefer: ['thigh', 'hindleg'],
      side: 'left',
      min: -1.2,
      max: 1.2,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    id: 'legLiftR',
    label: 'Right Leg Lift',
    group: 'Legs',
    order: 1,
    bone: {
      axis: 'z',
      keywords: ['leg', 'thigh', 'hind', 'knee'],
      prefer: ['thigh', 'hindleg'],
      side: 'right',
      min: -1.2,
      max: 1.2,
      step: 0.01,
      defaultValue: 0,
    },
  },
];

const EPSILON = 1e-4;

const AXIS_VECTORS = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
};

const clamp = (value, min, max) => {
  if (Number.isNaN(value)) {
    return min;
  }
  if (typeof min === 'number' && value < min) {
    return min;
  }
  if (typeof max === 'number' && value > max) {
    return max;
  }
  return value;
};

export class RigController {
  constructor(model) {
    this.model = model;
    this.skinnedMeshes = [];
    this.bones = [];
    this.morphTargets = [];
    this.usedMorphTargets = new Set();

    this.controlsById = new Map();
    this.morphControls = [];
    this.boneEntries = new Map();
    this.orderedControls = [];
    this.tempQuaternion = new THREE.Quaternion();

    if (model) {
      this._collectRigData();
      this._buildControls();
    }
  }

  prepareFrame() {
    if (!this.model) {
      return;
    }

    this.boneEntries.forEach((entry) => {
      if (entry.baseQuaternion) {
        entry.bone.quaternion.copy(entry.baseQuaternion);
      } else if (entry.restQuaternion) {
        entry.bone.quaternion.copy(entry.restQuaternion);
      }
    });
  }

  getControls() {
    return this.orderedControls.map((control) => ({
      id: control.id,
      label: control.label,
      group: control.group,
      type: control.type,
      min: control.min,
      max: control.max,
      step: control.step,
      defaultValue: control.defaultValue,
    }));
  }

  getPoseValues() {
    const values = {};
    this.orderedControls.forEach((control) => {
      values[control.id] = control.value;
    });
    return values;
  }

  setPoseValue(id, rawValue) {
    const control = this.controlsById.get(id);
    if (!control) {
      return null;
    }

    const value = clamp(Number(rawValue), control.min, control.max);
    if (Math.abs(value - control.value) < EPSILON) {
      return null;
    }

    control.value = value;

    if (control.type === 'morph') {
      this._applyMorphControl(control, value);
    }

    return control.value;
  }

  resetPose() {
    this.boneEntries.forEach((entry) => {
      if (entry.restQuaternion) {
        entry.baseQuaternion.copy(entry.restQuaternion);
        entry.bone.quaternion.copy(entry.restQuaternion);
      }
    });

    this.orderedControls.forEach((control) => {
      const next = clamp(control.defaultValue ?? 0, control.min, control.max);
      control.value = next;
      if (control.type === 'morph') {
        this._applyMorphControl(control, next);
      }
    });
    return { values: this.getPoseValues() };
  }

  applyPoseAdjustments() {
    if (!this.model) {
      return;
    }

    this.boneEntries.forEach((entry) => {
      const { bone, controls, baseQuaternion } = entry;
      baseQuaternion.copy(bone.quaternion);
      bone.quaternion.copy(baseQuaternion);
      controls.forEach((control) => {
        if (Math.abs(control.value) < EPSILON) {
          return;
        }
        this.tempQuaternion.setFromAxisAngle(control.axisVector, control.value);
        bone.quaternion.multiply(this.tempQuaternion);
      });
      bone.updateMatrixWorld(true);
    });

    this.morphControls.forEach((control) => {
      this._applyMorphControl(control, control.value);
    });
  }

  dispose() {
    this.controlsById.clear();
    this.morphControls.length = 0;
    this.boneEntries.clear();
    this.orderedControls.length = 0;
    this.skinnedMeshes.length = 0;
    this.bones.length = 0;
    this.morphTargets.length = 0;
    this.usedMorphTargets.clear();
    this.model = null;
  }

  _collectRigData() {
    this.model.traverse((child) => {
      if (child.isSkinnedMesh) {
        this.skinnedMeshes.push(child);
        this._collectBonesFromSkeleton(child.skeleton);
        this._collectMorphTargetsFromMesh(child);
      }
    });
  }

  _collectBonesFromSkeleton(skeleton) {
    if (!skeleton?.bones) {
      return;
    }

    skeleton.bones.forEach((bone) => {
      if (!bone || !bone.name) {
        return;
      }
      if (this.bones.some((entry) => entry.bone === bone)) {
        return;
      }
      const depth = this._computeBoneDepth(bone);
      this.bones.push({
        bone,
        name: bone.name,
        nameLower: bone.name.toLowerCase(),
        depth,
      });
    });
  }

  _collectMorphTargetsFromMesh(mesh) {
    const dictionary = mesh.morphTargetDictionary;
    const influences = mesh.morphTargetInfluences;
    if (!dictionary || !influences) {
      return;
    }

    Object.entries(dictionary).forEach(([name, index]) => {
      if (typeof index !== 'number') {
        return;
      }
      this.morphTargets.push({
        mesh,
        index,
        name,
        nameLower: name.toLowerCase(),
      });
    });
  }

  _buildControls() {
    CONTROL_DEFINITIONS.forEach((definition, index) => {
      const control = this._createControl(definition, index);
      if (control) {
        this.controlsById.set(control.id, control);
        this.orderedControls.push(control);
        if (control.type === 'morph') {
          this.morphControls.push(control);
        } else if (control.type === 'bone') {
          this._registerBoneControl(control);
        }
      }
    });

    const groupRank = new Map(GROUP_ORDER.map((group, rank) => [group, rank]));
    this.orderedControls.sort((a, b) => {
      const groupA = groupRank.get(a.group) ?? GROUP_ORDER.length;
      const groupB = groupRank.get(b.group) ?? GROUP_ORDER.length;
      if (groupA !== groupB) {
        return groupA - groupB;
      }
      if (a.order !== b.order) {
        return (a.order ?? 0) - (b.order ?? 0);
      }
      return a.label.localeCompare(b.label);
    });

    if (this.orderedControls.length > 0) {
      this.applyPoseAdjustments();
    }
  }

  _createControl(definition, definitionIndex) {
    if (!definition) {
      return null;
    }

    if (definition.morph) {
      const morphTarget = this._findMorphTarget(definition.morph);
      if (morphTarget) {
        const { min = 0, max = 1, step = 0.01, defaultValue = 0 } = definition.morph;
        return {
          id: definition.id,
          label: definition.label,
          group: definition.group,
          order: definition.order ?? definitionIndex,
          type: 'morph',
          min,
          max,
          step,
          defaultValue,
          value: defaultValue,
          mesh: morphTarget.mesh,
          morphIndex: morphTarget.index,
        };
      }
    }

    if (definition.bone) {
      const boneTarget = this._findBone(definition.bone);
      if (boneTarget) {
        const { min = -Math.PI, max = Math.PI, step = 0.01, defaultValue = 0 } = definition.bone;
        return {
          id: definition.id,
          label: definition.label,
          group: definition.group,
          order: definition.order ?? definitionIndex,
          type: 'bone',
          min,
          max,
          step,
          defaultValue,
          value: defaultValue,
          axis: definition.bone.axis,
          axisVector: AXIS_VECTORS[definition.bone.axis]?.clone() ?? AXIS_VECTORS.x.clone(),
          bone: boneTarget,
        };
      }
    }

    return null;
  }

  _registerBoneControl(control) {
    const bone = control.bone;
    if (!bone) {
      return;
    }

    let entry = this.boneEntries.get(bone);
    if (!entry) {
      entry = {
        bone,
        controls: [],
        baseQuaternion: bone.quaternion.clone(),
        restQuaternion: bone.quaternion.clone(),
      };
      this.boneEntries.set(bone, entry);
    }
    entry.controls.push(control);
  }

  _findMorphTarget(config) {
    const { keywords = [], prefer = [] } = config;
    if (this.morphTargets.length === 0) {
      return null;
    }

    const matches = this.morphTargets.filter((target) => {
      if (this.usedMorphTargets.has(this._morphKey(target))) {
        return false;
      }
      if (!keywords.length) {
        return true;
      }
      return keywords.some((keyword) => target.nameLower.includes(keyword));
    });

    if (!matches.length) {
      return null;
    }

    const preferred = matches.find((target) =>
      prefer.some((keyword) => target.nameLower.includes(keyword))
    );
    const result = preferred ?? matches[0];
    this.usedMorphTargets.add(this._morphKey(result));
    return result;
  }

  _findBone(config) {
    const { keywords = [], prefer = [], side } = config;
    const candidates = this.bones.filter((entry) => {
      if (!keywords.length) {
        return true;
      }
      return keywords.some((keyword) => entry.nameLower.includes(keyword));
    });

    const filtered = side ? candidates.filter((entry) => this._matchesSide(entry.nameLower, side)) : candidates;
    if (!filtered.length) {
      return null;
    }

    const preferred = prefer.length
      ? filtered.filter((entry) => prefer.some((keyword) => entry.nameLower.includes(keyword)))
      : filtered;

    const pool = preferred.length ? preferred : filtered;
    pool.sort((a, b) => {
      if (a.depth !== b.depth) {
        return a.depth - b.depth;
      }
      return a.name.localeCompare(b.name);
    });
    return pool[0]?.bone ?? null;
  }

  _matchesSide(name, side) {
    const normalized = name.toLowerCase();
    const tokens = normalized.split(/[^a-z0-9]+/).filter(Boolean);
    if (side === 'left') {
      return (
        tokens.includes('left') ||
        tokens.includes('l') ||
        normalized.includes('_l') ||
        normalized.includes('.l') ||
        normalized.endsWith('l')
      );
    }
    if (side === 'right') {
      return (
        tokens.includes('right') ||
        tokens.includes('r') ||
        normalized.includes('_r') ||
        normalized.includes('.r') ||
        normalized.endsWith('r')
      );
    }
    return true;
  }

  _computeBoneDepth(bone) {
    let depth = 0;
    let current = bone;
    while (current && current.isBone) {
      depth += 1;
      current = current.parent;
    }
    return depth;
  }

  _applyMorphControl(control, value) {
    const influences = control.mesh?.morphTargetInfluences;
    if (!influences || typeof control.morphIndex !== 'number') {
      return;
    }
    influences[control.morphIndex] = value;
  }

  _morphKey(target) {
    return `${target.mesh.uuid}:${target.index}`;
  }
}
