import classes from './LoginAndRegister.module.css';

const LoginAndRegisterPage = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2>Login</h2>
        <form action="">
          <div className={classes.inputBox}>
            <input type="text" placeholder="Enter your email" required />
          </div>
          <div className={classes.inputBox}>
            <input type="password" placeholder="Enter your password" required />
          </div>
          {/* <div className={classes.policy}>
            <input type="checkbox" />
            <h3>I accept all terms & condition</h3>
          </div> */}
          <div className={`${classes.inputBox} ${classes.button}`}>
            <input type="submit" value="Login" />
          </div>
          {/* <div className={classes.text}>
            <h3>
              Already have an account? <a href="">Login now</a>
            </h3>
          </div> */}
        </form>
      </div>
      <div className={classes.wrapper}>
        <h2>Registration</h2>
        <form action="">
          <div className={classes.inputBox}>
            <input type="text" placeholder="Enter your name" required />
          </div>
          <div className={classes.inputBox}>
            <input type="text" placeholder="Enter your email" required />
          </div>
          <div className={classes.inputBox}>
            <input type="password" placeholder="Create password" required />
          </div>
          <div className={classes.inputBox}>
            <input type="password" placeholder="Confirm password" required />
          </div>
          <div className={classes.policy}>
            <input type="checkbox" />
            <h3>I accept all terms & condition</h3>
          </div>
          <div className={`${classes.inputBox} ${classes.button}`}>
            <input type="submit" value="Register Now" />
          </div>
          {/* <div className={classes.text}>
            <h3>
              Already have an account? <a href="">Login now</a>
            </h3>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default LoginAndRegisterPage;
