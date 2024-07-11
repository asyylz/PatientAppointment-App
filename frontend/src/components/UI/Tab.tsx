import React from 'react';
import classes from './TabContainer.module.css';
interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, active, onClick }) => {
  return (
    <button
      className={`${classes.tab} ${active ? `${classes.active}` : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Tab;
