import React from "react";
import "./Input.css";

import InputField from "../components/main-dash/InputField";

export default function Input() {

    return (
      <main id="input" className="page-input">
        <h1>Node Selection</h1>
        <section id="input-fields">

          <InputField 
          title="Node ID Submission"
          prompt="Input node ID"
          inner_colour_1="red"
          inner_colour_2="blue"
          outer_colour="blue"
          className="card"
          />
        </section>
      </main>
    );
  }