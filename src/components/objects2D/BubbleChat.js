import React from 'react';

const BubbleChat = ({ transform, color = 'skyblue', border = 'black', onMouseDown, style }) => {
  return (
    <g
      transform={transform}
      onMouseDown={onMouseDown}
      style={style}
      cursor="grab"
    >
      {/* Gelembung utama */}
      <rect x="0" y="0" rx="20" ry="20" width="160" height="100" fill={color} stroke={border} strokeWidth="2" />

      {/* Ekor gelembung */}
      <path d="M 40 100 L 60 120 L 70 100 Z" fill={color} stroke={border} strokeWidth="2" />
    </g>
  );
};

export default BubbleChat;
