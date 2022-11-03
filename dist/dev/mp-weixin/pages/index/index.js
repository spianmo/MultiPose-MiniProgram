"use strict";
const common_vendor = require("../../common/vendor.js");
const poseDetection_index = require("../../pose-detection/index.js");
const utils_painter = require("../../utils/painter.js");
const utils_utils = require("../../utils/utils.js");
const poseDetection_create_detector = require("../../pose-detection/create_detector.js");
const poseDetection_types = require("../../pose-detection/types.js");
require("../../pose-detection/movenet/constants.js");
require("../../pose-detection/posenet/calculators/decode_multiple_poses_util.js");
require("../../pose-detection/constants.js");
require("../../pose-detection/posenet/constants.js");
require("../../pose-detection/util.js");
require("../../pose-detection/blazepose_mediapipe/detector.js");
require("../../pose-detection/shared/calculators/mask_util.js");
require("../../pose-detection/blazepose_mediapipe/detector_utils.js");
require("../../pose-detection/blazepose_mediapipe/constants.js");
require("../../pose-detection/blazepose_tfjs/detector.js");
require("../../pose-detection/shared/calculators/calculate_alignment_points_rects.js");
require("../../pose-detection/shared/calculators/detection_to_rect.js");
require("../../pose-detection/shared/calculators/image_utils.js");
require("../../pose-detection/shared/calculators/calculate_inverse_matrix.js");
require("../../pose-detection/shared/calculators/calculate_landmark_projection.js");
require("../../pose-detection/shared/calculators/calculate_score_copy.js");
require("../../pose-detection/shared/calculators/calculate_world_landmark_projection.js");
require("../../pose-detection/shared/calculators/constants.js");
require("../../pose-detection/shared/calculators/convert_image_to_tensor.js");
require("../../pose-detection/shared/calculators/get_rotated_sub_rect_to_rect_transformation_matrix.js");
require("../../pose-detection/shared/calculators/shift_image_value.js");
require("../../pose-detection/shared/calculators/create_ssd_anchors.js");
require("../../pose-detection/shared/calculators/detector_result.js");
require("../../pose-detection/shared/calculators/split_detection_result.js");
require("../../pose-detection/shared/calculators/is_video.js");
require("../../pose-detection/shared/calculators/landmarks_to_detection.js");
require("../../pose-detection/shared/calculators/non_max_suppression.js");
require("../../pose-detection/shared/calculators/normalized_keypoints_to_keypoints.js");
require("../../pose-detection/shared/calculators/refine_landmarks_from_heatmap.js");
require("../../pose-detection/shared/calculators/remove_detection_letterbox.js");
require("../../pose-detection/shared/calculators/remove_landmark_letterbox.js");
require("../../pose-detection/shared/calculators/segmentation_smoothing.js");
require("../../pose-detection/shared/calculators/tensors_to_detections.js");
require("../../pose-detection/shared/calculators/tensors_to_landmarks.js");
require("../../pose-detection/shared/calculators/sigmoid.js");
require("../../pose-detection/shared/calculators/tensors_to_segmentation.js");
require("../../pose-detection/shared/calculators/transform_rect.js");
require("../../pose-detection/shared/filters/keypoints_smoothing.js");
require("../../pose-detection/shared/calculators/get_object_scale.js");
require("../../pose-detection/shared/calculators/keypoints_to_normalized_keypoints.js");
require("../../pose-detection/shared/filters/keypoints_one_euro_filter.js");
require("../../pose-detection/shared/filters/one_euro_filter.js");
require("../../pose-detection/shared/filters/low_pass_filter.js");
require("../../pose-detection/shared/filters/keypoints_velocity_filter.js");
require("../../pose-detection/shared/filters/relative_velocity_filter.js");
require("../../pose-detection/shared/filters/visibility_smoothing.js");
require("../../pose-detection/blazepose_tfjs/constants.js");
require("../../pose-detection/blazepose_tfjs/detector_utils.js");
require("../../pose-detection/movenet/detector.js");
require("../../pose-detection/calculators/bounding_box_tracker.js");
require("../../pose-detection/calculators/tracker.js");
require("../../pose-detection/calculators/tracker_utils.js");
require("../../pose-detection/calculators/keypoint_tracker.js");
require("../../pose-detection/calculators/types.js");
require("../../pose-detection/movenet/crop_utils.js");
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
if (!Math) {
  PoseCamera();
}
const PoseCamera = () => "./PoseCamera.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const helper = common_vendor.ref(null);
    const state = common_vendor.reactive({
      isDetect: false
    });
    common_vendor.onReady(async () => {
      await common_vendor.ready();
      const model = await poseDetection_create_detector.createDetector(poseDetection_types.SupportedModels.MoveNet, { modelType: poseDetection_index.movenet.modelType.SINGLEPOSE_LIGHTNING });
      console.log("movenet load end");
      const t = Date.now();
      await model.estimatePoses(utils_utils.onePixel, { flipHorizontal: false });
      console.log("movenet warm up", Date.now() - t);
      const painter = new utils_painter.Painter();
      const onFrame = async (frame, deps) => {
        const { ctx, canvas2D } = deps;
        const video = {
          width: frame.width,
          height: frame.height,
          data: new Uint8Array(frame.data)
        };
        helper.value.drawCanvas2D(frame);
        const t2 = Date.now();
        const prediction = await model.estimatePoses(video, { flipHorizontal: false });
        console.log("predict cost", Date.now() - t2);
        painter.setCtx(ctx);
        painter.setCanvas2D(canvas2D);
        painter.drawResults(prediction);
      };
      helper.value.set({ onFrame });
    });
    const toggleDetect = () => {
      if (!state.isDetect) {
        common_vendor.unref(helper).start();
        state.isDetect = true;
      } else {
        common_vendor.unref(helper).stop();
        state.isDetect = false;
      }
    };
    common_vendor.onShow(() => {
      console.log("onShow");
    });
    common_vendor.onHide(() => {
      console.log("onHide");
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.sr(helper, "607a84ee-0", {
          "k": "helper"
        }),
        b: common_vendor.t(state.isDetect ? "\u505C\u6B62\u8BC6\u522B" : "\u5F00\u59CB\u8BC6\u522B"),
        c: common_vendor.o(toggleDetect)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/Projects/HealBoneProjects/WeChatProjects/cv-medical-miniprogram-vue3-ts/src/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
