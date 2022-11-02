"use strict";
const common_vendor = require("../../common/vendor.js");
const poseDetection_index = require("../../pose-detection/index.js");
const utils_index = require("../../utils/index.js");
const tfjsPlugin_wechat_platform = require("../../tfjs-plugin/wechat_platform.js");
const tfjsPlugin_fetch = require("../../tfjs-plugin/fetch.js");
const poseDetection_create_detector = require("../../pose-detection/create_detector.js");
const poseDetection_types = require("../../pose-detection/types.js");
require("../../pose-detection/movenet/constants.js");
require("../../pose-detection/posenet/calculators/decode_multiple_poses_util.js");
require("../../pose-detection/constants.js");
require("../../pose-detection/posenet/constants.js");
require("../../pose-detection/blazepose_tfjs/detector.js");
require("../../pose-detection/calculators/constants.js");
require("../../pose-detection/calculators/convert_image_to_tensor.js");
require("../../pose-detection/calculators/image_utils.js");
require("../../pose-detection/calculators/is_video.js");
require("../../pose-detection/calculators/keypoints_smoothing.js");
require("../../pose-detection/calculators/keypoints_one_euro_filter.js");
require("../../pose-detection/calculators/one_euro_filter.js");
require("../../pose-detection/calculators/low_pass_filter.js");
require("../../pose-detection/calculators/velocity_filter_utils.js");
require("../../pose-detection/calculators/keypoints_to_normalized_keypoints.js");
require("../../pose-detection/calculators/keypoints_velocity_filter.js");
require("../../pose-detection/calculators/relative_velocity_filter.js");
require("../../pose-detection/calculators/normalized_keypoints_to_keypoints.js");
require("../../pose-detection/calculators/shift_image_value.js");
require("../../pose-detection/blazepose_tfjs/calculators/calculate_alignment_points_rects.js");
require("../../pose-detection/blazepose_tfjs/calculators/detection_to_rect.js");
require("../../pose-detection/blazepose_tfjs/calculators/calculate_landmark_projection.js");
require("../../pose-detection/blazepose_tfjs/calculators/create_ssd_anchors.js");
require("../../pose-detection/blazepose_tfjs/calculators/detector_inference.js");
require("../../pose-detection/blazepose_tfjs/calculators/split_detection_result.js");
require("../../pose-detection/blazepose_tfjs/calculators/landmarks_to_detection.js");
require("../../pose-detection/blazepose_tfjs/calculators/non_max_suppression.js");
require("../../pose-detection/blazepose_tfjs/calculators/refine_landmarks_from_heatmap.js");
require("../../pose-detection/blazepose_tfjs/calculators/remove_detection_letterbox.js");
require("../../pose-detection/blazepose_tfjs/calculators/remove_landmark_letterbox.js");
require("../../pose-detection/blazepose_tfjs/calculators/tensors_to_detections.js");
require("../../pose-detection/blazepose_tfjs/calculators/tensors_to_landmarks.js");
require("../../pose-detection/calculators/sigmoid.js");
require("../../pose-detection/blazepose_tfjs/calculators/transform_rect.js");
require("../../pose-detection/blazepose_tfjs/calculators/visibility_smoothing.js");
require("../../pose-detection/blazepose_tfjs/constants.js");
require("../../pose-detection/blazepose_tfjs/detector_utils.js");
require("../../pose-detection/movenet/detector.js");
require("../../pose-detection/util.js");
require("../../pose-detection/movenet/detector_utils.js");
require("../../pose-detection/posenet/detector.js");
require("../../pose-detection/posenet/calculators/decode_multiple_poses.js");
require("../../pose-detection/posenet/calculators/build_part_with_score_queue.js");
require("../../pose-detection/posenet/calculators/max_heap.js");
require("../../pose-detection/posenet/calculators/decode_single_pose.js");
require("../../pose-detection/posenet/calculators/decode_single_pose_util.js");
require("../../pose-detection/posenet/calculators/flip_poses.js");
require("../../pose-detection/posenet/calculators/scale_poses.js");
require("../../pose-detection/posenet/detector_utils.js");
require("../../pose-detection/posenet/load_utils.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PoseCamera",
  setup(__props) {
    const state = common_vendor.reactive({
      canvasGL: null,
      canvas2D: null,
      canvasInput: null,
      ctx: null,
      inputCtx: null,
      frameAdapter: null,
      cameraCtx: null,
      cameraListener: null
    });
    tfjsPlugin_wechat_platform.setupWechatPlatform({
      fetchFunc: tfjsPlugin_fetch.fetchFunc,
      tf: common_vendor.tf,
      webgl: common_vendor.webgl,
      canvas: wx.createOffscreenCanvas()
    });
    common_vendor.enableProdMode();
    common_vendor.onMounted(async () => {
      const model = await poseDetection_create_detector.createDetector(poseDetection_types.SupportedModels.MoveNet, { modelType: poseDetection_index.movenet.modelType.SINGLEPOSE_LIGHTNING });
      model.estimatePoses(utils_index.onePixel, { flipHorizontal: false });
    });
    common_vendor.onUnmounted(() => {
      stopCamera();
    });
    common_vendor.toRefs(state);
    return (_ctx, _cache) => {
      return {
        a: `${state.canvas2DW}px`,
        b: `${state.canvas2DH}px`
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/HealBoneProjects/WeChatProjects/cv-medical-miniprogram-vue3-ts/src/pages/index/PoseCamera.vue"]]);
wx.createComponent(Component);
