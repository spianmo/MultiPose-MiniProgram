import {FrameAdapter} from "../../utils/FrameAdapter";

let deps: {
    canvasGL: HTMLCanvasElement;
    canvas2D: HTMLCanvasElement;
    canvasInput: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    inputCtx: CanvasRenderingContext2D;

    frameAdapter: FrameAdapter;
    cameraCtx: WechatMiniprogram.CameraContext;
    cameraListener: WechatMiniprogram.CameraFrameListener;
};

export type Deps = typeof deps;