import {FrameAdapter} from "../../utils/FrameAdapter";

let deps: {
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
    'http://oss.cache.ren/img/movenet/singlepose/lightning/4';
export const MOVENET_SINGLEPOSE_THUNDER_URL =
    'http://oss.cache.ren/img/movenet/singlepose/thunder/4';
export const MOVENET_MULTIPOSE_LIGHTNING_URL =
    'http://oss.cache.ren/img/movenet/multipose/lightning/1';

export type Deps = typeof deps;