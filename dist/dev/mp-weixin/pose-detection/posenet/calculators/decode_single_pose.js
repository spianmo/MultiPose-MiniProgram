"use strict";
const poseDetection_constants = require("../../constants.js");
const poseDetection_posenet_calculators_decode_single_pose_util = require("./decode_single_pose_util.js");
/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
async function decodeSinglePose(heatmapScores, offsets, outputStride) {
  let totalScore = 0;
  const heatmapValues = poseDetection_posenet_calculators_decode_single_pose_util.argmax2d(heatmapScores);
  const allTensorBuffers = await Promise.all(
    [heatmapScores.buffer(), offsets.buffer(), heatmapValues.buffer()]
  );
  const scoresBuffer = allTensorBuffers[0];
  const offsetsBuffer = allTensorBuffers[1];
  const heatmapValuesBuffer = allTensorBuffers[2];
  const offsetPoints = poseDetection_posenet_calculators_decode_single_pose_util.getOffsetPoints(heatmapValuesBuffer, outputStride, offsetsBuffer);
  const offsetPointsBuffer = await offsetPoints.buffer();
  const keypointConfidence = Array.from(poseDetection_posenet_calculators_decode_single_pose_util.getPointsConfidence(scoresBuffer, heatmapValuesBuffer));
  const keypoints = keypointConfidence.map((score, keypointId) => {
    totalScore += score;
    return {
      y: offsetPointsBuffer.get(keypointId, 0),
      x: offsetPointsBuffer.get(keypointId, 1),
      score,
      name: poseDetection_constants.COCO_KEYPOINTS[keypointId]
    };
  });
  heatmapValues.dispose();
  offsetPoints.dispose();
  return { keypoints, score: totalScore / keypoints.length };
}
exports.decodeSinglePose = decodeSinglePose;
