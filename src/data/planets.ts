export interface PlanetData {
  name: string;
  radius: number;
  distance: number;
  orbitalPeriod: number; // in years (scaled)
  rotationPeriod: number; // in days (scaled)
  texture: string;
  color: string;
  description: string;
  radiusKm: number;
  distanceFromSun: number; // million km
  funFacts: string[];
  hasRings?: boolean;
}

export const PLANETS: PlanetData[] = [
  {
    name: "Mercury",
    radius: 0.8,
    distance: 15,
    orbitalPeriod: 0.24,
    rotationPeriod: 58.6,
    texture: "/textures/mercury.png",
    color: "#A5A5A5",
    description: "The smallest planet in our solar system and closest to the Sun—is only slightly larger than Earth's Moon.",
    radiusKm: 2440,
    distanceFromSun: 57.9,
    funFacts: ["A day on Mercury takes 59 Earth days.", "Mercury is the fastest planet, traveling through space at nearly 47 kilometers per second."],
  },
  {
    name: "Venus",
    radius: 1.2,
    distance: 22,
    orbitalPeriod: 0.62,
    rotationPeriod: -243, // Retrograde
    texture: "/textures/venus.png",
    color: "#E3BB76",
    description: "Spinning slowly in the opposite direction from most planets. Venus is the hottest planet in our solar system.",
    radiusKm: 6052,
    distanceFromSun: 108.2,
    funFacts: ["Venus rotates backwards on its axis.", "It has a thick, toxic atmosphere filled with carbon dioxide."],
  },
  {
    name: "Earth",
    radius: 1.3,
    distance: 30,
    orbitalPeriod: 1,
    rotationPeriod: 1,
    texture: "/textures/earth.png",
    color: "#2271B3",
    description: "Our home planet is the only place we know of so far that’s inhabited by living things.",
    radiusKm: 6371,
    distanceFromSun: 149.6,
    funFacts: ["Earth is the only planet with liquid water on its surface.", "Our atmosphere protects us from incoming meteoroids."],
  },
  {
    name: "Mars",
    radius: 1.0,
    distance: 40,
    orbitalPeriod: 1.88,
    rotationPeriod: 1.03,
    texture: "/textures/mars.png",
    color: "#E27B58",
    description: "Mars is a dusty, cold, desert world with a very thin atmosphere.",
    radiusKm: 3390,
    distanceFromSun: 227.9,
    funFacts: ["Mars is known as the Red Planet.", "It has the largest volcano in the solar system, Olympus Mons."],
  },
  {
    name: "Jupiter",
    radius: 4.5,
    distance: 65,
    orbitalPeriod: 11.86,
    rotationPeriod: 0.41,
    texture: "/textures/jupiter.png",
    color: "#D39C7E",
    description: "Jupiter is more than twice as massive than the other planets of our solar system combined.",
    radiusKm: 69911,
    distanceFromSun: 778.6,
    funFacts: ["Jupiter has more than 75 moons.", "The Great Red Spot is a giant storm that has raged for hundreds of years."],
  },
  {
    name: "Saturn",
    radius: 3.8,
    distance: 90,
    orbitalPeriod: 29.45,
    rotationPeriod: 0.45,
    texture: "/textures/saturn.png",
    color: "#C5AB6E",
    description: "Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system.",
    radiusKm: 58232,
    distanceFromSun: 1433.5,
    funFacts: ["Saturn's rings are made of chunks of ice and rock.", "It could float in water because it is mostly made of gas."],
    hasRings: true,
  },
  {
    name: "Uranus",
    radius: 2.5,
    distance: 120,
    orbitalPeriod: 84.01,
    rotationPeriod: -0.72, // Retrograde
    texture: "/textures/uranus.png",
    color: "#B5E3E3",
    description: "Uranus is the only planet whose equator is nearly at a right angle to its orbit.",
    radiusKm: 25362,
    distanceFromSun: 2872.5,
    funFacts: ["Uranus rotates on its side.", "It was the first planet found with the aid of a telescope."],
  },
  {
    name: "Neptune",
    radius: 2.4,
    distance: 145,
    orbitalPeriod: 164.8,
    rotationPeriod: 0.67,
    texture: "/textures/neptune.png",
    color: "#6081FF",
    description: "Dark, cold, and whipped by supersonic winds, ice giant Neptune is the eighth and most distant planet.",
    radiusKm: 24622,
    distanceFromSun: 4495.1,
    funFacts: ["Neptune is the windiest planet.", "It is 30 times as far from the Sun as Earth is."],
  },
];
