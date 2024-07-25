import classes from './HomePage.module.css';
export default function HomePage() {
  return (
    <div className={`${classes.container} ${classes.body}`}>
      <div className={`${classes.wrapper} ${classes.navbar}`}>
        <a>LOGO</a>
        <a>DOCTORS</a>
        <a>DEPARTMENTS</a>
        <a>GALERIA</a>
        <a>CONTACT</a>
        <a className={classes.login} href="/auth">
          LOG IN
        </a>
      </div>
      <div className={`${classes.container} ${classes.main}`}>
        <div className={`${classes.images}`}>
          <img
            className={classes.one}
            src="https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGVhbHRofGVufDB8fDB8fHwy"
          />
          <img
            className={classes.two}
            src="https://images.unsplash.com/photo-1488228469209-c141f8bcd723?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGhlYWx0aHxlbnwwfHwwfHx8Mg%3D%3D"
            alt="Another beautiful landscape"
          />
          <img
            className={classes.three}
            src="https://images.unsplash.com/photo-1444312645910-ffa973656eba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aGVhbHRofGVufDB8fDB8fHwy"
            alt="Yet another beautiful landscape"
          />
          <img
            className={classes.four}
            src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />

          <img
            className={classes.five}
            src="https://images.unsplash.com/photo-1604881991720-f91add269bed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjc1fHxoZWFsdGh8ZW58MHx8MHx8fDI%3D"
            alt=""
          />
        </div>
        <div className={classes.text}>
          <h2>HOSPITAL AT HOME</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
            distinctio vitae doloremque fugit, temporibus quod? Quisquam libero
            vero, error rem debitis modi suscipit et perspiciatis, repellendus
            deleniti ipsa, a accusantium.
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim accusamus modi voluptatibus ex sequi nostrum ad praesentium dolores quaerat ratione, excepturi laboriosam exercitationem. Rerum illum doloribus autem tempore, cumque quasi.
          </p>
        </div>
      </div>

      <div></div>
      <div className={`${classes.wrapper} ${classes.footer}`}>FOOTER</div>
    </div>
  );
}
