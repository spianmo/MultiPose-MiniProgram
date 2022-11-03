"use strict";const e=require("../../common/vendor.js"),a=require("../../utils/utils.js"),t=require("../../tfjs-plugin/wechat_platform.js"),n=require("../../tfjs-plugin/fetch.js"),s=require("../../utils/FrameAdapter.js"),c=e.defineComponent({__name:"PoseCamera",setup(c,{expose:i}){let o;t.setupWechatPlatform({fetchFunc:n.fetchFunc,tf:e.tf,webgl:e.webgl,canvas:wx.createOffscreenCanvas()}),e.enableProdMode();const{windowWidth:r,windowHeight:d}=wx.getSystemInfoSync(),w=e.getCurrentInstance();let g;const l=e.reactive({FPS:"0",backend:"",inited:!1,usingCamera:!0,switchingBackend:!1,canvas2DW:0,canvas2DH:0});return e.onMounted((async()=>{await wx.showLoading({title:"初始化中",mask:!1}),console.log("helper view ready"),l.backend=e.getBackend(),e.nextTick((async()=>{const[{node:e}]=await a.getNode("#gl",w),[{node:t}]=await a.getNode("#canvas",w),[{node:n}]=await a.getNode("#canvas-input",w);console.log(e,t,n),console.log("helper view get canvas node");const c=t.getContext("2d"),i=n.getContext("2d"),m=wx.createCameraContext(),h=new s.FrameAdapter,u=m.onCameraFrame(h.triggerFrame.bind(h));let v=!1;h.onProcessFrame((async e=>{if(!v){const[t,n]=a.objectFit(e.width,e.height,r,.9*d);l.canvas2DH=n,l.canvas2DW=t,v=!0}if(o&&!l.switchingBackend){const a=Date.now();o(e,g),await new Promise((e=>t.requestAnimationFrame(e))),l.FPS=(1e3/(Date.now()-a)).toFixed(2)}})),g={ctx:c,inputCtx:i,canvasGL:e,canvas2D:t,canvasInput:n,cameraCtx:m,frameAdapter:h,cameraListener:u},console.log("helper view inited"),await wx.hideLoading()}))})),e.onUnmounted((()=>{l.usingCamera&&(null==g||g.cameraListener.stop()),g=null,o=null})),i({drawCanvas2D:e=>{g.ctx.clearRect(0,0,g.canvas2D.width,g.canvas2D.height),g.canvas2D.width=e.width,g.canvas2D.height=e.height;const a=g.canvas2D.createImageData(new Uint8Array(e.data),e.width,e.height);g.ctx.putImageData(a,0,0)},set:e=>{o=e.onFrame},start:()=>{g.cameraListener.start()},stop:()=>{g.cameraListener.stop()}}),(e,a)=>({a:`${l.canvas2DW}px`,b:`${l.canvas2DH}px`})}});wx.createComponent(c);
