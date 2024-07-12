import React, { useRef, useState } from 'react';
import classes from './ImagePicker.module.css';
interface ImagePickerProps {
  label?: string;
  name: string;
  setter: (data: object) => void;
  defaultImage?: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  label,
  name,
  setter,
  defaultImage,
}) => {
  const [pickedImage, setPickedImage] = useState<
    File | null | undefined | ArrayBuffer | string
  >(defaultImage);

  const imageInput = useRef<HTMLInputElement>(null);

  const handlePickClick = () => {
    if (imageInput.current) {
      imageInput.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPickedImage(null);
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);

    setter((prevValues: object) => ({
      ...prevValues,
      image: file,
    }));
  };

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <img
              src={pickedImage as string}
              alt="The image selected by the user."
            />
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
          required
        />
        <button
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
