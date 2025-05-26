// src/components/ControlPanel.js
import React from "react";

export default function ControlPanel({
  transform2D,
  transform3D,
  updateTransform2D,
  updateTransform3D,
}) {
  return (
    
    <div className="mt-4 border-t pt-4">
      <h2 className="text-lg font-semibold mb-2">Panel Kontrol</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {/* Translasi 2D */}
        <button onClick={() => updateTransform2D({ x: transform2D.x + 10 })} className="btn">
          Geser Kanan 2D →
        </button>
        <button onClick={() => updateTransform2D({ x: transform2D.x - 10 })} className="btn">
          Geser Kiri 2D ←
        </button>
        <button onClick={() => updateTransform2D({ y: transform2D.y - 10 })} className="btn">
          Geser Atas 2D ↑
        </button>
        <button onClick={() => updateTransform2D({ y: transform2D.y + 10 })} className="btn">
          Geser Bawah 2D ↓
        </button>

        {/* Rotasi 2D */}
        <button onClick={() => updateTransform2D({ rotation: transform2D.rotation + 0.1 })} className="btn">
          Putar 2D ↻
        </button>

        {/* Skala 2D */}
        <button onClick={() => updateTransform2D({ scale: transform2D.scale + 0.1 })} className="btn">
          Perbesar 2D
        </button>
        <button
          onClick={() =>
            updateTransform2D({ scale: Math.max(0.1, transform2D.scale - 0.1) })
          }
          className="btn"
        >
          Perkecil 2D
        </button>

        {/* Ubah warna 2D */}
        <button
          onClick={() =>
            updateTransform2D({
              fillColor: transform2D.fillColor === "#FFD700" ? "#FF6347" : "#FFD700",
            })
          }
          className="btn"
        >
          Ganti Warna 2D
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Translasi 3D */}
        <button
          onClick={() =>
            updateTransform3D({
              position: { x: transform3D.position.x + 0.1 },
            })
          }
          className="btn"
        >
          Geser Kanan 3D →
        </button>
        <button
          onClick={() =>
            updateTransform3D({
              position: { x: transform3D.position.x - 0.1 },
            })
          }
          className="btn"
        >
          Geser Kiri 3D ←
        </button>
        <button
          onClick={() =>
            updateTransform3D({
              position: { y: transform3D.position.y + 0.1 },
            })
          }
          className="btn"
        >
          Geser Atas 3D ↑
        </button>
        <button
          onClick={() =>
            updateTransform3D({
              position: { y: transform3D.position.y - 0.1 },
            })
          }
          className="btn"
        >
          Geser Bawah 3D ↓
        </button>

        {/* Rotasi 3D */}
        <button
          onClick={() =>
            updateTransform3D({
              rotation: { y: transform3D.rotation.y + 0.1 },
            })
          }
          className="btn"
        >
          Putar 3D ↻
        </button>

        {/* Skala 3D */}
        <button
          onClick={() =>
            updateTransform3D({ scale: transform3D.scale + 0.1 })
          }
          className="btn"
        >
          Perbesar 3D
        </button>
        <button
          onClick={() =>
            updateTransform3D({ scale: Math.max(0.1, transform3D.scale - 0.1) })
          }
          className="btn"
        >
          Perkecil 3D
        </button>

        {/* Ubah warna 3D */}
        <button
          onClick={() =>
            updateTransform3D({
              color: transform3D.color === 0x00ff00 ? 0xff6347 : 0x00ff00,
            })
          }
          className="btn"
        >
          Ganti Warna 3D
        </button>
      </div>

      <style>{`
        .btn {
          background-color: #2563eb;
          color: white;
          padding: 8px 12px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          user-select: none;
          transition: background-color 0.2s ease;
        }
        .btn:hover {
          background-color: #1d4ed8;
        }
      `}</style>
    </div>
  );
}
