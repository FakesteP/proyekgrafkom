const Pacman = ({ transform, color, border, onMouseDown, style }) => (
  <g
    transform={transform}
    onMouseDown={onMouseDown}
    style={style}
  >
    <circle cx="50" cy="50" r="40" fill={color} stroke={border} strokeWidth="5" />
    <path
      d="M50 50 L90 30 A40 40 0 1 1 90 70 Z"
      fill="#fff"
    />
  </g>
);

export default Pacman;