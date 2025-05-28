import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { HexColorPicker } from "react-colorful";
import "./index.css";
import { useThree } from '@react-three/fiber';

import Scissor from "./components/objects3D/Scissor";
import Ladder from "./components/objects3D/Ladder";
import MagnifyingGlass from "./components/objects3D/MagnifyingGlass";

import BubbleChat from "./components/objects2D/BubbleChat";
import RightTrapezoid from "./components/objects2D/RightTrapezoid";
import Pacman from "./components/objects2D/Pacman";

const defaultTransforms = {
  // 3D objects - posisi tengah di 3D space
  scissor: { x: 0, y: 0, z: 0, scale: 1, rotateY: 0, color: "#C0C0C0" },
  ladder: { x: 0, y: 0, z: 0, scale: 1, rotateY: 0, color: "#00ff00" },
  magnifier: { x: 0, y: 0, z: 0, scale: 1, rotateY: 0, color: "#0000ff" },
  // 2D objects - posisi tengah di SVG canvas (200, 150 adsalah tengah dari viewBox 400x300)
  bubble: {
    x: 200,
    y: 150,
    scale: 1,
    rotate: 0,
    color: "skyblue",
    border: "black",
  },
  trapezoid: { x: 200, y: 150, scale: 1, color: "green", border: "black" },
  pacman: {
    x: 200,
    y: 150,
    scale: 1,
    rotate: 0,
    color: "#FFD700",
    border: "#000",
  },
};

