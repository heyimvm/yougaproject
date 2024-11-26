import React from "react";
import BodyDetection from "./components/BodyDetection"; // Fixed the typo in the path
import * as tf from "@tensorflow/tfjs";

const TensorflowCheck = () => {
  console.log("TensorFlow.js version:", tf.version.tfjs);

  return (
    <div>
      <BodyDetection />
    </div>
  );
};

export default TensorflowCheck;
