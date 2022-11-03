"use strict";
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
 */const e="https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/";function t(e,t){return function(e,t){return(e-1)%t==0}(e,t)?e:Math.floor(e/t)*t+1}exports.getValidInputResolutionDimensions=function(e,o){return{height:t(e.height,o),width:t(e.width,o)}},exports.mobileNetCheckpoint=function(e,t,o){const s={1:"100",.75:"075",.5:"050"},n=`model-stride${e}.json`;return 4===o?`https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/float/${s[t]}/`+n:`https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/quant${o}/${s[t]}/`+n},exports.resNet50Checkpoint=function(t,o){const s=`model-stride${t}.json`;return 4===o?e+"float/"+s:`https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/quant${o}/`+s};
