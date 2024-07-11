import React from 'react';
import classes from './CustomInput.module.css';

interface CustomInputProps {
  title: string;
  type: string;
  placeHolder: string;
  defaultValue: string | null;
}
const CustomInput: React.FC<CustomInputProps> = ({
  title,
  type,
  placeHolder,
  defaultValue,
}) => {
  return (
    <div className={classes.inputWrapper}>
      <input
        type={type}
        name={title}
        placeholder={placeHolder}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default CustomInput;
