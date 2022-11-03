"use strict";var e=Object.defineProperty,t=(t,i,o)=>(((t,i,o)=>{i in t?e(t,i,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[i]=o})(t,"symbol"!=typeof i?i+"":i,o),o);const i=require("../../common/vendor.js"),o=require("../calculators/constants.js"),s=require("../calculators/image_utils.js"),n=require("../calculators/is_video.js"),r=require("../calculators/keypoints_one_euro_filter.js"),l=require("../calculators/low_pass_filter.js"),h=require("../constants.js"),a=require("../types.js"),p=require("../util.js"),c=require("./constants.js"),_=require("./detector_utils.js");
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
class R{constructor(e,i){t(this,"modelInputResolution",{height:0,width:0}),t(this,"keypointIndexByName",p.getKeypointIndexByName(a.SupportedModels.MoveNet)),t(this,"enableSmoothing"),t(this,"keypointsFilter",new r.KeypointsOneEuroFilter(c.KEYPOINT_FILTER_CONFIG)),t(this,"cropRegion"),t(this,"cropRegionFilterYMin",new l.LowPassFilter(c.CROP_FILTER_ALPHA)),t(this,"cropRegionFilterXMin",new l.LowPassFilter(c.CROP_FILTER_ALPHA)),t(this,"cropRegionFilterYMax",new l.LowPassFilter(c.CROP_FILTER_ALPHA)),t(this,"cropRegionFilterXMax",new l.LowPassFilter(c.CROP_FILTER_ALPHA)),this.moveNetModel=e,i.modelType===c.SINGLEPOSE_LIGHTNING?(this.modelInputResolution.width=c.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION,this.modelInputResolution.height=c.MOVENET_SINGLEPOSE_LIGHTNING_RESOLUTION):i.modelType===c.SINGLEPOSE_THUNDER&&(this.modelInputResolution.width=c.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION,this.modelInputResolution.height=c.MOVENET_SINGLEPOSE_THUNDER_RESOLUTION),this.enableSmoothing=i.enableSmoothing}detectKeypoints(e,t=!0){if(!this.moveNetModel)return null;let o,s;if(o=this.moveNetModel.execute(e),!o||4!==o.shape.length||1!==o.shape[0]||1!==o.shape[1]||17!==o.shape[2]||3!==o.shape[3])return o.dispose(),null;s=(i.getBackend(),o.dataSync()),o.dispose();const n=[];for(let i=0;i<17;++i)n[i]={y:s[3*i],x:s[3*i+1],score:s[3*i+2]};return n}estimatePoses(e,t=c.MOVENET_SINGLE_POSE_ESTIMATION_CONFIG,r){if(t=_.validateEstimationConfig(t),null==e)return this.reset(),[];null==r?n.isVideo(e)&&(r=e.currentTime*o.SECOND_TO_MICRO_SECONDS):r*=o.MILLISECOND_TO_MICRO_SECONDS;const l=s.toImageTensor(e),a=s.getImageSize(l),p=i.expandDims(l,0);e instanceof i.Tensor||l.dispose(),this.cropRegion||(this.cropRegion=this.initCropRegion(a.width,a.height));const R=i.tidy((()=>{const e=i.tensor2d([[this.cropRegion.yMin,this.cropRegion.xMin,this.cropRegion.yMax,this.cropRegion.xMax]]),t=i.zeros([1],"int32"),o=[this.modelInputResolution.height,this.modelInputResolution.width];return i.cast(i.image.cropAndResize(p,e,t,o,"bilinear",0),"int32")}));p.dispose();let d=this.detectKeypoints(R);if(R.dispose(),null==d)return this.reset(),[];for(let i=0;i<d.length;++i)d[i].y=this.cropRegion.yMin+d[i].y*this.cropRegion.height,d[i].x=this.cropRegion.xMin+d[i].x*this.cropRegion.width;null!=r&&this.enableSmoothing&&(d=this.keypointsFilter.apply(d,r));const g=this.determineCropRegion(d,a.height,a.width);this.cropRegion=this.filterCropRegion(g);let N=0,u=0;for(let i=0;i<d.length;++i)d[i].name=h.COCO_KEYPOINTS[i],d[i].y*=a.height,d[i].x*=a.width,d[i].score>c.MIN_CROP_KEYPOINT_SCORE&&(++N,u+=d[i].score);N>0?u/=N:this.resetFilters();return[{score:u,keypoints:d}]}filterCropRegion(e){if(e){const t=this.cropRegionFilterYMin.apply(e.yMin),i=this.cropRegionFilterXMin.apply(e.xMin),o=this.cropRegionFilterYMax.apply(e.yMax),s=this.cropRegionFilterXMax.apply(e.xMax);return{yMin:t,xMin:i,yMax:o,xMax:s,height:o-t,width:s-i}}return this.cropRegionFilterYMin.reset(),this.cropRegionFilterXMin.reset(),this.cropRegionFilterYMax.reset(),this.cropRegionFilterXMax.reset(),null}dispose(){this.moveNetModel.dispose()}reset(){this.cropRegion=null,this.resetFilters()}resetFilters(){this.keypointsFilter.reset(),this.cropRegionFilterYMin.reset(),this.cropRegionFilterXMin.reset(),this.cropRegionFilterYMax.reset(),this.cropRegionFilterXMax.reset()}torsoVisible(e){return(e[this.keypointIndexByName.left_hip].score>c.MIN_CROP_KEYPOINT_SCORE||e[this.keypointIndexByName.right_hip].score>c.MIN_CROP_KEYPOINT_SCORE)&&(e[this.keypointIndexByName.left_shoulder].score>c.MIN_CROP_KEYPOINT_SCORE||e[this.keypointIndexByName.right_shoulder].score>c.MIN_CROP_KEYPOINT_SCORE)}determineTorsoAndBodyRange(e,t,i,o){const s=["left_shoulder","right_shoulder","left_hip","right_hip"];let n=0,r=0;for(let a=0;a<s.length;a++){const e=Math.abs(i-t[s[a]][0]),l=Math.abs(o-t[s[a]][1]);e>n&&(n=e),l>r&&(r=l)}let l=0,h=0;for(const a of Object.keys(t)){if(e[this.keypointIndexByName[a]].score<c.MIN_CROP_KEYPOINT_SCORE)continue;const s=Math.abs(i-t[a][0]),n=Math.abs(o-t[a][1]);s>l&&(l=s),n>h&&(h=n)}return[n,r,l,h]}determineCropRegion(e,t,i){const o={};for(const s of h.COCO_KEYPOINTS)o[s]=[e[this.keypointIndexByName[s]].y*t,e[this.keypointIndexByName[s]].x*i];if(this.torsoVisible(e)){const s=(o.left_hip[0]+o.right_hip[0])/2,n=(o.left_hip[1]+o.right_hip[1])/2,[r,l,h,a]=this.determineTorsoAndBodyRange(e,o,s,n);let p=Math.max(1.9*l,1.9*r,1.2*h,1.2*a);p=Math.min(p,Math.max(n,i-n,s,t-s));const c=[s-p,n-p];if(p>Math.max(i,t)/2)return this.initCropRegion(t,i);{const e=2*p;return{yMin:c[0]/t,xMin:c[1]/i,yMax:(c[0]+e)/t,xMax:(c[1]+e)/i,height:(c[0]+e)/t-c[0]/t,width:(c[1]+e)/i-c[1]/i}}}return this.initCropRegion(t,i)}initCropRegion(e,t){let i,o,s,n;return this.cropRegion?t>e?(i=t/e,o=1,s=(e/2-t/2)/e,n=0):(i=1,o=e/t,s=0,n=(t/2-e/2)/t):t>e?(i=1,o=e/t,s=0,n=(t/2-e/2)/t):(i=t/e,o=1,s=(e/2-t/2)/e,n=0),{yMin:s,xMin:n,yMax:s+i,xMax:n+o,height:i,width:o}}}exports.load=async function(e=c.MOVENET_CONFIG){const t=_.validateModelConfig(e);let o;if(t.modelUrl)o=await i.loadGraphModel(t.modelUrl);else{let e;t.modelType===c.SINGLEPOSE_LIGHTNING?e=c.MOVENET_SINGLEPOSE_LIGHTNING_URL:t.modelType===c.SINGLEPOSE_THUNDER&&(e=c.MOVENET_SINGLEPOSE_THUNDER_URL),o=await i.loadGraphModel(e,{fromTFHub:!0})}return new R(o,t)};
