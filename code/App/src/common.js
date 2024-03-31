import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import * as config from "./config";

const checkAutomaticLogin = async (navigate, setUserInfo, roleAllowed) => {
  try {
    const response = await axios.get(config.USER_URL, {
      withCredentials: true,
    });
    setUserInfo(response.data.user);
    if (response.data.user.role != roleAllowed) {
      // if the user's role doesn't match the role allowed on this page,
      // redirect the user to their dashboard
      if (response.data.user.role == "patient") {
        navigate(config.PAGE_PATIENT_RELATIVE_URL);
      } else if (response.data.user.role == "doctor") {
        navigate(config.PAGE_DOCTOR_RELATIVE_URL);
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access.", error);
    } else {
      console.error("An error occured", error);
    }
    if (roleAllowed) navigate(config.PAGE_LOGIN_RELATIVE_URL);
  }
};

export { checkAutomaticLogin };
