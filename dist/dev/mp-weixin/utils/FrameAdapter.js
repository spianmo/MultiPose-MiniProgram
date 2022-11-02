"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class FrameAdapter {
  constructor(maxProcessFrame = Number.MAX_SAFE_INTEGER, frameGap = 30) {
    __publicField(this, "frameNum", 0);
    __publicField(this, "processFrameNum", 0);
    __publicField(this, "frameGap");
    __publicField(this, "frameProcesser");
    __publicField(this, "lastProcessTime");
    __publicField(this, "maxProcessFrame");
    __publicField(this, "currGap", 0);
    __publicField(this, "lastFrameDone", true);
    __publicField(this, "maxFrameCB");
    this.frameGap = frameGap;
    this.maxProcessFrame = maxProcessFrame;
  }
  onProcessFrame(cb) {
    this.frameProcesser = cb;
  }
  onMaxFrame(cb) {
    this.maxFrameCB = cb;
  }
  reset() {
    this.currGap = 0;
    this.frameNum = 0;
    this.processFrameNum = 0;
  }
  async triggerFrame(frame) {
    var _a;
    if (this.frameProcesser && this.processFrameNum < this.maxProcessFrame && this.lastFrameDone) {
      if (this.frameNum === 0 || this.lastProcessTime === void 0) {
        await this.processFrame(frame);
      } else {
        const gap = Math.max(Math.round(this.lastProcessTime / this.frameGap), 1);
        this.currGap = gap;
        if (this.frameNum >= gap) {
          await this.processFrame(frame);
          this.frameNum = 0;
        }
      }
      this.frameNum++;
    }
    if (this.processFrameNum === this.maxProcessFrame) {
      this.processFrameNum++;
      (_a = this.maxFrameCB) == null ? void 0 : _a.call(this);
    }
  }
  async processFrame(frame) {
    if (this.frameProcesser) {
      this.lastFrameDone = false;
      const t = Date.now();
      await this.frameProcesser(frame);
      this.lastFrameDone = true;
      this.lastProcessTime = Date.now() - t;
    }
    this.processFrameNum++;
  }
}
exports.FrameAdapter = FrameAdapter;
