import React, { useState } from 'react';
import CustomInput from '../components/UI/CustomInput';
import classes from './ContactPage.module.css';

interface contactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
const ContactPage: React.FC = () => {
  const [contactData, setContactData] = useState<contactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleCancelClick = () => {
    setContactData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setContactData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className={classes['contact-form__container']}>
      <h1>Contact Form</h1>
      <CustomInput
        name="name"
        type="text"
        placeHolder="Name"
        value={contactData.name}
        onChange={handleInputChange}
      />
      <CustomInput
        name="email"
        type="email"
        placeHolder="Email"
        value={contactData.email}
        onChange={handleInputChange}
      />
      <CustomInput
        name="subject"
        type="text"
        placeHolder="Subject"
        onChange={handleInputChange}
        value={contactData.subject}
      />
      <textarea
        name="message"
        placeholder="Please write here..."
        onChange={handleInputChange}
        value={contactData.message}
      />
      <div className={classes['buttons__wrapper']}>
        <button type="submit">Submit</button>
        <button onClick={handleCancelClick}>Cancel</button>
      </div>

      {/* <div className={classes['logo']}>
        <h1>H</h1>
      </div> */}
    </div>
  );
};

export default ContactPage;
