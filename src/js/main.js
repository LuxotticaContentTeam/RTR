
// import {ct_log, ct_get__device_type, eventCatcher} from './modules/utils';

import { checkData } from "./modules/utils";

// import Contents from './modules/contents';
// import StateManager from './modules/stateManager';
// import { Lazy } from './modules/lazy';
// import { checkData, checkStore, clearData } from './modules/data';
// import { customLog } from './modules/utils';

export default class RTR {
    constructor(options){
        window.ct_RTR = this;
        this.RTRViewr = null;
        this.options = options;
        this.selector = options.selector;
        this.upc = options.upc;
        this.hdr = options.hdr || "@utilitiesPath@@imagePath@/hdr/panorama_2_1.hdr"; // if not defined takes automatically the hdr in the static folder  and in prod https://media.BRAND.com/utilities/WebEFX/RTR/hdr/panorama_2_1.hdr 
        
        this.init()
       
    }    
    async init (){
        
        await checkData()

        this.RTRViewr = window.rtrViewer;
        console.log(this.options)
        this.RTRViewr.init({
            data:{
                selector: this.selector,
                id: {
                    type: 'upc',
                    value: this.upc
                },
                environmentPath: this.hdr
            }
        })
        // customLog('started')   

        // await checkStore();
        
        // this.rawJson = await checkData();

        // Lazy();
        
        // this.json = clearData(this.rawJson)

        // this.Contents = new Contents()

    }
    
}

// new RTR({
//     data: {
//         selector: '#ct_cm__RTR__viewer',
//         id: {
//             type: 'upc',
//             value: "8056597918824"
//         },
//     // backgroundPath: '#000',
      
//         settings: {
//             showEnvironment: false,
//             showBackground: false,
//             clearColor:'#000',
//             orbitPoint: false,
            
//             autoRotateCamera: false,
            
//             pixelRatio: window.devicePixelRatio,
//             autoResetCamera: false, // <----- QUESTO DISABILITA IL RESET DELLA CAMERA AL LOADING
//             cameraRotationInitial: { // <----- QUESTO IMPOSTA LA ROTAZIONE INIZIALE DELLA CAMERA (IN GRADI)
//                 phi: 0, // rage [-90, 90]
//                 theta: 0, // range [-180 - 180]
//             },
//             cameraRotationReset: { // <----- QUESTO LA TARGET ROTATION (IN GRADI)
//                 phi: 20,
//                 theta: 40,
//             },
//             gestures: {
//                 mouse: {
//                     left: 'rotate',
//                     middle: 'none',
//                     right: 'none',
//                     wheel: 'none',
//                 },
//                 touches: {
//                     one: 'rotate',
//                     two: 'rotate',
//                     three: 'dolly-pan',
//                 },
//             },
//         }
//     },
//     metadata: {
//         env: 'production',
//     },
//     callbacks: {
//         onRendered: () => {
            
//         },
//         onActions:({actions})=> {
//             console.log(actions)
//         },
//         onFocus:({focus})=>{
//             console.log(focus)
//         },
//         onError: ({ code, context, error }) =>  {
//             console.log('Error code:', code);
//             console.log('Error context:', context);
//             console.error(error);
//         },
//     }
// });



   
