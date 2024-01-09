import React from 'react';

const LEDIndicator = ({ isActive, activeColor, inactiveColor, text }) => {
  const indicatorStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: isActive ? activeColor : inactiveColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
  };

  return (
    <div style={indicatorStyle}>
      {text}
    </div>
  );
};

export default LEDIndicator;
