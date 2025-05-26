import React from 'react';

const RightTrapezoid = ({ transform, color = 'lightgreen', border = 'black', onMouseDown, style }) => {
  return (
    <g
      transform={transform}
      onMouseDown={onMouseDown}
      style={style}
      cursor="grab"
    >
      <polygon
        points="0,0 120,0 90,60 0,60"
        fill={color}
        stroke={border}
        strokeWidth="2"
      />
    </g>
  );
};

export default RightTrapezoid;
