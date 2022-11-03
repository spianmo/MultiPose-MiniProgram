"use strict";
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
class BoundingBoxTracker extends poseDetection_calculators_tracker.Tracker {
  constructor(config) {
    super(config);
  }
  computeSimilarity(poses) {
    if (poses.length === 0 || this.tracks.length === 0) {
      return [[]];
    }
    const simMatrix = poses.map((pose) => {
      return this.tracks.map((track) => {
        return this.iou(pose, track);
      });
    });
    return simMatrix;
  }
  iou(pose, track) {
    const xMin = Math.max(pose.box.xMin, track.box.xMin);
    const yMin = Math.max(pose.box.yMin, track.box.yMin);
    const xMax = Math.min(pose.box.xMax, track.box.xMax);
    const yMax = Math.min(pose.box.yMax, track.box.yMax);
    if (xMin >= xMax || yMin >= yMax) {
      return 0;
    }
    const intersection = (xMax - xMin) * (yMax - yMin);
    const areaPose = pose.box.width * pose.box.height;
    const areaTrack = track.box.width * track.box.height;
    return intersection / (areaPose + areaTrack - intersection);
  }
}
exports.BoundingBoxTracker = BoundingBoxTracker;
