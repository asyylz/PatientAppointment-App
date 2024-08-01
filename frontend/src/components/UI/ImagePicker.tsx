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
    <div className={classes['container__imagepicker']}>
      <label htmlFor={name}>{label}</label>
      <div
        className={`${classes['container__imagepicker']} ${classes['wrapper__imagepicker--fields']}`}
      >
        <div className={classes['imagepicker__preview']}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <img
              className={classes['imagepicker__preview--pickedImage']}
              src={pickedImage as string}
              alt="The image selected by the user."
            />
          )}
        </div>
        <input
          className={classes['wrapper__imagepicker--fields-field']}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
          required
        />
        <button
          className={classes['container__imagepicker--button']}
          type="button"
          onClick={handlePickClick}
        >
          Pick image
        </button>
      </div>
    </div>
  );
};

export default ImagePicker;
