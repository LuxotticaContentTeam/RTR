import RTR from "../../main";
import { eventCatcher, loadScript } from "../../modules/utils";

export class Contents{
    constructor(){
        this.init();
    }
    init(){
        
        eventCatcher('ct_cm__loadLibrary',()=>{
            if (ct_RTRBannerHome.stateManger.env === 'development'){
                loadScript('../static/lib/main.js')
            }else{
                loadScript('https://rtr-viewer.luxottica.com/lib/v/5.1.2/main.js')
            }
        },true)

        eventCatcher('ct_cm__loadRTR',()=>{
            console.log('loadrtr')
            new RTR({
                selector:'#ct_cm__RTR__viewer',
                upc: "8056597918824",
                zoom: false
            })
        },true);
    }
}