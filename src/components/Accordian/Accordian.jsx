import React, { useState } from "react";
import "./Accordin.scss";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Accordian = ({ question }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`accordian ${open ? 'open' : ''}`}>
      <div className="accordianContainer" onClick={() => setOpen(!open)}>
        <div className="accordianTitle">
          <h3>{question.title}</h3>
          <div className="icon-wrapper">
            {open ? <RemoveIcon className="toggle-icon minus" /> : <AddIcon className="toggle-icon plus" />}
          </div>
        </div>
        <div className={`accordianContent ${open ? 'expanded' : ''}`}>
          <p>{question.infos}</p>
        </div>
      </div>
    </div>
  );
};

export default Accordian;
