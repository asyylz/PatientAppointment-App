import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import classes from './ModalCustom.module.css';

interface ModalCustomProps {
  children: React.ReactNode;
}

const ModalCustom: React.FC<ModalCustomProps> = ({ children }) => {
  const navigate = useNavigate();

  return createPortal(
    <div className={classes.container}>
      <div className={classes.wrapper}>
        {children}
        <button onClick={() => navigate('/')} className={classes.closeButton}>
          Close
        </button>
      </div>
    </div>,
    document.getElementById('modal')
  );
};

export default ModalCustom;
