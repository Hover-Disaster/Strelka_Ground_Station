import React from "react";

// Hooks
import { useStorage } from "../../hooks/useStorage";
import { CenteredTitle } from "../../utils/chart-options";

// Importing Echarts library
import ReactEcharts from "echarts-for-react";

export default function InputField({
    title,
    prompt,
    inner_colour_1,
    inner_colour_2,
    outer_colour,
    className,
  }) {

    return (
        <div className={className + " gnss"}>
        ADD INPUT FIELD HERE
        </div>
      );
  }