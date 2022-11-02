"use strict";
const { platform } = wx.getSystemInfoSync();
const TEXT_FILE_EXTS = /\.(txt|json|html|txt|csv)/;
function parseResponse(url, res) {
  let header = res.header || {};
  header = Object.keys(header).reduce((map, key) => {
    map[key.toLowerCase()] = header[key];
    return map;
  }, {});
  return {
    ok: (res.statusCode / 200 | 0) === 1,
    status: res.statusCode,
    statusText: res.statusCode,
    url,
    clone: () => parseResponse(url, res),
    text: () => Promise.resolve(
      typeof res.data === "string" ? res.data : JSON.stringify(res.data)
    ),
    json: () => {
      if (typeof res.data === "object")
        return Promise.resolve(res.data);
      let json = {};
      try {
        json = JSON.parse(res.data);
      } catch (err) {
        console.error(err);
      }
      return Promise.resolve(json);
    },
    arrayBuffer: () => {
      return Promise.resolve(res.data);
    },
    headers: {
      keys: () => Object.keys(header),
      entries: () => {
        const all = [];
        for (const key in header) {
          if (header.hasOwnProperty(key)) {
            all.push([key, header[key]]);
          }
        }
        return all;
      },
      get: (n) => header[n.toLowerCase()],
      has: (n) => n.toLowerCase() in header
    }
  };
}
function fetchFunc(url, options) {
  options = options || {};
  const dataType = url.match(TEXT_FILE_EXTS) ? "text" : "arraybuffer";
  const usePatch = dataType === "arraybuffer" && platform === "ios";
  console.log("fetch start", url);
  return new Promise((resolve, reject) => {
    let successed = false;
    const onSuccess = function(resp) {
      if (successed)
        return;
      console.log("fetch done", url);
      successed = true;
      return resolve(parseResponse(url, resp));
    };
    wx.request({
      url,
      method: options.method || "GET",
      data: options.body,
      header: options.headers,
      dataType,
      responseType: dataType,
      enableCache: true,
      success: onSuccess,
      fail: reject
    });
    if (usePatch) {
      setTimeout(function() {
        wx.request({
          url,
          method: options.method || "GET",
          data: options.body,
          header: options.headers,
          dataType,
          responseType: dataType,
          enableCache: true,
          success: onSuccess,
          fail: reject
        });
      }, 200);
    }
  });
}
exports.fetchFunc = fetchFunc;
