import React from 'react';
import classes from './CustomInput.module.css';

interface CustomInputProps {
  name: string;
  type: string;
  placeHolder: string;
  defaultValue?: string;
  value?: string; // Add value prop
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const CustomInput: React.FC<CustomInputProps> = ({
  name,
  type,
  placeHolder,
  defaultValue,
  value,
  onChange,
}) => {
  return (
    <div className={classes.inputWrapper}>
      <input
        type={type}
        name={name}
        placeholder={placeHolder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomInput;
