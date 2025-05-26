import React from 'react';

const Sun = ({ transform, color = 'yellow', border = 'orange', onMouseDown, style }) => {
  const rays = Array.from({ length: 12 }).map((_, i) => {
    const angle = i * 30;
    const x2 = 100 + 50 * Math.cos(angle * Math.PI / 180);
    const y2 = 100 + 50 * Math.sin(angle * Math.PI / 180);
    return (
      <line
        key={i}
        x1="100"
        y1="100"
        x2={x2}
        y2={y2}
        stroke={border}
        strokeWidth="2"
      />
    );
  });

  return (
    <g
      transform={transform}
      onMouseDown={onMouseDown}
      style={style}
      cursor="grab"
    >
      {rays}
      <circle cx="100" cy="100" r="30" fill={color} stroke={border} strokeWidth="2" />
    </g>
  );
};

export default Sun;
