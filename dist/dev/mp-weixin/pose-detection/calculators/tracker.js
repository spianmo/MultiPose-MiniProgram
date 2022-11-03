"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const poseDetection_calculators_tracker_utils = require("./tracker_utils.js");
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
class Tracker {
  constructor(config) {
    __publicField(this, "tracks");
    __publicField(this, "maxTracks");
    __publicField(this, "maxAge");
    __publicField(this, "minSimilarity");
    __publicField(this, "nextID");
    poseDetection_calculators_tracker_utils.validateTrackerConfig(config);
    this.tracks = [];
    this.maxTracks = config.maxTracks;
    this.maxAge = config.maxAge * 1e3;
    this.minSimilarity = config.minSimilarity;
    this.nextID = 1;
  }
  apply(poses, timestamp) {
    this.filterOldTracks(timestamp);
    const simMatrix = this.computeSimilarity(poses);
    this.assignTracks(poses, simMatrix, timestamp);
    this.updateTracks(timestamp);
    return poses;
  }
  getTracks() {
    return this.tracks.slice();
  }
  getTrackIDs() {
    return new Set(this.tracks.map((track) => track.id));
  }
  filterOldTracks(timestamp) {
    this.tracks = this.tracks.filter((track) => {
      return timestamp - track.lastTimestamp <= this.maxAge;
    });
  }
  assignTracks(poses, simMatrix, timestamp) {
    const unmatchedTrackIndices = Array.from(Array(simMatrix[0].length).keys());
    const detectionIndices = Array.from(Array(poses.length).keys());
    const unmatchedDetectionIndices = [];
    for (const detectionIndex of detectionIndices) {
      if (unmatchedTrackIndices.length === 0) {
        unmatchedDetectionIndices.push(detectionIndex);
        continue;
      }
      let maxTrackIndex = -1;
      let maxSimilarity = -1;
      for (const trackIndex of unmatchedTrackIndices) {
        const similarity = simMatrix[detectionIndex][trackIndex];
        if (similarity >= this.minSimilarity && similarity > maxSimilarity) {
          maxTrackIndex = trackIndex;
          maxSimilarity = similarity;
        }
      }
      if (maxTrackIndex >= 0) {
        let linkedTrack = this.tracks[maxTrackIndex];
        linkedTrack = Object.assign(
          linkedTrack,
          this.createTrack(poses[detectionIndex], timestamp, linkedTrack.id)
        );
        poses[detectionIndex].id = linkedTrack.id;
        const index = unmatchedTrackIndices.indexOf(maxTrackIndex);
        unmatchedTrackIndices.splice(index, 1);
      } else {
        unmatchedDetectionIndices.push(detectionIndex);
      }
    }
    for (const detectionIndex of unmatchedDetectionIndices) {
      const newTrack = this.createTrack(poses[detectionIndex], timestamp);
      this.tracks.push(newTrack);
      poses[detectionIndex].id = newTrack.id;
    }
  }
  updateTracks(timestamp) {
    this.tracks.sort((ta, tb) => tb.lastTimestamp - ta.lastTimestamp);
    this.tracks = this.tracks.slice(0, this.maxTracks);
  }
  createTrack(pose, timestamp, trackID) {
    const track = {
      id: trackID || this.nextTrackID(),
      lastTimestamp: timestamp,
      keypoints: [...pose.keypoints].map((keypoint) => ({ ...keypoint }))
    };
    if (pose.box !== void 0) {
      track.box = { ...pose.box };
    }
    return track;
  }
  nextTrackID() {
    const nextID = this.nextID;
    this.nextID += 1;
    return nextID;
  }
  remove(...ids) {
    this.tracks = this.tracks.filter((track) => !ids.includes(track.id));
  }
  reset() {
    this.tracks = [];
  }
}
exports.Tracker = Tracker;
