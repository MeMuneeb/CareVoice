import React from "react";
import SurveyResponseCard from "./SurveyResponseCard";
import "./SurveyCardList.css";

const SurveyResponseCardList = (props) => {
  return (
    <div className="survey-list">
      {props.surveys.map((survey, index) => (
        <SurveyResponseCard key={index} {...survey} />
      ))}
    </div>
  );
};

export default SurveyResponseCardList;
