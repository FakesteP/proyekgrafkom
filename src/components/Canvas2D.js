import React, { useRef, useEffect, useState } from "react";

export default function Canvas2D({ objects, selectedId, onUpdate, onSelect }) {
  const canvasRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    objects.forEach((obj) => {
      ctx.save();
      ctx.translate(obj.x, obj.y);
      ctx.rotate(obj.rotation);
      ctx.scale(obj.scale, obj.scale);

      // Border jika selected
      if (obj.id === selectedId) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
      } else {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
      }

      // Bubble Chat (lingkaran)
      ctx.fillStyle = obj.fillColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, 40, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    });
  }, [objects, selectedId]);

  // Fungsi pointer down untuk drag
  const onPointerDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Cek objek yang diklik (simple circle hit test)
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      // Hit test: gunakan bounding ellipse sederhana
      const dx = mouseX - obj.x;
      const dy = mouseY - obj.y;
      if (dx * dx / (40*40) + dy * dy / (30*30) <= 1) {
        setDraggingId(obj.id);
        setDragOffset({ x: dx, y: dy });
        onSelect(obj.id);
        return;
      }
    }
    // Jika klik di luar objek
    setDraggingId(null);
  };

  // Fungsi pointer move
  const onPointerMove = (e) => {
    if (!draggingId) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    onUpdate(draggingId, { x: mouseX - dragOffset.x, y: mouseY - dragOffset.y });
  };

  // Fungsi pointer up
  const onPointerUp = () => {
    setDraggingId(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      style={{ border: "1px solid #ccc", cursor: draggingId ? "grabbing" : "grab" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onClick={() => {
        if (!draggingId) onSelect(null);
      }}
    />
  );
}
