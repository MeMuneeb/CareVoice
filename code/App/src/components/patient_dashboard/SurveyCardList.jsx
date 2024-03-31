// SurveyList.tsx

import React from "react";
import SurveyCard from "./SurveyCardEntry";
import "./SurveyCardList.css";

const SurveyCardList = (props) => {
  return (
    <div className="survey-list">
      {props.surveys.map((survey, index) => (
        <SurveyCard key={index} {...survey} />
      ))}
    </div>
  );
};

export default SurveyCardList;
