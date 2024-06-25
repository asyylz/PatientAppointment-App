import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import classes from './ModalCustom.module.css';

interface ModalCustomProps {
  children: React.ReactNode;
}

const ModalCustom: React.FC<ModalCustomProps> = ({ children }) => {
  const navigate = useNavigate();

  const modalElement = document.getElementById('modal');
  if (!modalElement) {
    throw new Error('No modal element found with id "modal"');
  }
  return createPortal(
    <div className={classes.container}>
      <div className={classes.wrapper}>
        {children}
        {/* <button onClick={() => navigate('/')} className={classes.closeButton}>
          Close
        </button> */}
      </div>
    </div>,
    modalElement
  );
};

export default ModalCustom;
