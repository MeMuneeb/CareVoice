import "./Register.css";
import axios from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavBar from "../NavBar";
import * as config from "../../config";
import * as common from "../../common";

//validate password
// const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const USER_REGEX = /^[a-zA-Z-' ]{4,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = (props) => {
  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();

  // role: doctor or patient
  const [role, setRole] = useState("patient");

  //user input
  const [fullName, setFullName] = useState("");
  //whether name validates or not
  const [validName, setValidName] = useState(false);
  //whether we have focus on this input field or not
  const [fullNameFocus, setFullNameFocus] = useState(false);

  //user input
  const [email, setEmail] = useState("");
  //whether name validates or not
  const [validEmail, setValidEmail] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  //set focus when component loads
  useEffect(() => {
    userRef.current.focus();
  }, []);

  //validate username, check validation
  useEffect(() => {
    const result = USER_REGEX.test(fullName);
    const result2 = !config.PROHIBITED_NAMES.includes(fullName);
    setValidName(result && result2);
  }, [fullName]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    common.checkAutomaticLogin(navigate, props.setUserInfo, "");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    //very rare case
    const v1 = USER_REGEX.test(fullName);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = EMAIL_REGEX.test(email);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }

    e.preventDefault();

    const checkForError = (status) => {
      if (status === 500) {
        setErrMsg("Email Taken");
        return true;
      } else if (status > 399) {
        setErrMsg("Registration Failed");
        return true;
      }
      return false;
    };
    const url = config.SIGNUP_URL;
    const body = {
      name: fullName,
      email: email,
      password: pwd,
      passwordConfirm: matchPwd,
      role: role,
    };
    try {
      const response = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (!checkForError(response.status)) {
        if (response.status === 201 || response.status === 200) {
          props.setUserInfo(response.data.user);
          setErrMsg("");
          if (response.data.user.role == "patient") {
            navigate(config.PAGE_PATIENT_RELATIVE_URL);
          } else if (response.data.user.role == "doctor") {
            navigate(config.PAGE_DOCTOR_RELATIVE_URL);
          }
        }
        // Reset the form after submission (you may want to clear sensitive information)
        setSuccess(true);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (checkForError(err.response?.status)) {
        console.log("ERR MSG: ", errMsg);
      } else {
        setErrMsg("Registration Failed");
      }
    }
    setFullName("");
    setEmail("");
    setPwd("");
    setMatchPwd("");
  };

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
          {/* check to see if success */}
          {success ? (
            <section>
              <h1>Success!</h1>
              <p>
                <a href={config.PAGE_LOGIN_RELATIVE_URL}>Sign In</a>
              </p>
            </section>
          ) : (
            <section>
              <h1>Register</h1>
              <br />
              {errMsg && (
                <div className="alert alert-danger" role="alert">
                  {errMsg}
                </div>
              )}

              <select
                className="form-select"
                aria-label="Default select example"
                // value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                <option selected value="patient">
                  Register as Patient
                </option>
                <option value="doctor">Register as Doctor</option>
              </select>
              <hr className="mt-3 mb-3" />
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className={
                      "form-control" +
                      (validName || !fullName ? "" : " is-invalid")
                    }
                    placeholder="Full name"
                    aria-label="Full name"
                    id="floatingInput"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setFullName(e.target.value)}
                    value={fullName}
                    required
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setFullNameFocus(true)}
                    onBlur={() => setFullNameFocus(false)}
                  />
                  <label htmlFor="floatingInput">Full name</label>

                  <div className="invalid-feedback">
                    {config.PROHIBITED_NAMES.includes(fullName) ? (
                      <>That name is prohibited.</>
                    ) : (
                      <>
                        4 to 24 characters.
                        <br />
                        Letters, hyphens, apostrophes allowed.
                      </>
                    )}
                  </div>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className={
                      "form-control" +
                      (validEmail || !email ? "" : " is-invalid")
                    }
                    placeholder="Email"
                    aria-label="Email"
                    id="floatingInput"
                    // ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    aria-invalid={validEmail ? "false" : "true"}
                    aria-describedby="uidnote"
                  />
                  <label htmlFor="floatingInput">Email</label>

                  <div className="invalid-feedback">Enter a valid email.</div>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className={
                      "form-control" + (validPwd || !pwd ? "" : " is-invalid")
                    }
                    placeholder="Password"
                    aria-label="Password"
                    id="floatingInput"
                    autoComplete="off"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                  />
                  <label htmlFor="floatingInput">Password</label>

                  <div className="invalid-feedback">
                    8 to 24 characters.
                    <br />
                    Must include uppercase and lowercase letters, a number and a
                    special character.
                    <br />
                    Allowed special characters:{" "}
                    <span aria-label="exclamation mark">!</span>{" "}
                    <span aria-label="at symbol">@</span>{" "}
                    <span aria-label="hashtag">#</span>{" "}
                    <span aria-label="dollar sign">$</span>{" "}
                    <span aria-label="percent">%</span>
                  </div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className={
                      "form-control" +
                      (validMatch || !matchPwd ? "" : " is-invalid")
                    }
                    placeholder="Password"
                    aria-label="Password"
                    id="floatingInput"
                    autoComplete="off"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                  />
                  <label htmlFor="floatingInput">Confirm password</label>

                  <div className="invalid-feedback">
                    Must match the first password input field.
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary login_button"
                  disabled={
                    !validName || !validPwd || !validMatch ? true : false
                  }
                >
                  Sign Up
                </button>
              </form>
              <br />
              <p>
                Already registered?
                <br />
                <span classNameName="line">
                  {/*put router link here*/}
                  {/* this is eventually going to be a react router link with sign in form */}
                  <a href={config.PAGE_LOGIN_RELATIVE_URL}>Sign In</a>
                </span>
              </p>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
