import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { HexColorPicker } from "react-colorful";
import "./index.css";

import Pencil from "./components/objects3D/Pencil";
import Ladder from "./components/objects3D/Ladder";
import MagnifyingGlass from "./components/objects3D/MagnifyingGlass";

import BubbleChat from "./components/objects2D/BubbleChat";
import RightTrapezoid from "./components/objects2D/RightTrapezoid";
import Sun from "./components/objects2D/Sun";

const defaultTransforms = {
  // 3D objects - posisi tengah di 3D space
  pencil: { x: 0, y: 0, z: 0, scale: 1, rotateY: 0, color: "#ff0000" },
  ladder: { x: 0, y: 0, z: 0, scale: 1, rotateY: 0, color: "#00ff00" },
  magnifier: { x: 0, y: 0, z: 0, scale: 1, rotateY: 0, color: "#0000ff" },
  // 2D objects - posisi tengah di SVG canvas (200, 150 adalah tengah dari viewBox 400x300)
  bubble: {
    x: 200,
    y: 150,
    scale: 1,
    rotate: 0,
    color: "skyblue",
    border: "black",
  },
  trapezoid: { x: 200, y: 150, scale: 1, color: "green", border: "black" },
  sun: { x: 200, y: 150, scale: 1, color: "yellow", border: "orange" },
};

