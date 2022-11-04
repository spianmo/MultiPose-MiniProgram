export function getNode(
    id: string,
    ctx: any,
): Promise<[{ node: HTMLCanvasElement; width: number; height: Number }]> {
    return new Promise(resolve => {
        wx.createSelectorQuery().in(ctx).select(id).fields({ node: true, rect: true, size: true }).exec(resolve);
    });
}

export function objectFit(imgW: number, imgH: number, canW: number, canH: number) {
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

export const fetch = (url: string) =>
    new Promise((resolve, reject) => wx.request({url, success: resolve, fail: reject}));

export const onePixel = {
    width: 1,
    height: 1,
    data: new Uint8Array([0, 0, 0, 1]),
}