import {FrameAdapter} from "../../utils/FrameAdapter";

let deps: {
    canvas2D: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    frameAdapter: FrameAdapter;
    cameraCtx: WechatMiniprogram.CameraContext;
    cameraListener: WechatMiniprogram.CameraFrameListener;
};

export type Deps = typeof deps;