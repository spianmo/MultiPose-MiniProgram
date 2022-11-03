"use strict";var e=Object.defineProperty,t=(t,i,s)=>(((t,i,s)=>{i in t?e(t,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[i]=s})(t,"symbol"!=typeof i?i+"":i,s),s);const i=require("../../common/vendor.js"),s=require("../calculators/constants.js"),r=require("../calculators/convert_image_to_tensor.js"),o=require("../calculators/image_utils.js"),a=require("../calculators/is_video.js"),n=require("../calculators/keypoints_smoothing.js"),l=require("../calculators/normalized_keypoints_to_keypoints.js"),c=require("../calculators/shift_image_value.js"),m=require("../constants.js"),u=require("./calculators/calculate_alignment_points_rects.js"),h=require("./calculators/calculate_landmark_projection.js"),d=require("./calculators/create_ssd_anchors.js"),_=require("./calculators/detector_inference.js"),S=require("./calculators/landmarks_to_detection.js"),O=require("./calculators/non_max_suppression.js"),E=require("./calculators/refine_landmarks_from_heatmap.js"),T=require("./calculators/remove_detection_letterbox.js"),A=require("./calculators/remove_landmark_letterbox.js"),p=require("./calculators/tensors_to_detections.js"),I=require("./calculators/tensors_to_landmarks.js"),g=require("./calculators/transform_rect.js"),y=require("./calculators/visibility_smoothing.js"),N=require("./constants.js"),L=require("./detector_utils.js");
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
class F{constructor(e,s,r,o){t(this,"anchors"),t(this,"anchorTensor"),t(this,"maxPoses"),t(this,"timestamp"),t(this,"regionOfInterest",null),t(this,"visibilitySmoothingFilterActual"),t(this,"visibilitySmoothingFilterAuxiliary"),t(this,"landmarksSmoothingFilterActual"),t(this,"landmarksSmoothingFilterAuxiliary"),this.detectorModel=e,this.landmarkModel=s,this.enableSmoothing=r,this.modelType=o,this.anchors=d.createSsdAnchors(N.BLAZEPOSE_DETECTOR_ANCHOR_CONFIGURATION);const a=i.tensor1d(this.anchors.map((e=>e.width))),n=i.tensor1d(this.anchors.map((e=>e.height))),l=i.tensor1d(this.anchors.map((e=>e.xCenter))),c=i.tensor1d(this.anchors.map((e=>e.yCenter)));this.anchorTensor={x:l,y:c,w:a,h:n}}estimatePoses(e,t,r){const n=L.validateEstimationConfig(t);if(null==e)return this.reset(),[];this.maxPoses=n.maxPoses,this.timestamp=null!=r?r*s.MILLISECOND_TO_MICRO_SECONDS:a.isVideo(e)?e.currentTime*s.SECOND_TO_MICRO_SECONDS:null;const c=o.getImageSize(e),u=i.tidy((()=>i.cast(o.toImageTensor(e),"float32")));let h=this.regionOfInterest;if(null==h){const e=this.detectPose(u);if(0===e.length)return this.reset(),u.dispose(),[];const t=e[0];h=this.poseDetectionToRoi(t,c)}const d=this.poseLandmarksByRoi(h,u);if(u.dispose(),null==d)return this.reset(),[];const{actualLandmarks:_,auxiliaryLandmarks:S,poseScore:O}=d,{actualLandmarksFiltered:E,auxiliaryLandmarksFiltered:T}=this.poseLandmarkFiltering(_,S,c),A=this.poseLandmarksToRoi(T,c);this.regionOfInterest=A;const p=null!=E?l.normalizedKeypointsToKeypoints(E,c):null;null!=p&&p.forEach(((e,t)=>{e.name=m.BLAZEPOSE_KEYPOINTS[t]}));return[{score:O,keypoints:p}]}dispose(){this.detectorModel.dispose(),this.landmarkModel.dispose(),i.dispose([this.anchorTensor.x,this.anchorTensor.y,this.anchorTensor.w,this.anchorTensor.h])}reset(){this.regionOfInterest=null,this.visibilitySmoothingFilterActual=null,this.visibilitySmoothingFilterAuxiliary=null,this.landmarksSmoothingFilterActual=null,this.landmarksSmoothingFilterAuxiliary=null}detectPose(e){const{imageTensor:t,padding:s}=r.convertImageToTensor(e,N.BLAZEPOSE_DETECTOR_IMAGE_TO_TENSOR_CONFIG),o=c.shiftImageValue(t,[-1,1]),{boxes:a,scores:n}=_.detectorInference(o,this.detectorModel),l=p.tensorsToDetections([n,a],this.anchorTensor,N.BLAZEPOSE_TENSORS_TO_DETECTION_CONFIGURATION),m=O.nonMaxSuppression(l,this.maxPoses,N.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION.minSuppressionThreshold,N.BLAZEPOSE_DETECTOR_NON_MAX_SUPPRESSION_CONFIGURATION.minScoreThreshold),u=T.removeDetectionLetterbox(m,s);return i.dispose([t,o,n,a]),u}poseDetectionToRoi(e,t){let i,s;i=0,s=1;const r=u.calculateAlignmentPointsRects(e,t,{rotationVectorEndKeypointIndex:1,rotationVectorStartKeypointIndex:0,rotationVectorTargetAngleDegree:90});return g.transformNormalizedRect(r,t,N.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG)}poseLandmarksByRoi(e,t){const{imageTensor:s,padding:o}=r.convertImageToTensor(t,N.BLAZEPOSE_LANDMARK_IMAGE_TO_TENSOR_CONFIG,e),a=c.shiftImageValue(s,[0,1]),n=this.landmarkModel.predict(a);let l,m,u;switch(this.modelType){case"lite":l=n[3],m=n[4],u=n[1];break;case"full":l=n[4],m=n[3],u=n[1];break;case"heavy":l=n[3],m=n[1],u=n[4];break;default:throw new Error(`Model type must be one of lite, full or heavy,but got ${this.modelType}`)}const d=m.dataSync()[0];if(d<N.BLAZEPOSE_POSE_PRESENCE_SCORE)return i.dispose(n),i.dispose([s,a]),null;const _=I.tensorsToLandmarks(l,N.BLAZEPOSE_TENSORS_TO_LANDMARKS_CONFIG),S=E.refineLandmarksFromHeatmap(_,u,N.BLAZEPOSE_REFINE_LANDMARKS_FROM_HEATMAP_CONFIG),O=A.removeLandmarkLetterbox(S,o),T=h.calculateLandmarkProjection(O,e),p=T.slice(0,N.BLAZEPOSE_NUM_KEYPOINTS),g=T.slice(N.BLAZEPOSE_NUM_KEYPOINTS,N.BLAZEPOSE_NUM_AUXILIARY_KEYPOINTS);return i.dispose(n),i.dispose([s,a]),{actualLandmarks:p,auxiliaryLandmarks:g,poseScore:d}}poseLandmarksToRoi(e,t){const i=S.landmarksToDetection(e),s=u.calculateAlignmentPointsRects(i,t,{rotationVectorStartKeypointIndex:0,rotationVectorEndKeypointIndex:1,rotationVectorTargetAngleDegree:90});return g.transformNormalizedRect(s,t,N.BLAZEPOSE_DETECTOR_RECT_TRANSFORMATION_CONFIG)}poseLandmarkFiltering(e,t,i){let s,r;return null!=this.timestamp&&this.enableSmoothing?(null==this.visibilitySmoothingFilterActual&&(this.visibilitySmoothingFilterActual=new y.LowPassVisibilityFilter(N.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG)),s=this.visibilitySmoothingFilterActual.apply(e),null==this.visibilitySmoothingFilterAuxiliary&&(this.visibilitySmoothingFilterAuxiliary=new y.LowPassVisibilityFilter(N.BLAZEPOSE_VISIBILITY_SMOOTHING_CONFIG)),r=this.visibilitySmoothingFilterAuxiliary.apply(t),null==this.landmarksSmoothingFilterActual&&(this.landmarksSmoothingFilterActual=new n.KeypointsSmoothingFilter(N.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_ACTUAL)),s=this.landmarksSmoothingFilterActual.apply(s,this.timestamp,i,!0),null==this.landmarksSmoothingFilterAuxiliary&&(this.landmarksSmoothingFilterAuxiliary=new n.KeypointsSmoothingFilter(N.BLAZEPOSE_LANDMARKS_SMOOTHING_CONFIG_AUXILIARY)),r=this.landmarksSmoothingFilterAuxiliary.apply(r,this.timestamp,i,!0)):(s=e,r=t),{actualLandmarksFiltered:s,auxiliaryLandmarksFiltered:r}}}exports.load=async function(e){const t=L.validateModelConfig(e),[s,r]=await Promise.all([i.loadGraphModel(t.detectorModelUrl),i.loadGraphModel(t.landmarkModelUrl)]);return new F(s,r,t.enableSmoothing,t.modelType)};
