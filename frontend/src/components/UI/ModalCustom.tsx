import { createPortal } from 'react-dom';
import classes from './ModalCustom.module.css';

interface ModalCustomProps {
  children: React.ReactNode;
  height?: string;
  width: string;
  minHeight?: string;
}

const ModalCustom: React.FC<ModalCustomProps> = ({
  children,
  height,
  minHeight,
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
        style={{ height: `${height}`, width: `${width}`, minHeight:`${minHeight}` }}
      >
        {children}
      </div>
    </div>,
    modalElement
  );
};

export default ModalCustom;
