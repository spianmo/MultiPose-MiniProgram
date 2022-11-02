"use strict";
const poseDetection_constants = require("../../constants.js");
const poseDetection_posenet_constants = require("../constants.js");
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
async function toTensorBuffers3D(tensors) {
  return Promise.all(tensors.map((tensor) => tensor.buffer()));
}
function getOffsetPoint(y, x, keypoint, offsets) {
  return {
    y: offsets.get(y, x, keypoint),
    x: offsets.get(y, x, keypoint + poseDetection_posenet_constants.NUM_KEYPOINTS)
  };
}
function getImageCoords(part, outputStride, offsets) {
  const { heatmapY, heatmapX, id: keypoint } = part;
  const { y, x } = getOffsetPoint(heatmapY, heatmapX, keypoint, offsets);
  return {
    x: part.heatmapX * outputStride + x,
    y: part.heatmapY * outputStride + y
  };
}
function squaredDistance(y1, x1, y2, x2) {
  const dy = y2 - y1;
  const dx = x2 - x1;
  return dy * dy + dx * dx;
}
function withinNmsRadiusOfCorrespondingPoint(poses, squaredNmsRadius, { x, y }, keypointId) {
  return poses.some(({ keypoints }) => {
    return squaredDistance(
      y,
      x,
      keypoints[keypointId].y,
      keypoints[keypointId].x
    ) <= squaredNmsRadius;
  });
}
const partIds = poseDetection_constants.COCO_KEYPOINTS.reduce((result, jointName, i) => {
  result[jointName] = i;
  return result;
}, {});
const parentChildrenTuples = poseDetection_posenet_constants.POSE_CHAIN.map(
  ([parentJoinName, childJoinName]) => [partIds[parentJoinName], partIds[childJoinName]]
);
const parentToChildEdges = parentChildrenTuples.map(([, childJointId]) => childJointId);
const childToParentEdges = parentChildrenTuples.map(([
  parentJointId
]) => parentJointId);
function clamp(a, min, max) {
  if (a < min) {
    return min;
  }
  if (a > max) {
    return max;
  }
  return a;
}
function getStridedIndexNearPoint(point, outputStride, height, width) {
  return {
    y: clamp(Math.round(point.y / outputStride), 0, height - 1),
    x: clamp(Math.round(point.x / outputStride), 0, width - 1)
  };
}
function getDisplacement(edgeId, point, displacements) {
  const numEdges = displacements.shape[2] / 2;
  return {
    y: displacements.get(point.y, point.x, edgeId),
    x: displacements.get(point.y, point.x, numEdges + edgeId)
  };
}
function addVectors(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}
function traverseToTargetKeypoint(edgeId, sourceKeypoint, targetKeypointId, scoresBuffer, offsets, outputStride, displacements, offsetRefineStep = 2) {
  const [height, width] = scoresBuffer.shape;
  const point = { y: sourceKeypoint.y, x: sourceKeypoint.x };
  const sourceKeypointIndices = getStridedIndexNearPoint(point, outputStride, height, width);
  const displacement = getDisplacement(edgeId, sourceKeypointIndices, displacements);
  const displacedPoint = addVectors(point, displacement);
  let targetKeypoint = displacedPoint;
  for (let i = 0; i < offsetRefineStep; i++) {
    const targetKeypointIndices = getStridedIndexNearPoint(targetKeypoint, outputStride, height, width);
    const offsetPoint = getOffsetPoint(
      targetKeypointIndices.y,
      targetKeypointIndices.x,
      targetKeypointId,
      offsets
    );
    targetKeypoint = addVectors(
      {
        x: targetKeypointIndices.x * outputStride,
        y: targetKeypointIndices.y * outputStride
      },
      { x: offsetPoint.x, y: offsetPoint.y }
    );
  }
  const targetKeyPointIndices = getStridedIndexNearPoint(targetKeypoint, outputStride, height, width);
  const score = scoresBuffer.get(
    targetKeyPointIndices.y,
    targetKeyPointIndices.x,
    targetKeypointId
  );
  return {
    y: targetKeypoint.y,
    x: targetKeypoint.x,
    name: poseDetection_constants.COCO_KEYPOINTS[targetKeypointId],
    score
  };
}
function decodePose(root, scores, offsets, outputStride, displacementsFwd, displacementsBwd) {
  const numParts = scores.shape[2];
  const numEdges = parentToChildEdges.length;
  const instanceKeypoints = new Array(numParts);
  const { part: rootPart, score: rootScore } = root;
  const rootPoint = getImageCoords(rootPart, outputStride, offsets);
  instanceKeypoints[rootPart.id] = {
    score: rootScore,
    name: poseDetection_constants.COCO_KEYPOINTS[rootPart.id],
    y: rootPoint.y,
    x: rootPoint.x
  };
  for (let edge = numEdges - 1; edge >= 0; --edge) {
    const sourceKeypointId = parentToChildEdges[edge];
    const targetKeypointId = childToParentEdges[edge];
    if (instanceKeypoints[sourceKeypointId] && !instanceKeypoints[targetKeypointId]) {
      instanceKeypoints[targetKeypointId] = traverseToTargetKeypoint(
        edge,
        instanceKeypoints[sourceKeypointId],
        targetKeypointId,
        scores,
        offsets,
        outputStride,
        displacementsBwd
      );
    }
  }
  for (let edge = 0; edge < numEdges; ++edge) {
    const sourceKeypointId = childToParentEdges[edge];
    const targetKeypointId = parentToChildEdges[edge];
    if (instanceKeypoints[sourceKeypointId] && !instanceKeypoints[targetKeypointId]) {
      instanceKeypoints[targetKeypointId] = traverseToTargetKeypoint(
        edge,
        instanceKeypoints[sourceKeypointId],
        targetKeypointId,
        scores,
        offsets,
        outputStride,
        displacementsFwd
      );
    }
  }
  return instanceKeypoints;
}
function getInstanceScore(existingPoses, squaredNmsRadius, instanceKeypoints) {
  let notOverlappedKeypointScores = instanceKeypoints.reduce((result, { y, x, score }, keypointId) => {
    if (!withinNmsRadiusOfCorrespondingPoint(
      existingPoses,
      squaredNmsRadius,
      { y, x },
      keypointId
    )) {
      result += score;
    }
    return result;
  }, 0);
  return notOverlappedKeypointScores /= instanceKeypoints.length;
}
exports.decodePose = decodePose;
exports.getImageCoords = getImageCoords;
exports.getInstanceScore = getInstanceScore;
exports.toTensorBuffers3D = toTensorBuffers3D;
exports.withinNmsRadiusOfCorrespondingPoint = withinNmsRadiusOfCorrespondingPoint;
