"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const poseDetection_calculators_tracker = require("./tracker.js");
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class KeypointTracker extends poseDetection_calculators_tracker.Tracker {
  constructor(config) {
    super(config);
    __publicField(this, "keypointThreshold");
    __publicField(this, "keypointFalloff");
    __publicField(this, "minNumKeyoints");
    this.keypointThreshold = config.keypointTrackerParams.keypointConfidenceThreshold;
    this.keypointFalloff = config.keypointTrackerParams.keypointFalloff;
    this.minNumKeyoints = config.keypointTrackerParams.minNumberOfKeypoints;
  }
  computeSimilarity(poses) {
    if (poses.length === 0 || this.tracks.length === 0) {
      return [[]];
    }
    const simMatrix = [];
    for (const pose of poses) {
      const row = [];
      for (const track of this.tracks) {
        row.push(this.oks(pose, track));
      }
      simMatrix.push(row);
    }
    return simMatrix;
  }
  oks(pose, track) {
    const boxArea = this.area(track.keypoints) + 1e-6;
    let oksTotal = 0;
    let numValidKeypoints = 0;
    for (let i = 0; i < pose.keypoints.length; ++i) {
      const poseKpt = pose.keypoints[i];
      const trackKpt = track.keypoints[i];
      if (poseKpt.score < this.keypointThreshold || trackKpt.score < this.keypointThreshold) {
        continue;
      }
      numValidKeypoints += 1;
      const dSquared = Math.pow(poseKpt.x - trackKpt.x, 2) + Math.pow(poseKpt.y - trackKpt.y, 2);
      const x = 2 * this.keypointFalloff[i];
      oksTotal += Math.exp(-1 * dSquared / (2 * boxArea * x ** 2));
    }
    if (numValidKeypoints < this.minNumKeyoints) {
      return 0;
    }
    return oksTotal / numValidKeypoints;
  }
  area(keypoints) {
    const validKeypoint = keypoints.filter((kpt) => kpt.score > this.keypointThreshold);
    const minX = Math.min(1, ...validKeypoint.map((kpt) => kpt.x));
    const maxX = Math.max(0, ...validKeypoint.map((kpt) => kpt.x));
    const minY = Math.min(1, ...validKeypoint.map((kpt) => kpt.y));
    const maxY = Math.max(0, ...validKeypoint.map((kpt) => kpt.y));
    return (maxX - minX) * (maxY - minY);
  }
}
exports.KeypointTracker = KeypointTracker;
