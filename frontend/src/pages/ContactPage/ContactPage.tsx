import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput/CustomInput';
import classes from './ContactPage.module.css';
import useHttp from '../../hooks/useHttp/useHttp';


const ContactPage: React.FC = () => {
  const { submitContactForm } = useHttp();

  const [contactData, setContactData] = useState<ContactFormData>({
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
  const handleSubmit = async () => {
    const response = await submitContactForm(contactData);
    console.log('asiye');
    if (response.status === 'success') {
      console.log('asiye');
      setContactData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }
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
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        <button onClick={handleCancelClick}>Cancel</button>
      </div>
    </div>
  );
};

export default ContactPage;
