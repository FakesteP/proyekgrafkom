import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function MagnifyingGlass({ color = "black", lensColor = "silver", ...props }) {
  const group = useRef();

  useFrame(() => {
    group.current.rotation.y += 0.005;
  });

  return (
    <group ref={group} {...props}>
      {/* Lensa */}
      <mesh>
        <torusGeometry args={[1.5, 0.2, 16, 100]} />
        <meshStandardMaterial color={lensColor} />
      </mesh>

      {/* Gagang */}
      <mesh position={[2.2, -2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.1, 0.1, 3, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}
