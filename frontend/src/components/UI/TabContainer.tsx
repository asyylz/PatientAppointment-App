import React, { useState } from 'react';
import Tab from './../UI/Tab';
import classes from './TabContainer.module.css';
import ProfileForm from './../UI/ProfileForm';

const tabList = [
  { title: 'Personal Info', component: ProfileForm },
  { title: 'Adress Info', component: AddressForm },
  //{ title: 'Password Update', component: PasswordUpdate },
];

const TabContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Personal Info');

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
