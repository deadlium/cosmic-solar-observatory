"use client";

import React from "react";
import { Stars } from "@react-three/drei";

export default function Background() {
  return (
    <Stars
      radius={300}
      depth={60}
      count={20000}
      factor={7}
      saturation={0}
      fade
      speed={1}
    />
  );
}
