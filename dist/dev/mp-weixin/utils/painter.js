"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
require("../common/vendor.js");
const poseDetection_types = require("../pose-detection/types.js");
const poseDetection_util = require("../pose-detection/util.js");
require("../pose-detection/posenet/calculators/decode_multiple_poses_util.js");
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
class Painter {
  constructor() {
    __publicField(this, "ctx");
    __publicField(this, "canvas2D");
  }
  setCtx(ctx) {
    this.ctx = ctx;
  }
  setCanvas2D(canvas2D) {
    this.canvas2D = canvas2D;
  }
  drawResults(poses) {
    for (const pose of poses) {
      this.drawResult(pose);
    }
  }
  drawResult(pose) {
    if (pose.keypoints != null) {
      this.drawKeypoints(pose.keypoints);
      this.drawSkeleton(pose.keypoints);
    }
  }
  drawKeypoints(keypoints) {
    const keypointInd = poseDetection_util.getKeypointIndexBySide(poseDetection_types.SupportedModels.MoveNet);
    this.ctx.fillStyle = "White";
    this.ctx.strokeStyle = "White";
    this.ctx.lineWidth = 2;
    for (const i of keypointInd.middle) {
      this.drawKeypoint(keypoints[i]);
    }
    this.ctx.fillStyle = "Green";
    for (const i of keypointInd.left) {
      this.drawKeypoint(keypoints[i]);
    }
    this.ctx.fillStyle = "Orange";
    for (const i of keypointInd.right) {
      this.drawKeypoint(keypoints[i]);
    }
  }
  drawKeypoint(keypoint) {
    const score = keypoint.score != null ? keypoint.score : 1;
    const scoreThreshold = 0.3;
    if (score >= scoreThreshold) {
      const circle = this.canvas2D.createPath2D();
      circle.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
      this.ctx.fill(circle);
      this.ctx.stroke(circle);
    }
  }
  drawSkeleton(keypoints) {
    this.ctx.fillStyle = "White";
    this.ctx.strokeStyle = "White";
    this.ctx.lineWidth = 2;
    poseDetection_util.getAdjacentPairs(poseDetection_types.SupportedModels.MoveNet).forEach(([
      i,
      j
    ]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];
      const score1 = kp1.score != null ? kp1.score : 1;
      const score2 = kp2.score != null ? kp2.score : 1;
      const scoreThreshold = 0.3;
      if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
        this.ctx.beginPath();
        this.ctx.moveTo(kp1.x, kp1.y);
        this.ctx.lineTo(kp2.x, kp2.y);
        this.ctx.stroke();
      }
    });
  }
}
exports.Painter = Painter;
