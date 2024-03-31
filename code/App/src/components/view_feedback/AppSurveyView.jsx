import React, { useEffect, useState } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import NavBar from "../NavBar";
import * as common from "../../common";
import * as config from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function SurveyViewFeedback(props) {
  const navigate = useNavigate();
  useEffect(() => {
    common.checkAutomaticLogin(navigate, props.setUserInfo, "doctor");
  }, []);
  const { responseId } = useParams();
  // const [surveyContent, setSurveyContent] = useState({});
  const [survey, setSurvey] = useState(new Model({}));
  const [answers, setAnswers] = useState({});
  // const [surveyId, setSurveyId] = useState("");

  const getResponses = async () => {
    try {
      const response = await axios.get(config.RESPONSES_URL, {
        withCredentials: true,
      });
      var surveyId = "";
      for (const responseList of response.data.data.surveyResponses) {
        for (const response of responseList.responses) {
          if (response._id === responseId) {
            // set the survey questions
            const qns = responseList.survey.questions.map(
              (question, questionIndex) => ({
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
              })
            );
            const ans = response.answers.map((answer, index) =>
              answer.type == config.QN_TYPE_TEXT
                ? answer.content
                : qns[index].choices[answer.content]
            );
            setAnswers(ans);
            // update the survey
            setSurvey(
              new Model({
                elements: qns,
              })
            );
            surveyId = responseList.survey._id;
            break;
          }
        }
        if (surveyId) break;
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access.", error);
      } else {
        console.error("An error occured", error);
      }
    }
  };

  useEffect(() => {
    getResponses();
  }, [responseId]);

  survey.data = answers;
  survey.mode = "display";

  return (
    <>
      <NavBar logOutButton={true} {...props} />
      <Survey model={survey} />
      <button
        type="button"
        className="btn btn-primary"
        style={{
          display: "block",
          margin: "auto",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
        onClick={() => navigate(config.PAGE_DOCTOR_RELATIVE_URL)}
      >
        Back to Dashboard
      </button>
    </>
  );
}

export default SurveyViewFeedback;
