import { Link } from 'react-router-dom';
import classes from './GlobalLink.module.css';

interface GlobalButtonProps {
  text: string;
}

const GlobalLink: React.FC<GlobalButtonProps> = ({ text }) => {
  return (
    <div className={classes.wrapper}>
      <Link to="">{text}</Link>
    </div>
  );
};

export default GlobalLink;
