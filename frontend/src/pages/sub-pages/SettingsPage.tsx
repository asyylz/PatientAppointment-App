import TabContainer from '../../components/UI/TabContainer';
import classes from './SettingsPage .module.css';

const SettingsPage: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.navigation}>
        <div className="App">
          <h1>React Tabs Example</h1>
          <TabContainer />
        </div>
      </div>
      <div>asii</div>
      <div>aytein</div>
    </div>
  );
};

export default SettingsPage;
