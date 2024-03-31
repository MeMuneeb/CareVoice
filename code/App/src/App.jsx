import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./components/login_register/Login";
import Register from "./components/login_register/Register";

import Survey from "./components/survey_creation/SurveyCreation";

import PatientDashboard from "./components/patient_dashboard/PatientDashboard";
import DoctorDashboard from "./components/doctor_dashboard/DoctorDashboard";

import * as config from "./config";
import FillSurvey from "./components/fill_survey/AppSurveySubmit";
import SurveyViewFeedback from "./components/view_feedback/AppSurveyView";

const App = () => {
  const [userInfo, setUserInfo] = useState({});
  const allSharedProps = {
    setUserInfo: setUserInfo,
    userInfo: userInfo,
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage {...allSharedProps} />} />
        <Route
          path={config.PAGE_LOGIN_RELATIVE_URL}
          element={<LoginPage {...allSharedProps} />}
        />
        <Route
          path={config.PAGE_SIGNUP_RELATIVE_URL}
          element={<Register {...allSharedProps} />}
        />
        <Route
          path={config.PAGE_PATIENT_RELATIVE_URL}
          element={<PatientDashboard {...allSharedProps} />}
        />
        <Route
          path={config.PAGE_DOCTOR_RELATIVE_URL}
          element={<DoctorDashboard {...allSharedProps} />}
        />
        <Route
          path={config.PAGE_SURVEY_CREATION_RELATIVE_URL}
          element={<Survey {...allSharedProps} />}
        />
        <Route
          path={config.PAGE_SURVEY_FILL_RELATIVE_URL}
          element={<FillSurvey {...allSharedProps} />}
        />
        <Route
          path={config.PAGE_SURVEY_FILL_RELATIVE_URL + "/:id"}
          element={<FillSurvey {...allSharedProps} />}
        />
        <Route
          path={config.PAGE_VIEW_FEEDBACK_RELATIVE_URL + "/:responseId"}
          element={<SurveyViewFeedback {...allSharedProps} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

// Export the component for use in other parts of your application
export default App;
