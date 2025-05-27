import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Scissor({ color = "silver", ...props }) {
  const group = useRef();

  useFrame(() => {
    group.current.rotation.y += 0.005; // rotasi halus
  });

  return (
    <group ref={group} {...props}>
      {/* Bilah gunting kiri */}
      <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 8]}>
        <boxGeometry args={[0.05, 1.5, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Bilah gunting kanan */}
      <mesh position={[0.15, 0, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <boxGeometry args={[0.05, 1.5, 0.1]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Handle kiri */}
      <mesh position={[-0.3, -0.75, 0]}>
        <torusGeometry args={[0.2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* Handle kanan */}
      <mesh position={[0.3, -0.75, 0]}>
        <torusGeometry args={[0.2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#555" />
      </mesh>
    </group>
  );
}
