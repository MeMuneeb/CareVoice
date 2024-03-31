import React, { useEffect, useState } from "react";
import SurveyCardList from "./SurveyCardList";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../NavBar";
import * as common from "../../common";
import * as config from "../../config";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientDashboard = (props) => {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    common.checkAutomaticLogin(navigate, props.setUserInfo, "patient");
  }, []);

  const getVisits = async (setSurveys) => {
    try {
      const response = await axios.get(config.VISIT_URL, {
        withCredentials: true,
      });
      setSurveys(
        response.data.visits
          .map((visit) => ({
            doctorName: visit.doctorName,
            date: visit.visitDate.slice(0, 10),
            filled: visit.surveyId !== undefined && visit.surveyId !== null,
            _id: visit._id,
          }))
          .reverse()
      );
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access.", error);
      } else {
        console.error("An error occured", error);
      }
    }
  };

  useEffect(() => {
    getVisits(setSurveys);
  }, []);

  return (
    <>
      <NavBar logOutButton={true} setUserInfo={props.setUserInfo} />
      <div style={{ padding: "30px" }}>
        <div className="welcome-message">
          <h2>Welcome back, {props.userInfo.name}!</h2>
        </div>
        <SurveyCardList surveys={surveys} />
      </div>
    </>
  );
};

export default PatientDashboard;
