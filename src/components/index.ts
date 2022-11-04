import PoseCamera from "./PoseCamera.vue"
import PoseDetectionView from "./PoseDetectionView.vue"
import {App} from "vue";

// 按需导入用
export {
    PoseCamera,
    PoseDetectionView
}
// 全局导入用
export default {
    install: (app: App) => {
        app.component('PoseCamera', PoseCamera)
        app.component('PoseDetectionView', PoseDetectionView)
    }
}