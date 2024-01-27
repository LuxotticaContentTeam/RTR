import { getDeviceType } from "./utils";

class StateManager {
    constructor(){
        this.env = "@env@";
        this.device = getDeviceType({
            desk_min:1025,
            tab_max:1024,
            tab_min:768,
            mob_max:767
        });
        
    }
}
export default StateManager