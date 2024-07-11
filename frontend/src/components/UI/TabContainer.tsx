import React, { useState } from 'react';
import Tab from './../UI/Tab';
import classes from './TabContainer.module.css'
const TabContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Tab 1');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={classes.tabContainer}>
      <div className="tab-list">
        <Tab
          label="Tab 1"
          active={activeTab === 'Tab 1'}
          onClick={() => handleTabClick('Tab 1')}
        />
        <Tab
          label="Tab 2"
          active={activeTab === 'Tab 2'}
          onClick={() => handleTabClick('Tab 2')}
        />
        <Tab
          label="Tab 3"
          active={activeTab === 'Tab 3'}
          onClick={() => handleTabClick('Tab 3')}
        />
      </div>
      <div className={classes.tabContent}>
        {activeTab === 'Tab 1' && <div>Content for Tab 1</div>}
        {activeTab === 'Tab 2' && <div>Content for Tab 2</div>}
        {activeTab === 'Tab 3' && <div>Content for Tab 3</div>}
      </div>
    </div>
  );
};

export default TabContainer;
