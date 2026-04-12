import React from "react";
import "./AccContainer.scss";
import Accordian from "../Accordian/Accordian";
import data from "../../data";
import ExploreIcon from "@mui/icons-material/Explore";

const AccContainer = () => {
  return (
    <div className="accContainer">
      <div className="container-header">
        <ExploreIcon className="header-icon" />
        <h2>Explore options near me</h2>
      </div>
      <div className="accordian-list">
        {data.map((question, index) => (
          <Accordian question={question} key={question.id} style={{ animationDelay: `${index * 0.1}s` }} />
        ))}
      </div>
    </div>
  );
};

export default AccContainer;
