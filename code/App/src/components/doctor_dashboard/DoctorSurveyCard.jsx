import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash } from "react-bootstrap-icons";
import * as config from "../../config";

const DoctorSurveyCard = (props) => {
  const navigate = useNavigate();

  const handleClickCustomize = () => {
    navigate(config.PAGE_SURVEY_CREATION_RELATIVE_URL);
  };

  const handleClickDelete = () => {
    // Implement delete functionality
    console.log("Delete button clicked");
  };

  return (
    <div className="survey-list">
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">My Survey</h5>
          {props.created && (
            <h6 className="card-subtitle mb-2 text-body-secondary">
              Date modified: {props.date}
            </h6>
          )}
          <div
            className="d-flex justify-content-between"
            style={{ marginTop: "10px" }}
          >
            <a
              href="#"
              className="btn btn-primary"
              onClick={handleClickCustomize}
            >
              {props.created ? "Customize" : "Create"}
            </a>
            {/* <a href="#" className="btn btn-danger" onClick={handleClickDelete}>
            <Trash width="20" height="20" color="currentColor" />
          </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSurveyCard;
