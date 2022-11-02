"use strict";
const poseDetection_posenet_constants = require("../constants.js");
const poseDetection_posenet_calculators_build_part_with_score_queue = require("./build_part_with_score_queue.js");
const poseDetection_posenet_calculators_decode_multiple_poses_util = require("./decode_multiple_poses_util.js");
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
async function decodeMultiplePoses(heatmapScores, offsets, displacementFwd, displacementBwd, outputStride, maxPoseDetections, scoreThreshold = 0.5, nmsRadius = 20) {
  const [scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer] = await poseDetection_posenet_calculators_decode_multiple_poses_util.toTensorBuffers3D(
    [heatmapScores, offsets, displacementFwd, displacementBwd]
  );
  const poses = [];
  const queue = poseDetection_posenet_calculators_build_part_with_score_queue.buildPartWithScoreQueue(
    scoreThreshold,
    poseDetection_posenet_constants.K_LOCAL_MAXIMUM_RADIUS,
    scoresBuffer
  );
  const squaredNmsRadius = nmsRadius * nmsRadius;
  while (poses.length < maxPoseDetections && !queue.empty()) {
    const root = queue.dequeue();
    const rootImageCoords = poseDetection_posenet_calculators_decode_multiple_poses_util.getImageCoords(root.part, outputStride, offsetsBuffer);
    if (poseDetection_posenet_calculators_decode_multiple_poses_util.withinNmsRadiusOfCorrespondingPoint(
      poses,
      squaredNmsRadius,
      rootImageCoords,
      root.part.id
    )) {
      continue;
    }
    const keypoints = poseDetection_posenet_calculators_decode_multiple_poses_util.decodePose(
      root,
      scoresBuffer,
      offsetsBuffer,
      outputStride,
      displacementsFwdBuffer,
      displacementsBwdBuffer
    );
    const score = poseDetection_posenet_calculators_decode_multiple_poses_util.getInstanceScore(poses, squaredNmsRadius, keypoints);
    poses.push({ keypoints, score });
  }
  return poses;
}
exports.decodeMultiplePoses = decodeMultiplePoses;
