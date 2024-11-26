// src/components/BodyDetection.jsx
import React, { useEffect, useRef, useState } from "react";
import * as movenet from "@tensorflow-models/movenet";
import "@tensorflow/tfjs"; // TensorFlow.js

const BodyDetection = () => {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [pose, setPose] = useState(null);

  useEffect(() => {
    const runPoseNet = async () => {
      const net = await movenet.load();
      setLoading(false);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const detectPose = async () => {
        if (video) {
          // Detect pose
          const pose = await net.estimateSinglePose(video, {
            flipHorizontal: false,
          });

          // Set pose state to update UI
          setPose(pose);

          // Clear canvas before drawing
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the keypoints on the canvas
          drawKeypoints(pose.keypoints, ctx);
          requestAnimationFrame(detectPose); // Repeat detection
        }
      };

      video.addEventListener("loadeddata", () => {
        detectPose(); // Start pose detection once the video is loaded
      });
    };

    runPoseNet();
  }, []);

  // Drawing keypoints on canvas
  const drawKeypoints = (keypoints, ctx) => {
    keypoints.forEach((point) => {
      if (point.score > 0.5) {
        const { x, y } = point.position;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });
  };

  // Access webcam
  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Webcam access error:", err));
  };

  useEffect(() => {
    startWebcam();
  }, []);

  return (
    <div className="flex flex-col items-center mt-6">
      <h2 className="text-xl text-white">MoveNet Pose Detection</h2>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width="640"
          height="480"
          className="border border-gray-300 rounded-md mt-4"
        ></video>

        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          className="absolute top-0 left-0"
        ></canvas>
      </div>

      {loading && <p className="text-white">Loading model...</p>}

      {pose && (
        <div className="text-white mt-4">
          <h3>Detected Pose:</h3>
          <pre>{JSON.stringify(pose, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default BodyDetection;
