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
import * as poseDetection from '@tensorflow-models/pose-detection';

export class Painter {
  ctx!: CanvasRenderingContext2D;
  canvas2D!: HTMLCanvasElement;
  model!: poseDetection.SupportedModels;

  setCtx(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  setCanvas2D(canvas2D: HTMLCanvasElement) {
    this.canvas2D = canvas2D
  }
  /**
   * Draw the keypoints and skeleton on the video.
   * @param poses A list of poses to render.
   */
  drawResults(poses: Array<poseDetection.Pose>) {
    for (const pose of poses) {
      this.drawResult(pose);
    }
  }

  /**
   * Draw the keypoints and skeleton on the video.
   * @param pose A pose with keypoints to render.
   */
  drawResult(pose: poseDetection.Pose) {
    if (pose.keypoints != null) {
      this.drawKeypoints(pose.keypoints);
      this.drawSkeleton(pose.keypoints);
    }
  }

  /**
   * Draw the keypoints on the video.
   * @param keypoints A list of keypoints.
   */
  drawKeypoints(keypoints: Array<poseDetection.Keypoint>) {

    const keypointInd =
      poseDetection.util.getKeypointIndexBySide(this.model);
    this.ctx.fillStyle = 'White';
    this.ctx.strokeStyle = 'White';
    this.ctx.lineWidth = 2;

    for (const i of keypointInd.middle) {
      this.drawKeypoint(keypoints[i]);
    }

    this.ctx.fillStyle = '#0ad4ea';
    for (const i of keypointInd.left) {
      this.drawKeypoint(keypoints[i]);
    }

    this.ctx.fillStyle = '#ffbd29';
    for (const i of keypointInd.right) {
      this.drawKeypoint(keypoints[i]);
    }
  }

  drawKeypoint(keypoint: poseDetection.Keypoint) {
    // If score is null, just show the keypoint.
    const score = keypoint.score != null ? keypoint.score : 1;
    const scoreThreshold = 0.3;

    if (score >= scoreThreshold) {
      // @ts-ignored
      const circle = this.canvas2D.createPath2D();
      circle.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
      this.ctx.fill(circle);
      this.ctx.stroke(circle);
    }
  }

  /**
   * Draw the skeleton of a body on the video.
   * @param keypoints A list of keypoints.
   */
  drawSkeleton(keypoints: Array<poseDetection.Keypoint>) {
    this.ctx.fillStyle = 'White';
    this.ctx.strokeStyle = 'White';
    this.ctx.lineWidth = 2;

    poseDetection.util.getAdjacentPairs(this.model).forEach(([
      i, j
    ]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      // If score is null, just show the keypoint.
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

  setModel(model: poseDetection.SupportedModels) {
    this.model = model
  }
}
