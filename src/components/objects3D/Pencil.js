import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Pencil({ color = "orange", ...props }) {
  const group = useRef();

  useFrame(() => {
    group.current.rotation.y += 0.005;
  });

  return (
    <group ref={group} {...props}>
      {/* Badan Pensil */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 3, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Ujung Kayu */}
      <mesh position={[0, 3.2, 0]}>
        <coneGeometry args={[0.2, 0.4, 32]} />
        <meshStandardMaterial color="#ffdd99" />
      </mesh>

      {/* Ujung Hitam (grafit) */}
      <mesh position={[0, 3.4, 0]}>
        <coneGeometry args={[0.05, 0.2, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Penghapus */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.3, 32]} />
        <meshStandardMaterial color="pink" />
      </mesh>
    </group>
  );
}
