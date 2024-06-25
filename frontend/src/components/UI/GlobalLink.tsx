import { Link, To, useNavigate } from 'react-router-dom';
import classes from './GlobalLink.module.css';

interface GlobalButtonProps {
  text: string;
  to: To | number;
}

const GlobalLink: React.FC<GlobalButtonProps> = ({ text, to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof to === 'number') {
      navigate(to);
    }
  };
  return (
    <div className={classes.wrapper}>
      {typeof to === 'number' ? (
        <button onClick={handleClick}>{text}</button>
      ) : (
        <Link to={to}>{text}</Link>
      )}
    </div>
  );
};

export default GlobalLink;
