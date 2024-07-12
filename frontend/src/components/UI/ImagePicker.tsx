import React, { useRef, useState } from 'react';
import classes from './ImagePicker.module.css';
interface ImagePickerProps {
  label: string;
  name: string;
  setUpdatedUserData: (updateUserData: object) => void;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  label,
  name,
  setUpdatedUserData,
}) => {
  const [pickedImage, setPickedImage] = useState<
    File | null | undefined | ArrayBuffer | string
  >(undefined);

  const imageInput = useRef<HTMLInputElement>(null);
  // console.log(pickedImage);

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
    //console.log(file.name);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);

    setUpdatedUserData((prevValues: object) => ({
      ...prevValues,
      image: file,
    }));
  };

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {/* {pickedImage ? (
            <img
              src={pickedImage as string}
              alt="The image selected by the user."
            />
          ) : (
            <i className="fas fa-camera"></i>
          )} */}

          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <img
              src={pickedImage as string}
              alt="The image selected by the user."
            />
          )}
        </div>
        <input
          // defaultValue={}
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
