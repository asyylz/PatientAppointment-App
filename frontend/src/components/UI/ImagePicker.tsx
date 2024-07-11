import React, { useRef, useState } from 'react';
import classes from './ImagePicker.module.css';
interface ImagePickerProps {
  label: string;
  name: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ label, name }) => {
  const [pickedImage, setPickedImage] = useState();
  const imageInput = useRef<HTMLInputElement>(null);
  const handlePickClick = () => {
    if (imageInput.current) {
      imageInput.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
        />
        <button
          //className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          Pick a image
        </button>
      </div>
    </div>
  );
};

export default ImagePicker;
