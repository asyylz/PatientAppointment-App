import { Link, To, useNavigate } from 'react-router-dom';
import classes from './GlobalLink.module.css';

interface GlobalButtonProps {
  text: string;
  to: To | number;
  onclick?: (e: React.MouseEvent) => void;
}

const GlobalLink: React.FC<GlobalButtonProps> = ({ text, to, onclick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof to === 'number') {
      navigate(to);
    }
  };
  return (
    <div className={`${classes.wrapper} ${classes.globalLink}`}>
      {typeof to === 'number' ? (
        <button onClick={handleClick}>{text}</button>
      ) : (
        <Link onClick={onclick} to={to}>
          {text}
        </Link>
      )}
    </div>
  );
};

export default GlobalLink;
