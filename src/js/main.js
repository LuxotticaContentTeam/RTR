
// import {ct_log, ct_get__device_type, eventCatcher} from './modules/utils';

import { checkData, eventDispatch } from "./modules/utils";

/**
 * @typedef {Object} RTROptions
 * @property {string} selector - The selector of the container element where the viewer will be embedded.
 * @property {string} upc - The UPC (Universal Product Code) associated with the product for real-time rendering visualization.
 * @property {string} zoom - The type of zoom in the real-time rendering viewer. Use 'dolly' for zoom, 'none' for no zoom.
 * @property {string} [hdr="@utilitiesPath@@imagePath@/hdr/panorama_2_1.hdr"] - The path to the HDR environment map for real-time rendering.
 * @property {string} [env='production'] - The environment (e.g., 'development', 'production') for viewer metadata.
 * @property {boolean} [autoRotateCamera=false] - Whether to enable auto rotation of the camera in the real-time rendering viewer.
 * @property {boolean} [showBackground=true] - Whether to show the background in the real-time rendering viewer.
 * @property {string} [clearColor='#fff'] - The clear color of the real-time rendering viewer background.
 * @property {boolean} [showEnvironment=false] - Whether to show the environment in the real-time rendering viewer.
 */

/**
 * Real-Time Rendering (RTR) class for creating an interactive 3D viewer with real-time rendering capabilities.
 *
 * @class
 * @classdesc Real-Time Rendering (RTR) class for creating an interactive 3D viewer with real-time rendering capabilities.
 *
 * @param {RTROptions} options - Configuration options for the RTR viewer.
 *
 * @property {Object} RTRViewr - The RTR viewer object.
 * @property {RTROptions} options - Configuration options for the RTR viewer.
 * @property {string} selector - The selector of the container element where the viewer will be embedded.
 * @property {string} upc - The UPC associated with the product for real-time rendering visualization.
 * @property {string} hdr - The path to the HDR environment map for real-time rendering.
 * @property {Object} metadata - Metadata for the real-time rendering viewer, including the environment.
 * @property {boolean} showEnvironment - Whether to show the environment in the real-time rendering viewer.
 * @property {boolean} autoRotateCamera - Whether to enable auto rotation of the camera in the real-time rendering viewer.
 * @property {boolean} showBackground - Whether to show the background in the real-time rendering viewer.
 * @property {string} clearColor - The clear color of the real-time rendering viewer background.
 * @property {string} zoom - The type of zoom in the real-time rendering viewer ('dolly' or 'none').
 *
 * @throws {Error} Throws an error if initialization fails.
 *
 * @example
 * // Example usage:
 * const rtrOptions = {
 *   selector: '#rtr-container',
 *   upc: '123456789',
 *   zoom: true,
 *   hdr: 'path/to/custom/hdr/file.hdr',
 *   env: 'development',
 *   autoRotateCamera: false,
 *   showBackground: true,
 *   clearColor: '#fff',
 *   showEnvironment: true,
 * };
 *
 * const rtrViewer = new RTR(rtrOptions);
 */
export default class RTR {
    constructor(
        {
            selector, 
            upc, 
            zoom,
            hdr,
            env,
            autoRotateCamera,
            showBackground,
            clearColor,
            showEnvironment
        }){

        window.ct_RTR = this;
        this.RTRViewr = null;
        this.selector = selector;
        this.upc = upc;
        this.hdr = hdr || "@utilitiesPath@@imagePath@/hdr/panorama_2_1.hdr"; // if not defined takes automatically the hdr in the static folder  and in prod https://media.BRAND.com/utilities/WebEFX/RTR/hdr/panorama_2_1.hdr 
        this.metadata = env ? { env } : { env: 'production'};
        this.showEnvironment = showEnvironment ? showEnvironment : false;
        this.autoRotateCamera = autoRotateCamera ? autoRotateCamera : false;
        this.showBackground = showBackground ? showBackground : true;
        this.clearColor = clearColor ? clearColor : "#fff";
        this.zoom = zoom ? 'dolly' : 'none'
        
        this.isRotating = false    

        this.init()
       
    }    
    async init (){
        await checkData()
       

        this.RTRViewr = window.rtrViewer;
        this.RTRViewr.init({
            data:{
                selector: this.selector,
                id: {
                    type: 'upc',
                    value: this.upc
                },
                environmentPath: this.hdr,
                settings:{
                    showEnvironment: this.showEnvironment,
                    orbitPoint:false,
                    autoRotateCamera: this.autoRotateCamera,
                    pixelRatio: Math.min(window.devicePixelRatio, 2),
                    showBackground: this.showBackground,
                    clearColor:this.clearColor,

                    gestures: {
                        mouse: {
                            left: 'rotate',
                            middle: 'none',
                            right: 'pan',
                            wheel: this.zoom,
                        },
                        touches: {
                            one: 'rotate',
                            two: 'dolly-pan',
                            three: 'dolly-pan',
                        },
                    },
                }
            },
            metadata:this.metadata,
            callbacks: {
                onRendered: () => {
                    eventDispatch('ct_cm__RTR_rendered',{id:this.selector})
                },
                onActions:({actions})=> {
                    if (actions.rotate){
                        this.isRotating = true;
                        eventDispatch('ct_cm__RTR_startRotate',{id:this.selector,rotate:actions.rotate})
                    }else{
                        if (this.isRotating){
                            this.isRotating = false; 
                            eventDispatch('ct_cm__RTR_endRotation',{id:this.selector,rotate:actions.rotate})
                        }
                    }
                    eventDispatch('ct_cm__RTR_actions',{id:this.selector,actions})
                },
                onFocus:({focus})=>{
                    eventDispatch('ct_cm__RTR_focus',{id:this.selector,focus})
                },
                onError: ({ code, context, error }) =>  {
                    console.log('RTR - Error code:', code);
                    console.log('RTR - Error context:', context);
                    console.error(error);
                },
            }
        })

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
            
//             
            
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



   
