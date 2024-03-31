import React, { useEffect, useState } from "react";
import SurveyResponseCardList from "./SurveyResponseCardList";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../NavBar";
import DoctorSurveyCard from "./DoctorSurveyCard";
import * as common from "../../common";
import * as config from "../../config";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorDashboard = (props) => {
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    common.checkAutomaticLogin(navigate, props.setUserInfo, "doctor");
  }, []);

  useEffect(() => {
    const getSurvey = async () => {
      try {
        const response = await axios.get(config.SURVEY_URL, {
          withCredentials: true,
        });
        console.log("SURVEY", response);
        if (response.data.survey.length !== 0) {
          setDate(response.data.survey[0].updatedAt.slice(0, 10));
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized access.", error);
        } else {
          console.error("An error occured", error);
        }
      }
    };
    getSurvey();
  }, [props.userInfo]);

  const [surveys, setSurveys] = useState([]);
  const getResponses = async (setSurveys) => {
    try {
      const response = await axios.get(config.RESPONSES_URL, {
        withCredentials: true,
      });
      console.log(response);
      const allSurveys = response.data.data.surveyResponses
        .reduce((accumulator, currentResponse) => {
          const transformedSurveys = currentResponse.responses.map(
            (response) => ({
              patientName: response.patientId
                ? response.patientId.name
                : config.ANONYMOUS,
              date: response.updatedAt.slice(0, 10),
              responseId: response._id,
            })
          );
          return accumulator.concat(transformedSurveys);
        }, [])
        .reverse();
      setSurveys(allSurveys);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access.", error);
      } else {
        console.error("An error occured", error);
      }
    }
  };

  useEffect(() => {
    getResponses(setSurveys);
  }, []);

  return (
    <>
      <NavBar logOutButton={true} setUserInfo={props.setUserInfo} />
      <div style={{ padding: "30px" }}>
        <div className="welcome-message">
          <h2>Welcome back, {props.userInfo.name}!</h2>
        </div>
        <h3>Customize Your Survey</h3>
        <DoctorSurveyCard date={date} created={date && true} />
        <br />
        <h3>View Patient Responses</h3>
        <SurveyResponseCardList surveys={surveys} />
      </div>
    </>
  );
};

export default DoctorDashboard;
