import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import "./SurveyCreation.css";
import { Trash } from "react-bootstrap-icons";
import NavBar from "../NavBar";
import * as common from "../../common";
import * as config from "../../config";

import { useNavigate } from "react-router-dom";

const TYPE_TEXT = config.QN_TYPE_TEXT;
const TYPE_MCQ = config.QN_TYPE_MCQ;

const Survey = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    common.checkAutomaticLogin(navigate, props.setUserInfo, "doctor");
  }, []);

  const [surveyTitle, setSurveyTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: [""], type: TYPE_TEXT },
  ]);

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await axios.get(config.SURVEY_URL, {
          withCredentials: true,
        });
        const qns = response.data.survey[0].questions.map((question) =>
          question.type == TYPE_TEXT
            ? {
                type: question.type,
                question: question.content,
                options: [""],
              }
            : {
                type: question.type,
                question: question.content[0],
                options: question.content.slice(1),
              }
        );
        setQuestions(qns);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized access.", error);
        } else {
          console.error("An error occured", error);
        }
      }
    };
    getQuestions();
  }, [props.userInfo]);

  const handleQuestionChange = (index, value, field, optionIndex) => {
    const newQuestions = [...questions];

    if (field === "question" || field === "type") {
      newQuestions[index][field] = value;
    } else if (field === "options") {
      newQuestions[index][field][optionIndex] = value;
    }

    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: [""], type: TYPE_TEXT },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push("");
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const changeAnswerType = (questionIndex, answerType) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].type = answerType;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = config.SURVEY_URL;
    const id = props.userInfo._id;
    const qns = questions.map((question) => ({
      type: question.type,
      content:
        question.type == TYPE_TEXT
          ? question.question
          : [question.question, ...question.options],
    }));
    try {
      const response = await axios.post(url, {
        doctorId: id,
        questions: qns,
      });
      navigate(config.PAGE_DOCTOR_RELATIVE_URL);
      // Handle success - e.g., redirect or show success message
    } catch (error) {
      console.error("Error saving survey", error);
      // Handle errors - e.g., show error message
    }
  };

  return (
    <>
      <NavBar logOutButton={true} setUserInfo={props.setUserInfo} />
      <div className="Survey">
        <h1>Create Survey</h1>
        <form onSubmit={handleSubmit}>
          <br />
          <div id="questionContainer">
            {questions.map((q, questionIndex) => (
              <div key={questionIndex}>
                <div className="input-group mb-3">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                    htmlFor={`question-${questionIndex}`}
                  >
                    <b>Q{questionIndex + 1}</b>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                    id={`question-${questionIndex}`}
                    name={`question-${questionIndex}`}
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(
                        questionIndex,
                        e.target.value,
                        "question"
                      )
                    }
                    required
                  />
                  {questions.length > 1 && (
                    <button
                      className="btn btn-danger"
                      type="button"
                      id="button-addon2"
                      onClick={() => removeQuestion(questionIndex)}
                    >
                      <Trash width="20" height="20" color="currentColor" />
                    </button>
                  )}
                </div>

                <select
                  class="form-select"
                  aria-label="Default select example"
                  value={questions[questionIndex].type}
                  onChange={(event) => {
                    changeAnswerType(questionIndex, event.target.value);
                  }}
                >
                  <option value={TYPE_MCQ}>Answer type: Multiple choice</option>
                  <option selected value={TYPE_TEXT}>
                    Answer type: Text
                  </option>
                </select>
                {questions[questionIndex].type == TYPE_MCQ && (
                  <div className="option-element">
                    <br />
                    {/* <label htmlFor={`options-${questionIndex}`}>Options:</label> */}
                    {q.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="option-container">
                        <div className="input-group">
                          <div className="input-group-text">
                            <input
                              className="form-check-input mt-0"
                              type="radio"
                              value=""
                              aria-label="Radio button for following text input"
                              disabled
                            />
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            aria-label="Text input with radio button"
                            id={`option-${questionIndex}-${optionIndex}`}
                            name={`option-${questionIndex}-${optionIndex}`}
                            value={option}
                            onChange={(e) =>
                              handleQuestionChange(
                                questionIndex,
                                e.target.value,
                                "options",
                                optionIndex
                              )
                            }
                            required
                          />{" "}
                          {q.options.length > 1 && (
                            <button
                              className="btn btn-danger"
                              type="button"
                              id="button-addon2"
                              onClick={() =>
                                removeOption(questionIndex, optionIndex)
                              }
                            >
                              <Trash
                                width="20"
                                height="20"
                                color="currentColor"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => addOption(questionIndex)}
                    >
                      Add Option
                    </button>
                  </div>
                )}
                <br />
                <br />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={addQuestion}
          >
            Add Question
          </button>
          <br />
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => navigate(config.PAGE_DOCTOR_RELATIVE_URL)}
            >
              Discard Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Survey;
