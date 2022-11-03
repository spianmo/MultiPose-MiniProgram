"use strict";
const common_vendor = require("../../../common/vendor.js");
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
function smoothSegmentation(prevMask, newMask, config) {
  if (common_vendor.getBackend() === "webgl") {
    return smoothSegmentationWebGL(prevMask, newMask, config);
  }
  return common_vendor.tidy(() => {
    const c1 = 5.68842;
    const c2 = -0.748699;
    const c3 = -57.8051;
    const c4 = 291.309;
    const c5 = -624.717;
    const t = common_vendor.sub(newMask, 0.5);
    const x = common_vendor.square(t);
    const uncertainty = common_vendor.sub(
      1,
      common_vendor.minimum(
        1,
        common_vendor.mul(
          x,
          common_vendor.add(
            c1,
            common_vendor.mul(
              x,
              common_vendor.add(
                c2,
                common_vendor.mul(
                  x,
                  common_vendor.add(
                    c3,
                    common_vendor.mul(
                      x,
                      common_vendor.add(c4, common_vendor.mul(x, c5))
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
    return common_vendor.add(
      newMask,
      common_vendor.mul(
        common_vendor.sub(prevMask, newMask),
        common_vendor.mul(uncertainty, config.combineWithPreviousRatio)
      )
    );
  });
}
function smoothSegmentationWebGL(prevMask, newMask, config) {
  const ratio = config.combineWithPreviousRatio.toFixed(2);
  const program = {
    variableNames: ["prevMask", "newMask"],
    outputShape: prevMask.shape,
    userCode: `
  void main() {
      ivec2 coords = getOutputCoords();
      int height = coords[0];
      int width = coords[1];

      float prevMaskValue = getPrevMask(height, width);
      float newMaskValue = getNewMask(height, width);

      /*
      * Assume p := newMaskValue
      * H(p) := 1 + (p * log(p) + (1-p) * log(1-p)) / log(2)
      * uncertainty alpha(p) =
      *   Clamp(1 - (1 - H(p)) * (1 - H(p)), 0, 1) [squaring the
      * uncertainty]
      *
      * The following polynomial approximates uncertainty alpha as a
      * function of (p + 0.5):
      */
      const float c1 = 5.68842;
      const float c2 = -0.748699;
      const float c3 = -57.8051;
      const float c4 = 291.309;
      const float c5 = -624.717;
      float t = newMaskValue - 0.5;
      float x = t * t;

      float uncertainty =
        1.0 - min(1.0, x * (c1 + x * (c2 + x * (c3 + x * (c4 + x * c5)))));

      float outputValue = newMaskValue + (prevMaskValue - newMaskValue) *
                             (uncertainty * ${ratio});

      setOutput(outputValue);
    }
`
  };
  const webglBackend = common_vendor.backend();
  return common_vendor.tidy(() => {
    const outputTensorInfo = webglBackend.compileAndRun(program, [prevMask, newMask]);
    return common_vendor.engine().makeTensorFromDataId(
      outputTensorInfo.dataId,
      outputTensorInfo.shape,
      outputTensorInfo.dtype
    );
  });
}
exports.smoothSegmentation = smoothSegmentation;
