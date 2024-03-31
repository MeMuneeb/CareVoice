import React from "react";
import { Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import * as config from "../../config";

const SurveyCard = ({ doctorName, date, filled, _id }) => {
  const navigate = useNavigate();

  const handleClickStart = () => {
    // Implement Start functionality
    console.log("Start button clicked");
    navigate(config.PAGE_SURVEY_FILL_RELATIVE_URL + "/" + _id);
  };

  const handleClickDelete = () => {
    // Implement delete functionality
    console.log("Delete button clicked");
  };

  return filled ? (
    <div className="card" style={{ width: "18rem" }}>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{doctorName}</h5>
        <h6 className="card-subtitle mb-2 text-body-secondary">{date}</h6>
        <div className="mt-auto">
          <h5 className="card-title" style={{ color: "green" }}>
            COMPLETED
          </h5>
        </div>
      </div>
    </div>
  ) : (
    <div className="card" style={{ width: "18rem" }}>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{doctorName}</h5>
        <h6 className="card-subtitle mb-2 text-body-secondary">{date}</h6>
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px" }}
        >
          <a href="#" className="btn btn-primary" onClick={handleClickStart}>
            Start
          </a>
          {/* <a href="#" className="btn btn-danger" onClick={handleClickDelete}>
            <Trash width="20" height="20" color="currentColor" />
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default SurveyCard;
