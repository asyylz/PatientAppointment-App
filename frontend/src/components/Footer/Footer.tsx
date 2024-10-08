import React, { useState } from 'react';
import classes from './Footer.module.css';
import { toastSuccessNotify } from '../../helper/ToastNotify';

const Footer: React.FC = () => {
  const [email, setEmail] = useState<string>();

  const handleClick = () => {
    toastSuccessNotify('You have subscribed.');
  };

  return (
    <section className={classes.footer}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleClick();
        }}
        className={classes['footer__subscribe']}
      >
        <input
          className={classes['footer__input']}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email address..."
          required
        />
        <button type="submit" className={classes['footer__button']}>
          SUBSCRIBE
        </button>
      </form>
      <div className={classes['footer__links']}>
        <div className={classes['footer__box']}>
          <h1 className={classes['footer__title']}>Discover</h1>
          <p className={classes['footer__text']}>
            Read week of the blog post...{' '}
            <a href="" className={classes['footer__link']}>
              here
            </a>
          </p>
        </div>
        <div className={classes['footer__box']}>
          <h1 className={classes['footer__title']}>About</h1>
          <ul className={classes['footer__list']}>
            <li className={classes['footer__item']}>Staff</li>
            <li className={classes['footer__item']}>Team</li>
            <li className={classes['footer__item']}>Careers</li>
            <li className={classes['footer__item']}>Blog</li>
          </ul>
        </div>
        <div className={classes['footer__box']}>
          <h1 className={classes['footer__title']}>Resources</h1>
          <ul className={classes['footer__list']}>
            <li className={classes['footer__item']}>Security</li>
            <li className={classes['footer__item']}>Global</li>
            <li className={classes['footer__item']}>Privacy</li>
          </ul>
        </div>
        <div className={classes['footer__box']}>
          <h1 className={classes['footer__title']}>Social</h1>
          <ul className={classes['footer__list']}>
            <li className={classes['footer__item']}>Facebook</li>
            <li className={classes['footer__item']}>Instagram</li>
            <li className={classes['footer__item']}>Twitter</li>
            <li className={classes['footer__item']}>GooglePlus</li>
          </ul>
        </div>
      </div>
      <div className={classes['footer__partners']}>
        <div className={classes['footer__partnersList']}>
          <div className={classes['footer__logo']}>
            <img
              src="https://patient-appointment-system.s3.eu-west-2.amazonaws.com/PAS-LOGO.png"
              alt=""
            />
          </div>
          <p className={classes['footer__partnersTitle']}>Our Partners:</p>
          <ul className={classes['footer__partnersItems']}>
            <li className={classes['footer__partner']}>Company 1</li>
            <li className={classes['footer__partner']}>Company 2</li>
            <li className={classes['footer__partner']}>Company 3</li>
            <li className={classes['footer__partner']}>Company 4</li>
          </ul>
        </div>
        <a href="" className={classes['footer__link']}>
          See all
        </a>
      </div>
    </section>
  );
};

export default Footer;
