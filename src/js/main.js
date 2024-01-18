
// import {ct_log, ct_get__device_type, eventCatcher} from './modules/utils';

import Contents from './modules/contents';
import StateManager from './modules/stateManager';
import { Lazy } from './modules/lazy';
import { checkData, checkStore, clearData } from './modules/data';
import { customLog } from './modules/utils';

class Core {
    constructor(){
        window.ct_SMV2 = this;
        this.StateManager = new StateManager();
        
        this.init();
       
    }    
    async init (){
        customLog('started')   

        await checkStore();
        
        this.rawJson = await checkData();

        Lazy();
        
        this.json = clearData(this.rawJson)

        this.Contents = new Contents()

    }
}

new Core();