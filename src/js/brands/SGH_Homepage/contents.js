import RTR from "../../main";
import { eventCatcher, loadScript } from "../../modules/utils";

export class Contents{
    constructor(){
        this.RTR = null;
        this.json = window.ct_RTRBannerHome.json;

        this.init();
        
       
    }
    init(){
        this.buildHtml();
        this.load();
        this.eventHandler();
        
       
    }
    buildHtml(){
        this.container = document.querySelector('#ct_cm__RTR_container');

        
    }
    load(){
        eventCatcher('ct_cm_rtr__loadData',()=>{
            this.RTR = new RTR({
                selector:'.ct_cm_RTR__viewer',
                version:"5.1.2",
                upc: "8056597918824",
                zoom: true,
                showBackground:true,
                clearColor:'#D9CDC4',
                backgroundPath:'@utilitiesPath@@imagePath@/images/SGH/bkg_rtr.jpg', //dev
                // backgroundPath:'@utilitiesPath@@imagePath@images/SGH/bkg_rtr.jpg' //prod
                boundingAreaTopLeftX:.5
            })
        },true)

        eventCatcher('ct_cm_rtr__loadModel',()=>{
            this.RTR.init();
        },true);
    }
    eventHandler(){
        eventCatcher('ct_cm__RTR_rendered',({id})=>{
            if(id === this.RTR.selector) document.querySelector('.ct_cm__loader').classList.add('ct_cm__loaded')
        })
    }
}