import { Link, useNavigate } from "react-router-dom";
import * as config from "../config";
import axios from "axios";

function NavBar(props) {
  const navigate = useNavigate();
  const handleLogOut = () => {
    const checkAutomaticLogin = async () => {
      try {
        const response = await axios.get(config.USER_LOGOUT_URL, {
          withCredentials: true,
        });
        props.setUserInfo({});
        navigate(config.PAGE_LOGIN_RELATIVE_URL);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized access.", error);
        } else {
          console.error("An error occured", error);
        }
      }
    };
    checkAutomaticLogin();
    console.log("LOGGING OUT");
  };
  return (
    <nav
      className="navbar bg-dark border-bottom border-body navbar-dark"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <a className="navbar-brand" href={config.PAGE_LOGIN_RELATIVE_URL}>
          CareVoice
        </a>
        {props.logOutButton && (
          <a>
            {/*href={PAGE_LOGIN_RELATIVE_URL}>*/}
            <button
              className="btn btn-outline-danger"
              type="submit"
              onClick={handleLogOut}
            >
              Log out
            </button>
          </a>
        )}
        {props.children}
      </div>
    </nav>
  );
}

export default NavBar;
