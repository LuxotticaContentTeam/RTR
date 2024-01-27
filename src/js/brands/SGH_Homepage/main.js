import RTR from "../../main";
import { Lazy } from "../../modules/lazy";
import StateManager from "../../modules/stateManager";
import { checkStore, customLog, getData } from '../../modules/utils';
import { Contents } from "./contents";
import { infoStore, infoStoreLocal } from "./info_store";

class BannerHome{
    constructor(){
        this.stateManger = new StateManager();
        window.ct_RTRBannerHome = this;
        this.init()
    }

    async init (){
        customLog('started')   

        
        this.infoStore = await checkStore(this.stateManger.env,infoStoreLocal,infoStore);
        
        
        this.rawJson = await getData();
        
        
        // this.json = clearData(this.rawJson)
        this.Contents = new Contents()

        Lazy({selector:'#ct_cm__RTR'});


    }
}
 


new BannerHome();