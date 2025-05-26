import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Ladder({ color = "#8B4513", ...props }) {
  const group = useRef();

  useFrame(() => {
    group.current.rotation.y += 0.005;
  });

  const steps = [];
  for (let i = 0; i < 6; i++) {
    steps.push(
      <mesh key={i} position={[0, i * 0.6, 0]}>
        <boxGeometry args={[1.5, 0.1, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }

  return (
    <group ref={group} {...props}>
      {/* Sisi kiri dan kanan */}
      <mesh position={[-0.75, 1.5, 0]}>
        <boxGeometry args={[0.1, 4, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.75, 1.5, 0]}>
        <boxGeometry args={[0.1, 4, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Anak tangga */}
      {steps}
    </group>
  );
}
