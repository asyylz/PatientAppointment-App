import React, { useState } from 'react';
import Tab from './../UI/Tab';
import classes from './TabContainer.module.css';
import ProfileForm from './../UI/ProfileForm';
import PasswordUpdateForm from './../UI/PasswordUpdateForm';

const tabList = [
  { title: 'Profile Settings', component: ProfileForm },
  { title: 'Password Settings', component: PasswordUpdateForm },
];

const TabContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Profile Settings');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const ActiveComponent = tabList.find(
    (tab) => tab.title === activeTab
  )?.component;

  return (
    <div className={classes.tabContainer}>
      <div className={classes.tabList}>
        {tabList.map((tab, index) => (
          <Tab
            key={index}
            label={tab.title}
            active={tab.title === activeTab}
            onClick={() => handleTabClick(tab.title)}
          />
        ))}
      </div>
      <div className={classes.tabContent}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default TabContainer;
