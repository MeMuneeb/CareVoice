import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import * as config from "../../config";
import * as common from "../../common";
import axios from "axios";

const LoginPage = (props) => {
  const navigate = useNavigate();
  // State variables to store the username and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    common.checkAutomaticLogin(navigate, props.setUserInfo, "");
  }, []);

  // Function to handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const url = config.LOGIN_URL;
    const body = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.status == 200) {
        props.setUserInfo(response.data.user);
        setErrorMessage("");
        if (response.data.user.role == "patient") {
          navigate(config.PAGE_PATIENT_RELATIVE_URL);
        } else if (response.data.user.role == "doctor") {
          navigate(config.PAGE_DOCTOR_RELATIVE_URL);
        }
      }
    } catch (err) {
      console.log("error");
      console.log(err);
      setErrorMessage("Invalid email or password.");
    }

    // Reset the form after submission
    setEmail("");
    setPassword("");
  };

  // JSX structure for the login form
  return (
    <>
      <NavBar>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn btn-outline-primary"
            type="submit"
            onClick={() => navigate(config.PAGE_LOGIN_RELATIVE_URL)}
          >
            Log in
          </button>
          <button
            className="btn btn-outline-primary"
            type="submit"
            onClick={() => navigate(config.PAGE_SIGNUP_RELATIVE_URL)}
          >
            Register
          </button>
        </div>
      </NavBar>
      <div className="login_container">
        <div className="login_rect">
          <h2>Login</h2>
          <br />
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleLogin} className="login_form">
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control login_field"
                placeholder="Username"
                aria-label="Username"
                id="floatingInput"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <label htmlFor="floatingInput">Email</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control login_field"
                placeholder="Password"
                aria-label="Password"
                id="floatingInput"
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <label htmlFor="floatingInput">Password</label>
            </div>
            <button type="submit" className="btn btn-primary login_button">
              Login
            </button>
          </form>
          <p>
            Don't have an account?
            <br />
            <span className="line">
              <a href={config.PAGE_SIGNUP_RELATIVE_URL}>Register</a>
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
