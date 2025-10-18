import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
function Main(){
    return(
        <>
        <div className="container pb-5">
                   
  <div className="navbar navbar-expand-lg bg2 fixed-top">
    <div className="navbar-brand ms-4"><h1 className="color"><span className="text-white">Movie</span> Mansion</h1></div>
    <button className="navbar-toggler w-25" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <img src="https://img.icons8.com/?size=100&id=PpSBa7iaIak3&format=png&color=FD7E14"  width="30%" alt="" />
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto me-5 mb-2 mb-lg-0">
        <li className="nav-item">
          <Link to="/" className="nav-link">Up Comming Movies</Link>
        </li> <li className="nav-item">
          <Link to="tickets" className="nav-link">Tickets</Link>
        </li> <li className="nav-item">
          <Link className="nav-link" to={'contact'}>For Contact</Link>
        </li>
     
      </ul>
     
    </div>
  </div>

        </div>
        <Outlet/>
        </>
    )
}
export default Main;