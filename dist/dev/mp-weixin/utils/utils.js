"use strict";
function getNode(id, ctx) {
  return new Promise((resolve) => {
    wx.createSelectorQuery().in(ctx).select(id).fields({ node: true, rect: true, size: true }).exec((res) => {
      resolve(res);
    });
  });
}
function objectFit(imgW, imgH, canW, canH) {
  let w, h;
  const canRatio = canW / canH;
  const imgRatio = imgW / imgH;
  if (canRatio > imgRatio) {
    w = canW;
    h = canW / imgRatio;
  } else {
    w = canH * imgRatio;
    h = canH;
  }
  return [w, h];
}
exports.getNode = getNode;
exports.objectFit = objectFit;
