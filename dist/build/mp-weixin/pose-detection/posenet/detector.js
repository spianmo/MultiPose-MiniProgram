"use strict";var e=Object.defineProperty,t=(t,s,i)=>(((t,s,i)=>{s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[s]=i})(t,"symbol"!=typeof s?s+"":s,i),i);const s=require("../../common/vendor.js"),i=require("../calculators/convert_image_to_tensor.js"),o=require("../calculators/image_utils.js"),u=require("../calculators/shift_image_value.js"),r=require("./calculators/decode_multiple_poses.js"),a=require("./calculators/decode_single_pose.js"),l=require("./calculators/flip_poses.js"),n=require("./calculators/scale_poses.js"),c=require("./constants.js"),d=require("./detector_utils.js"),p=require("./load_utils.js");
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
class h{constructor(e,i){t(this,"inputResolution"),t(this,"architecture"),t(this,"outputStride"),t(this,"maxPoses"),this.posenetModel=e;const o=this.posenetModel.inputs[0].shape;s.assert(-1===o[1]&&-1===o[2],(()=>`Input shape [${o[1]}, ${o[2]}] must both be equal to or -1`));const u=p.getValidInputResolutionDimensions(i.inputResolution,i.outputStride);d.assertValidOutputStride(i.outputStride),d.assertValidResolution(u,i.outputStride),this.inputResolution=u,this.outputStride=i.outputStride,this.architecture=i.architecture}async estimatePoses(e,t=c.SINGLE_PERSON_ESTIMATION_CONFIG){const p=d.validateEstimationConfig(t);if(null==e)return[];this.maxPoses=p.maxPoses;const{imageTensor:h,padding:m}=i.convertImageToTensor(e,{inputResolution:this.inputResolution,keepAspectRatio:!0}),q="ResNet50"===this.architecture?s.add(h,c.RESNET_MEAN):u.shiftImageValue(h,[-1,1]),_=this.posenetModel.predict(q);let S,g,R,f;"ResNet50"===this.architecture?(S=s.squeeze(_[2],[0]),g=s.squeeze(_[3],[0]),R=s.squeeze(_[0],[0]),f=s.squeeze(_[1],[0])):(S=s.squeeze(_[0],[0]),g=s.squeeze(_[1],[0]),R=s.squeeze(_[2],[0]),f=s.squeeze(_[3],[0]));const N=s.sigmoid(g);let j;if(1===this.maxPoses){j=[await a.decodeSinglePose(N,S,this.outputStride)]}else j=await r.decodeMultiplePoses(N,S,R,f,this.outputStride,this.maxPoses,p.scoreThreshold,p.nmsRadius);const P=o.getImageSize(e);let z=n.scalePoses(j,P,this.inputResolution,m);return p.flipHorizontal&&(z=l.flipPosesHorizontal(z,P)),h.dispose(),q.dispose(),s.dispose(_),S.dispose(),g.dispose(),R.dispose(),f.dispose(),N.dispose(),z}dispose(){this.posenetModel.dispose()}reset(){}}exports.load=async function(e=c.MOBILENET_V1_CONFIG){const t=d.validateModelConfig(e);if("ResNet50"===t.architecture){const e=p.resNet50Checkpoint(t.outputStride,t.quantBytes),i=await s.loadGraphModel(t.modelUrl||e);return new h(i,t)}const i=p.mobileNetCheckpoint(t.outputStride,t.multiplier,t.quantBytes),o=await s.loadGraphModel(t.modelUrl||i);return new h(o,t)};
