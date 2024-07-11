import TabContainer from '../../components/UI/TabContainer';
import classes from './SettingsPage .module.css';

const SettingsPage: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.navigation}>
        <h1>Profile Settings</h1>
        <TabContainer />
      </div>
      <div>asii</div>
      <div>aytein</div>
    </div>
  );
};

export default SettingsPage;
