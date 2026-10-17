import * as THREE from "three";

export const HELICAL_CONSTANTS = {
  INCLINATION: (60 * Math.PI) / 180, // ~60 degree tilt of ecliptic relative to galactic apex
  FORWARD_SPEED: 16, // forward velocity units/sec
  TRAIL_POINTS: 140, // number of points for helical trail
  TRAIL_DURATION: 4.5, // seconds of past trajectory to render
};

export type MotionMode = "helical" | "circular";

/**
 * Returns the Sun's position in world space at time t.
 */
export function getSunPosition(
  t: number,
  motionMode: MotionMode,
  forwardSpeed = HELICAL_CONSTANTS.FORWARD_SPEED
): THREE.Vector3 {
  if (motionMode === "circular") {
    return new THREE.Vector3(0, 0, 0);
  }
  return new THREE.Vector3(0, 0, t * forwardSpeed);
}

/**
 * Returns a planet's position in world space at time t.
 */
export function getPlanetPosition(
  distance: number,
  orbitalPeriod: number,
  t: number,
  motionMode: MotionMode,
  forwardSpeed = HELICAL_CONSTANTS.FORWARD_SPEED
): THREE.Vector3 {
  const speed = (2 * Math.PI) / (orbitalPeriod * 20);
  const angle = t * speed;

  if (motionMode === "circular") {
    return new THREE.Vector3(
      distance * Math.cos(angle),
      0,
      distance * Math.sin(angle)
    );
  }

  // Helical vortex model:
  // 1. Orbital position on the plane
  const x = distance * Math.cos(angle);
  const zLocal = distance * Math.sin(angle);

  // 2. Inclination rotation around X axis (~60 deg)
  const cosInc = Math.cos(HELICAL_CONSTANTS.INCLINATION);
  const sinInc = Math.sin(HELICAL_CONSTANTS.INCLINATION);

  // 3. Trailing vortex offset (outer planets trail slightly behind the leading Sun)
  const dragOffset = distance * 0.12;

  const y = -zLocal * sinInc;
  const z = t * forwardSpeed + zLocal * cosInc - dragOffset;

  return new THREE.Vector3(x, y, z);
}

/**
 * Calculates the 3D orientation quaternion for a planet with axial tilt.
 * For Uranus (tilt = 97.77°), this orients the rotation axis along the radial
 * direction in the orbital plane so that as it rotates, it visually rolls
 * forward along its orbit like a ball.
 */
export function getPlanetOrientation(
  orbitalPeriod: number,
  t: number,
  axialTiltDeg: number,
  motionMode: MotionMode
): THREE.Quaternion {
  const speed = (2 * Math.PI) / (orbitalPeriod * 20);
  const theta = t * speed;
  const tiltRad = (axialTiltDeg * Math.PI) / 180;

  let N: THREE.Vector3;
  let R: THREE.Vector3;
  let T: THREE.Vector3;

  if (motionMode === "circular") {
    N = new THREE.Vector3(0, 1, 0);
    R = new THREE.Vector3(Math.cos(theta), 0, Math.sin(theta)).normalize();
    T = new THREE.Vector3(-Math.sin(theta), 0, Math.cos(theta)).normalize();
  } else {
    const cosInc = Math.cos(HELICAL_CONSTANTS.INCLINATION);
    const sinInc = Math.sin(HELICAL_CONSTANTS.INCLINATION);
    N = new THREE.Vector3(0, cosInc, sinInc).normalize();
    R = new THREE.Vector3(
      Math.cos(theta),
      -Math.sin(theta) * sinInc,
      Math.sin(theta) * cosInc
    ).normalize();
    T = new THREE.Vector3(
      -Math.sin(theta),
      -Math.cos(theta) * sinInc,
      Math.cos(theta) * cosInc
    ).normalize();
  }

  // Local Y axis in world space: tilted relative to orbit normal N
  const Yprime = new THREE.Vector3()
    .addScaledVector(N, Math.cos(tiltRad))
    .addScaledVector(R, Math.sin(tiltRad))
    .normalize();

  // Local Z axis in world space: orbital tangent vector
  const Zprime = T.clone();

  // Local X axis: orthogonal complement
  const Xprime = new THREE.Vector3().crossVectors(Yprime, Zprime).normalize();

  const mat = new THREE.Matrix4().makeBasis(Xprime, Yprime, Zprime);
  return new THREE.Quaternion().setFromRotationMatrix(mat);
}

/**
 * Prepares a Float32Array of trail vertices sampled backwards in time.
 */
export function populatePlanetTrail(
  positions: Float32Array,
  colors: Float32Array,
  baseColor: THREE.Color,
  distance: number,
  orbitalPeriod: number,
  currentTime: number,
  motionMode: MotionMode,
  forwardSpeed = HELICAL_CONSTANTS.FORWARD_SPEED,
  numPoints = HELICAL_CONSTANTS.TRAIL_POINTS,
  duration = HELICAL_CONSTANTS.TRAIL_DURATION
) {
  for (let i = 0; i < numPoints; i++) {
    const fraction = i / (numPoints - 1); // 0 at head (current), 1 at tail (past)
    const t = currentTime - fraction * duration;
    const pos = getPlanetPosition(distance, orbitalPeriod, t, motionMode, forwardSpeed);

    positions[i * 3] = pos.x;
    positions[i * 3 + 1] = pos.y;
    positions[i * 3 + 2] = pos.z;

    // Fade color to black/transparent at the tail
    const fade = Math.pow(1 - fraction, 1.8);
    colors[i * 3] = baseColor.r * fade;
    colors[i * 3 + 1] = baseColor.g * fade;
    colors[i * 3 + 2] = baseColor.b * fade;
  }
}
