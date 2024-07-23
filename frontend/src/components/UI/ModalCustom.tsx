import { createPortal } from 'react-dom';
import classes from './ModalCustom.module.css';

interface ModalCustomProps {
  children: React.ReactNode;
  height?: string;
  width: string;
}

const ModalCustom: React.FC<ModalCustomProps> = ({
  children,
  height,
  width,
}) => {
  const modalElement = document.getElementById('modal');

  if (!modalElement) {
    throw new Error('No modal element found with id "modal"');
  }
  return createPortal(
    <div className={classes.overlay}>
      <div
        className={classes.wrapper}
        style={{ height: `${height}`, width: `${width}` }}
      >
        {children}
      </div>
    </div>,
    modalElement
  );
};

export default ModalCustom;
