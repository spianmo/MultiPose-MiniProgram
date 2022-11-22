# MultiPose-MiniProgram

> 基于Vite, TypeScript, UniCli, Vue3完成微信小程序中的人体姿势检测，支持PoseNet、MoveNet、BlazePose模型

- 已封装组件，支持微信前后置摄像头的切换，FPS回调，逐帧检测结果回调

```vue
    <!--图层：姿势检测驱动-->
    <div class="tf-layer-pose">
      <PoseDetectionView ref="poseDetectionView" detect-model="BlazePose-Lite" camera-position="front"
                         :detect-callback="detectCallback"/>
    </div>
```

- 支持的模型配置

```typescript
export const DETECT_CONFIG: any = {
    "PoseNet-MobileNetV1": {
        model: SupportedModels.PoseNet,
        modelConfig: {
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: {width: 640, height: 480},
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
    },
    "BlazePose-Full": {
        model: SupportedModels.BlazePose,
        modelConfig: {
            runtime: 'tfjs',
            modelType: 'full',
            enableSmoothing: true,
            detectorModelUrl: DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL,
            landmarkModelUrl: DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_FULL
        }
    },
    "BlazePose-Heavy": {
        model: SupportedModels.BlazePose,
        modelConfig: {
            runtime: 'tfjs',
            modelType: 'heavy',
            enableSmoothing: true,
            detectorModelUrl: DEFAULT_BLAZEPOSE_DETECTOR_MODEL_URL,
            landmarkModelUrl: DEFAULT_BLAZEPOSE_LANDMARK_MODEL_URL_HEAVY
        }
    }
}
```

