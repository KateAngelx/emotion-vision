import * as faceapi from 'face-api.js';

/**
 * Phase 10: Loads face-api models from a verified open-access CDN mirror.
 */
export async function loadModels() {
  // Production-ready jsDelivr CDN link containing the required manifest definitions
  const MODEL_URL = 'https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js/weights/';
  
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
    console.log("AI Models loaded successfully from public CDN link.");
    return true;
  } catch (error) {
    console.error("Failed to load face-api models via public CDN link:", error);
    throw error;
  }
}

/**
 * Phase 11 & 12: Scans a single video frame and calculates expression matrices.
 */
export async function detectFaceAndEmotions(videoElement) {
  if (!videoElement) return null;

  try {
    const detection = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (!detection) return null;

    const expressions = detection.expressions;
    let topEmotion = "neutral";
    let maxConfidence = 0;

    Object.entries(expressions).forEach(([emotion, confidence]) => {
      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        topEmotion = emotion;
      }
    });

    return {
      bbox: detection.detection.box,
      emotion: topEmotion,
      confidence: maxConfidence
    };
  } catch (error) {
    console.error("Error during real-time frame scanning:", error);
    return null;
  }
}