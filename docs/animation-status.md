# Critter Animation Compatibility Status

We validated the Frog and Lizard rigs to confirm whether the supplied `.glb` animation clips can currently run in the viewer.

## Summary

* Each critter model loads successfully, but none of the provided animation clips can be retargeted onto the meshes.
* The skeleton node names embedded in the critter meshes use the Unreal-style naming convention (e.g. `upperarm_l`, `pelvis`).
* The animation clips target a different naming scheme (e.g. `LeftArm`, `Hips`), so the animation system cannot find matching bones.
* Because of the naming mismatch, `THREE.AnimationMixer` receives clips with tracks that do not map to any bones on the loaded model, resulting in no visible motion.

## Evidence

The following Python snippet lists the number of bones in each model, the number of animation targets per idle clip, and how many animation targets do not exist on the model skeleton.

```bash
python - <<'PY'
from pygltflib import GLTF2

def compare(model_path, anim_path):
    model = GLTF2().load(model_path)
    anim = GLTF2().load(anim_path)
    model_names = {node.name for node in model.nodes if node.name}
    targets = set()
    for clip in anim.animations or []:
        for channel in clip.channels or []:
            node_idx = channel.target.node
            if node_idx is not None:
                targets.add(anim.nodes[node_idx].name)
    missing = sorted(name for name in targets if name not in model_names)
    return model_names, targets, missing

for critter in (
    ('Frog', 'assets/models/critters/models/SK_TH_Frog_Rigged_01.glb', 'assets/models/critters/animations/TH_Frog_Idle.glb'),
    ('Lizard', 'assets/models/critters/models/SK_TH_Lizard_Rigged_01.glb', 'assets/models/critters/animations/TH_Lizard_Idle.glb'),
):
    name, model_path, anim_path = critter
    model_names, targets, missing = compare(model_path, anim_path)
    print(name)
    print('  model bones:', len(model_names))
    print('  animation targets:', len(targets))
    print('  unmatched names:', len(missing))
    if missing:
        print('   sample:', missing[:10])
    print()
PY
```

Sample output:

```
Frog
  model bones: 68
  animation targets: 47
  unmatched names: 47
   sample: ['Head', 'Hips', 'LeftArm', 'LeftFoot', 'LeftForeArm', 'LeftHand', 'LeftHandIndex1', 'LeftHandIndex2', 'LeftHandIndex3', 'LeftHandMiddle1']

Lizard
  model bones: 72
  animation targets: 59
  unmatched names: 59
   sample: ['Head', 'Hips', 'LeftArm', 'LeftFoot', 'LeftForeArm', 'LeftHand', 'LeftHandIndex1', 'LeftHandIndex2', 'LeftHandIndex3', 'LeftHandMiddle1']
```

## Next Steps

To enable animation playback, we need either:

1. Rig updates so that the critter skeleton uses the same joint names referenced by the animation clips, or
2. Retargeted animation clips whose track names match the bones exposed by the current rig.

Without one of those adjustments, the viewer cannot animate the Frog or Lizard models.