export default function App() {
  const [selected, setSelected] = useState("pencil");
  const [transforms, setTransforms] = useState(defaultTransforms);
  const orbitControlsRef = useRef();
  let startMouseX, startMouseY;
  let startObjX, startObjY;

  // Ref untuk drag state
  const dragState = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (!selected) return;
      setTransforms((prev) => {
        const obj = { ...prev[selected] };
        switch (e.key) {
          case "ArrowUp":
            if ("y" in obj) obj.y -= 10;
            else if ("rotate" in obj) obj.rotate += 15;
            break;
          case "ArrowDown":
            if ("y" in obj) obj.y += 10;
            else if ("rotate" in obj) obj.rotate -= 15;
            break;
          case "ArrowLeft":
            if ("x" in obj) obj.x -= 10;
            else if ("rotateY" in obj) obj.rotateY -= 0.1;
            break;
          case "ArrowRight":
            if ("x" in obj) obj.x += 10;
            else if ("rotateY" in obj) obj.rotateY += 0.1;
            break;
          case "+":
          case "=":
            obj.scale = (obj.scale || 1) + 0.1;
            break;
          case "-":
          case "_":
            obj.scale = Math.max(0.1, (obj.scale || 1) - 0.1);
            break;
          default:
            return prev;
        }
        return { ...prev, [selected]: obj };
      });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected]);

  // Fungsi drag mulai
  const onMouseDown2D = (e) => {
    if (!["bubble", "trapezoid", "sun"].includes(selected)) return;

    dragState.current.dragging = true;
    dragState.current.startX = e.clientX;
    dragState.current.startY = e.clientY;
    dragState.current.origX = transforms[selected].x;
    dragState.current.origY = transforms[selected].y;

    // Pasang listener global saat drag
    window.addEventListener("mousemove", onMouseMove2D);
    window.addEventListener("mouseup", onMouseUp2D);

    // Cegah seleksi teks saat drag
    e.preventDefault();
  };

  // Fungsi drag bergerak
  const onMouseMove2D = (e) => {
    if (!dragState.current.dragging) return;

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;

    setTransforms((prev) => ({
      ...prev,
      [selected]: {
        ...prev[selected],
        x: dragState.current.origX + dx,
        y: dragState.current.origY + dy,
      },
    }));
  };

  // Fungsi drag selesai
  const onMouseUp2D = () => {
    if (dragState.current.dragging) {
      dragState.current.dragging = false;

      // Hapus listener global
      window.removeEventListener("mousemove", onMouseMove2D);
      window.removeEventListener("mouseup", onMouseUp2D);
    }
  };

  // Reset transformasi - DIPERBAIKI untuk kembali ke tengah
  const resetSelectedTransform = () => {
    setTransforms((prev) => ({
      ...prev,
      [selected]: { ...defaultTransforms[selected] },
    }));
    
    // Reset kamera untuk objek 3D agar terlihat di tengah
    if (["pencil", "ladder", "magnifier"].includes(selected) && orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  };

  // Render objek
  const renderObject = () => {
    switch (selected) {
      case "pencil":
        return (
          <Pencil
            position={[
              transforms.pencil.x,
              transforms.pencil.y,
              transforms.pencil.z,
            ]}
            scale={transforms.pencil.scale}
            rotation={[0, transforms.pencil.rotateY, 0]}
            color={transforms.pencil.color}
          />
        );
      case "ladder":
        return (
          <Ladder
            position={[
              transforms.ladder.x,
              transforms.ladder.y,
              transforms.ladder.z,
            ]}
            scale={transforms.ladder.scale}
            rotation={[0, transforms.ladder.rotateY, 0]}
            color={transforms.ladder.color}
          />
        );
      case "magnifier":
        return (
          <MagnifyingGlass
            position={[
              transforms.magnifier.x,
              transforms.magnifier.y,
              transforms.magnifier.z,
            ]}
            scale={transforms.magnifier.scale}
            rotation={[0, transforms.magnifier.rotateY, 0]}
            color={transforms.magnifier.color}
          />
        );
      case "bubble":
        return (
          <BubbleChat
            transform={`translate(${transforms.bubble.x},${
              transforms.bubble.y
            }) rotate(${transforms.bubble.rotate || 0}) scale(${
              transforms.bubble.scale
            })`}
            color={transforms.bubble.color}
            border={transforms.bubble.border}
            onMouseDown={onMouseDown2D}
            style={{ cursor: "grab" }}
          />
        );
      case "trapezoid":
        return (
          <RightTrapezoid
            transform={`translate(${transforms.trapezoid.x},${transforms.trapezoid.y}) scale(${transforms.trapezoid.scale})`}
            color={transforms.trapezoid.color}
            border={transforms.trapezoid.border}
            onMouseDown={onMouseDown2D}
            style={{ cursor: "grab" }}
          />
        );
      case "sun":
        return (
          <Sun
            transform={`translate(${transforms.sun.x},${transforms.sun.y}) scale(${transforms.sun.scale})`}
            color={transforms.sun.color}
            border={transforms.sun.border}
            onMouseDown={onMouseDown2D}
            style={{ cursor: "grab" }}
          />
        );

      default:
        return null;
    }
  };

  const is3D = ["pencil", "ladder", "magnifier"].includes(selected);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Pilih Objek</h2>
        <nav className="object-buttons">
          {["pencil", "ladder", "magnifier", "bubble", "trapezoid", "sun"].map(
            (obj) => (
              <button
                key={obj}
                className={`btn-object ${selected === obj ? "active" : ""}`}
                onClick={() => setSelected(obj)}
              >
                {obj.charAt(0).toUpperCase() + obj.slice(1)}
              </button>
            )
          )}
        </nav>

        {selected && (
          <>
            <div className="controls">
              <h3>Transformasi</h3>
              <p>Gunakan Arrow keys untuk translasi/rotasi.</p>
              <p>Gunakan +/- untuk scale.</p>

              <button className="btn-reset" onClick={resetSelectedTransform}>
                Reset Transformasi
              </button>

              <h3>Warna</h3>
              <HexColorPicker
                color={transforms[selected].color || "#ffffff"}
                onChange={(color) =>
                  setTransforms((prev) => ({
                    ...prev,
                    [selected]: { ...prev[selected], color },
                  }))
                }
              />
            </div>
          </>
        )}
      </aside>

      {/* Main content */}
      <main className="main-content">
        {is3D ? (
          <Canvas camera={{ position: [6, 6, 6], fov: 50 }} className="canvas">
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            <OrbitControls 
              ref={orbitControlsRef}
              target={[0, 0, 0]}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
            />
            {renderObject()}
          </Canvas>
        ) : (
          <svg
            className="svg-canvas"
            viewBox="0 0 400 300"
            xmlns="http://www.w3.org/2000/svg"
            style={{ userSelect: "none" }}
          >
            {renderObject()}
          </svg>
        )}
      </main>
    </div>
  );
}