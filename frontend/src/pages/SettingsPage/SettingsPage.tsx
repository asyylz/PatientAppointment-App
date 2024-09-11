import TabContainer from '../../components/TabContainer/TabContainer';
import classes from './SettingsPage .module.css';

const SettingsPage: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.navigation}>
        <h2>Profile Settings</h2>
        <TabContainer />
      </div>
    </div>
  );
};

export default SettingsPage;
