import { getDeviceType } from "./utils";

class StateManager {
    constructor(){
        this.videoActive= null;
        this.activeIndex = null;
        this.prodListActive = null;
        this.manualPause = false;
        this.device = getDeviceType();
    }
}
export default StateManager