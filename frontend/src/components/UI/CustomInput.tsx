import React from 'react';
import classes from './CustomInput.module.css';

interface CustomInputProps {
  name?: string;
  type?: string;
  placeHolder?: string;
  defaultValue?: string;
  value?: string; // Add value prop
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  readOnly?: boolean;
}
const CustomInput: React.FC<CustomInputProps> = ({
  name,
  type,
  placeHolder,
  defaultValue,
  value,
  onChange,
  required,
  readOnly,
}) => {
  return (
    <div
      className={classes.inputWrapper}
      style={readOnly ? { opacity: 0.7 } : {}}
    >
      <input
        type={type}
        name={name}
        placeholder={placeHolder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        style={readOnly ? { backgroundColor: 'lightgray' } : {}}
      />
    </div>
  );
};

export default CustomInput;
