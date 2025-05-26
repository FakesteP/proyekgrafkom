import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scene3D({ transform }) {
  const mountRef = useRef(null);
  const meshRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      400 / 300,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(400, 300);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: transform.color });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.position.set(
      transform.position.x,
      transform.position.y,
      transform.position.z
    );
    meshRef.current.rotation.set(
      transform.rotation.x,
      transform.rotation.y,
      transform.rotation.z
    );
    meshRef.current.scale.set(transform.scale, transform.scale, transform.scale);
    meshRef.current.material.color.set(transform.color);
  }, [transform]);

  return <div ref={mountRef} />;
}
