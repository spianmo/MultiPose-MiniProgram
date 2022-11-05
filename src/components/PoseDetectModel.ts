import {Frame, FrameAdapter} from "../utils/FrameAdapter";
import {movenet, Pose, SupportedModels} from "@tensorflow-models/pose-detection";

let poseDetectModel: {
    canvas2D: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    frameAdapter: FrameAdapter;
    cameraCtx: WechatMiniprogram.CameraContext;
    cameraListener: WechatMiniprogram.CameraFrameListener;
};

export const DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL =
    'http://oss.cache.ren/img/blazepose_3d/detector/1/model.json';
export const DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL =
    'http://oss.cache.ren/img/blazepose_3d/landmark/full/2/model.json';
export const DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE =
    'http://oss.cache.ren/img/blazepose_3d/landmark/lite/2/model.json';
export const DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY =
    'http://oss.cache.ren/img/blazepose_3d/landmark/heavy/2/model.json';

export const MOVENET_SINGLEPOSE_LIGHTNING_URL =
    'http://oss.cache.ren/img/movenet/singlepose/lightning/4/model.json';
export const MOVENET_SINGLEPOSE_THUNDER_URL =
    'http://oss.cache.ren/img/movenet/singlepose/thunder/4/model.json';
export const MOVENET_MULTIPOSE_LIGHTNING_URL =
    'http://oss.cache.ren/img/movenet/multipose/lightning/1/model.json';
export const POSENET_URL =
    'http://oss.cache.ren/img/posenet/mobilenet/float/050/1/model-stride16.json';

export const DETECT_CONFIG: any = {
    "PoseNet-MobileNetV1": {
        model: SupportedModels.PoseNet,
        modelConfig: {
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: 640, height: 480 },
            multiplier: 0.75,
            modelUrl: POSENET_URL
        }
    },
    "MoveNet-SinglePose-Lightning": {
        model: SupportedModels.MoveNet,
        modelConfig: {
            modelType: movenet.modelType.SINGLEPOSE_LIGHTNING,
            modelUrl: MOVENET_SINGLEPOSE_LIGHTNING_URL
        }
    },
    "MoveNet-SinglePose-Thunder": {
        model: SupportedModels.MoveNet,
        modelConfig: {modelType: movenet.modelType.SINGLEPOSE_THUNDER},
        modelUrl: MOVENET_SINGLEPOSE_THUNDER_URL
    },
    "BlazePose-Lite": {
        model: SupportedModels.BlazePose,
        modelConfig: {
            runtime: 'tfjs',
            modelType: 'lite',
            enableSmoothing: true,
            detectorModelUrl: DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL,
            landmarkModelUrl: DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_LITE
        }
    }
}

export type FpsCallback = (fps: string) => {}

export type DetectResult = {
    pose: Pose,
    costTime: number,
    currentTime: Date
}

export type DetectPoseCallback = (detectResult: DetectResult) => void

export type FrameCallback = (frame: Frame, deps: Deps) => {}

export type Deps = typeof poseDetectModel;