export default function App() {
  const [selected, setSelected] = useState("scissor");
  const [transforms, setTransforms] = useState(defaultTransforms);
  const orbitControlsRef = useRef();

  const SaveRefs = ({ setRefs }) => {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    setRefs({ gl, scene, camera });
  }, [gl, scene, camera, setRefs]);

  return null;
};

  // Ref untuk drag state
  const dragState = useRef({
    dragging: false,
    rotating: false,
    scaling: false, // TAMBAH
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    origRotate: 0,
    origScale: 1, // TAMBAH
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
    if (!["bubble", "trapezoid", "pacman"].includes(selected)) return;

    if (e.button === 2) {
      // klik kanan untuk rotasi
      dragState.current.rotating = true;
      dragState.current.startX = e.clientX;
      dragState.current.startY = e.clientY;
      dragState.current.origRotate = transforms[selected].rotate || 0;
      window.addEventListener("mousemove", onMouseMoveRotate2D);
      window.addEventListener("mouseup", onMouseUpRotate2D);
      e.preventDefault();
      return;
    }

    if (e.shiftKey) {
      // SHIFT + klik kiri untuk scale
      dragState.current.scaling = true;
      dragState.current.startY = e.clientY;
      dragState.current.origScale = transforms[selected].scale || 1;
      window.addEventListener("mousemove", onMouseMoveScale2D);
      window.addEventListener("mouseup", onMouseUpScale2D);
      e.preventDefault();
      return;
    }

    dragState.current.dragging = true;
    dragState.current.startX = e.clientX;
    dragState.current.startY = e.clientY;
    dragState.current.origX = transforms[selected].x;
    dragState.current.origY = transforms[selected].y;
    window.addEventListener("mousemove", onMouseMove2D);
    window.addEventListener("mouseup", onMouseUp2D);
    e.preventDefault();
  };

  // Fungsi rotasi bergerak
  const onMouseMoveRotate2D = (e) => {
    if (!dragState.current.rotating) return;
    const { startX, startY, origRotate } = dragState.current;
    // Ambil pusat objek
    const cx = transforms[selected].x;
    const cy = transforms[selected].y;
    // Sudut awal mouse (relatif ke pusat objek, diambil sekali saat mouse down)
    const angle0 = Math.atan2(startY - cy, startX - cx);
    // Sudut sekarang (relatif ke pusat objek, posisi mouse sekarang)
    const angle1 = Math.atan2(e.clientY - cy, e.clientX - cx);
    // Selisih sudut
    let delta = angle1 - angle0;
    // Normalisasi delta ke range -PI..PI
    delta = ((delta + Math.PI) % (2 * Math.PI)) - Math.PI;
    setTransforms((prev) => ({
      ...prev,
      [selected]: {
        ...prev[selected],
        rotate: origRotate + delta,
      },
    }));
  };

  // Fungsi rotasi selesai
  const onMouseUpRotate2D = () => {
    if (dragState.current.rotating) {
      dragState.current.rotating = false;
      window.removeEventListener("mousemove", onMouseMoveRotate2D);
      window.removeEventListener("mouseup", onMouseUpRotate2D);
    }
  };

  // Fungsi scale bergerak
  const onMouseMoveScale2D = (e) => {
    if (!dragState.current.scaling) return;
    const { startY, origScale } = dragState.current;
    // Semakin mouse ke atas, semakin besar scale, ke bawah semakin kecil
    const dy = e.clientY - startY;
    let newScale = origScale * (1 + dy * -0.01); // sensitivitas 0.01
    newScale = Math.max(0.1, Math.min(10, newScale));
    setTransforms((prev) => ({
      ...prev,
      [selected]: {
        ...prev[selected],
        scale: newScale,
      },
    }));
  };

  // Fungsi scale selesai
  const onMouseUpScale2D = () => {
    if (dragState.current.scaling) {
      dragState.current.scaling = false;
      window.removeEventListener("mousemove", onMouseMoveScale2D);
      window.removeEventListener("mouseup", onMouseUpScale2D);
    }
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
    if (
      ["scissor", "ladder", "magnifier"].includes(selected) &&
      orbitControlsRef.current
    ) {
      orbitControlsRef.current.reset();
    }
  };

  const handleSave = () => {
    const is3D = ["scissor", "ladder", "magnifier"].includes(selected);
    
    if (is3D && window.__threeRefs) {
      const { gl, scene, camera } = window.__threeRefs;
      gl.render(scene, camera); // Pastikan render dulu

      gl.domElement.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${selected}-3d-image.png`;
          a.click();
          URL.revokeObjectURL(url);
        } else {
          console.error("Gagal membuat blob dari canvas WebGL");
        }
      }, "image/png");
    } else {
      // Untuk objek 2D (SVG)
      const svg = document.querySelector('.svg-canvas');
      if (!svg) {
        console.error('SVG element not found!');
        return;
      }
      
      // Konversi SVG ke canvas lalu ke PNG
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Set ukuran canvas sesuai dengan SVG
      canvas.width = 400;
      canvas.height = 300;
      
      img.onload = function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${selected}-2d-image.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  // Render objek
  const renderObject = () => {
    switch (selected) {
      case "scissor":
        return (
          <Scissor
            position={[
              transforms.scissor.x,
              transforms.scissor.y,
              transforms.scissor.z,
            ]}
            scale={transforms.scissor.scale}
            rotation={[0, transforms.scissor.rotateY, 0]}
            color={transforms.scissor.color}
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
            }) rotate(${
              ((transforms.bubble.rotate || 0) * 180) / Math.PI
            }) scale(${transforms.bubble.scale})`}
            color={transforms.bubble.color}
            border={transforms.bubble.border}
            onMouseDown={onMouseDown2D}
            style={{ cursor: "grab" }}
          />
        );
      case "trapezoid":
        return (
          <RightTrapezoid
            transform={`translate(${transforms.trapezoid.x},${
              transforms.trapezoid.y
            }) rotate(${
              ((transforms.trapezoid.rotate || 0) * 180) / Math.PI
            }) scale(${transforms.trapezoid.scale})`}
            color={transforms.trapezoid.color}
            border={transforms.trapezoid.border}
            onMouseDown={onMouseDown2D}
            style={{ cursor: "grab" }}
          />
        );
      case "pacman":
        return (
          <Pacman
            transform={`translate(${transforms.pacman.x},${
              transforms.pacman.y
            }) rotate(${
              ((transforms.pacman.rotate || 0) * 180) / Math.PI
            }) scale(${transforms.pacman.scale})`}
            color={transforms.pacman.color}
            border={transforms.pacman.border}
            onMouseDown={onMouseDown2D}
            style={{ cursor: "grab" }}
          />
        );

      default:
        return null;
    }
  };

  const is3D = ["scissor", "ladder", "magnifier"].includes(selected);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Pilih Objek</h2>
        <nav className="object-buttons">
          {[
            "scissor",
            "ladder",
            "magnifier",
            "bubble",
            "trapezoid",
            "pacman",
          ].map((obj) => (
            <button
              key={obj}
              className={`btn-object ${selected === obj ? "active" : ""}`}
              onClick={() => setSelected(obj)}
            >
              {obj.charAt(0).toUpperCase() + obj.slice(1)}
            </button>
          ))}

          <button className="btn-save" onClick={handleSave}>
            💾 Save as PNG
          </button>
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
        <div
          className="top-menu"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "#fff",
            zIndex: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            padding: "10px 0",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 32,
          }}
        >
          {/* Card Rotasi */}
          <div
            style={{
              background: "#f3f4f6",
              borderRadius: 10,
              padding: "10px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <label style={{ fontWeight: 600, marginRight: 4 }}>Rotasi</label>
            <input
              type="number"
              step="1"
              min="0"
              max="359"
              value={(() => {
                if (is3D)
                  return (
                    Math.round(
                      ((transforms[selected].rotateY || 0) * 180) / Math.PI
                    ) % 360
                  );
                let val = Math.round(
                  ((transforms[selected].rotate || 0) * 180) / Math.PI
                );
                return ((val % 360) + 360) % 360;
              })()}
              onChange={(e) => {
                let deg = parseFloat(e.target.value) || 0;
                if (deg > 359) deg = 359;
                if (deg < 0) deg = 0;
                setTransforms((prev) => ({
                  ...prev,
                  [selected]: {
                    ...prev[selected],
                    ...(is3D
                      ? { rotateY: (deg * Math.PI) / 180 }
                      : { rotate: (deg * Math.PI) / 180 }),
                  },
                }));
              }}
              style={{ width: 48, margin: "0 6px" }}
            />
            <span style={{ fontSize: 14, marginRight: 4 }}>°</span>
            <input
              type="range"
              min="0"
              max="359"
              value={(() => {
                if (is3D)
                  return (
                    Math.round(
                      ((transforms[selected].rotateY || 0) * 180) / Math.PI
                    ) % 360
                  );
                let val = Math.round(
                  ((transforms[selected].rotate || 0) * 180) / Math.PI
                );
                return ((val % 360) + 360) % 360;
              })()}
              onChange={(e) => {
                let deg = parseFloat(e.target.value) || 0;
                setTransforms((prev) => ({
                  ...prev,
                  [selected]: {
                    ...prev[selected],
                    ...(is3D
                      ? { rotateY: (deg * Math.PI) / 180 }
                      : { rotate: (deg * Math.PI) / 180 }),
                  },
                }));
              }}
              style={{ width: 100 }}
            />
          </div>
          {/* Card Skala */}
          <div
            style={{
              background: "#f3f4f6",
              borderRadius: 10,
              padding: "10px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <label style={{ fontWeight: 600, marginRight: 4 }}>Skala</label>
            <input
              type="number"
              step="0.01"
              min="0.1"
              max="10"
              value={transforms[selected].scale}
              onChange={(e) => {
                let scale = parseFloat(e.target.value) || 1;
                scale = Math.max(0.1, Math.min(10, scale));
                setTransforms((prev) => ({
                  ...prev,
                  [selected]: {
                    ...prev[selected],
                    scale,
                  },
                }));
              }}
              style={{ width: 48, margin: "0 6px" }}
            />
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.01"
              value={transforms[selected].scale}
              onChange={(e) => {
                let scale = parseFloat(e.target.value) || 1;
                scale = Math.max(0.1, Math.min(10, scale));
                setTransforms((prev) => ({
                  ...prev,
                  [selected]: {
                    ...prev[selected],
                    scale,
                  },
                }));
              }}
              style={{ width: 100 }}
            />
          </div>
        </div>
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
            <SaveRefs setRefs={(val) => (window.__threeRefs = val)} />
            {renderObject()}
          </Canvas>
        ) : (
          <svg
            className="svg-canvas"
            viewBox="0 0 400 300"
            xmlns="http://www.w3.org/2000/svg"
            style={{ userSelect: "none" }}
            onContextMenu={(e) => e.preventDefault()}
            onWheel={(e) => {
              if (["bubble", "trapezoid", "pacman"].includes(selected)) {
                e.preventDefault();
                setTransforms((prev) => {
                  const obj = prev[selected];
                  let newScale = obj.scale + (e.deltaY < 0 ? 0.1 : -0.1);
                  newScale = Math.max(0.1, Math.min(10, newScale));
                  return {
                    ...prev,
                    [selected]: {
                      ...obj,
                      scale: newScale,
                    },
                  };
                });
              }
            }}
          >
            {renderObject()}
          </svg>
        )}
      </main>
    </div>
  );
}
