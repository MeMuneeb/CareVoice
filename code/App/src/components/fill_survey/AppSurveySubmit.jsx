import { useCallback, useEffect, useState } from "react";
import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import React from "react";
import NavBar from "../NavBar";
import { useParams } from "react-router-dom";
import * as common from "../../common";
import * as config from "../../config";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// default survey as a placeholder until we receive the actual one from the server
const defaultSurveyJson = {
  elements: [
    {
      name: "FirstName",
      title: "Enter your first name:",
      type: "text",
    },
    {
      name: "LastName",
      title: "Enter your last name:",
      type: "text",
    },
  ],
};

function FillSurvey(props) {
  const { id } = useParams();
  const [surveyContent, setSurveyContent] = useState({});
  const [survey, setSurvey] = useState(new Model(defaultSurveyJson));
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    common.checkAutomaticLogin(navigate, props.setUserInfo, "patient");
  }, []);

  useEffect(() => {
    const getSurvey = async () => {
      const url = config.GET_SURVEY_TO_FILL_URL + "/" + id;

      try {
        const response = await axios.get(url, { withCredentials: true });
        console.log(response);
        const qns = [
          ...response.data.survey.questions.map((question, questionIndex) => ({
            ...(question.type === config.QN_TYPE_TEXT
              ? {
                  title: question.content,
                  type: "text",
                  maxLength: config.QN_MAX_CHAR,
                }
              : {
                  title: question.content[0],
                  type: "radiogroup",
                  choices: question.content.slice(1),
                }),
            name: "" + questionIndex,
          })),
          {
            name: "anon",
            type: "checkbox",
            title: "I would like to submit the response anonymously",
            choices: ["Yes"],
          },
        ];
        setSurveyContent(response.data.survey);
        setSurvey(
          new Model({
            elements: qns,
          })
        );
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized access.", error);
        } else {
          console.error("An error occurred", error);
        }
      }
    };

    getSurvey();
  }, [id]);

  const surveyComplete = useCallback(
    (sender) => {
      const submitFeedback = async (url, json) => {
        setIsComplete(true);
        const anonymous = json.anon && json.anon.length > 0;
        const patientId = anonymous ? undefined : props.userInfo._id;
        const body = {
          doctorId: surveyContent.doctorId,
          patientId: patientId,
          associatedSurveyId: surveyContent._id,
          answers: surveyContent.questions.map((question, index) => ({
            type: question.type,
            content:
              question.type === config.QN_TYPE_TEXT
                ? json[index]
                : question.content.indexOf(json[index]) - 1,
          })),
        };
        try {
          const response = await axios.post(url, body, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });
        } catch (err) {
          console.log("error");
          console.log(err);
        }
      };
      submitFeedback(config.RESPONSES_URL, sender.data);
    },
    [surveyContent]
  );

  // //add complete event to sruvey model
  survey.onComplete.add(surveyComplete);

  return (
    <>
      <NavBar logOutButton={true} {...props} />
      <Survey model={survey} />
      {isComplete && (
        <button
          type="button"
          className="btn btn-primary"
          style={{ display: "block", margin: "auto", marginTop: "2rem" }}
          onClick={() => navigate(config.PAGE_PATIENT_RELATIVE_URL)}
        >
          Back to Dashboard
        </button>
      )}
    </>
  );
}

export default FillSurvey;
