import React from "react";
import { Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import * as config from "../../config";

const SurveyResponseCard = (props) => {
  const navigate = useNavigate();
  const handleClickView = () => {
    navigate(config.PAGE_VIEW_FEEDBACK_RELATIVE_URL + "/" + props.responseId);
    // Implement Start functionality
    console.log("Start button clicked");
  };

  const handleClickDelete = () => {
    // Implement delete functionality
    console.log("Delete button clicked");
  };

  return (
    <div className="card" style={{ width: "18rem" }}>
      <div className="card-body d-flex flex-column">
        <h5
          className="card-title"
          style={
            props.patientName === config.ANONYMOUS ? { color: "silver" } : {}
          }
        >
          {props.patientName}
        </h5>
        <h6 className="card-subtitle mb-2 text-body-secondary">{props.date}</h6>
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px" }}
        >
          <a href="#" className="btn btn-primary" onClick={handleClickView}>
            View
          </a>
          {/* <a href="#" className="btn btn-danger" onClick={handleClickDelete}>
            <Trash width="20" height="20" color="currentColor" />
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default SurveyResponseCard;
