export default function TopSeacrhBar() {
  return (
    <>
      <div className="top-bar">
        <div className="search">
          <input type="text" name="search" placeholder="search here" />
          <label htmlFor="search">
            <div className="search-icon">
              <i className="fas fa-search"></i>
            </div>
          </label>
        </div>
        <i className="fas fa-bell"></i>
        <div className="user">
          <img src="./public/doctor.png" alt="" />
        </div>
      </div>
    </>
  );
}
