
// import {ct_log, ct_get__device_type, eventCatcher} from './modules/utils';

import { checkData, eventDispatch, loadScript } from "./modules/utils";

/**
 * @typedef {Object} RTROptions
 * @property {string} selector - The selector of the container element where the viewer will be embedded.
 * @property {string} version - RTR library version
 * @property {string} upc - The UPC (Universal Product Code) associated with the product for real-time rendering visualization.
 * @property {string} zoom - The type of zoom in the real-time rendering viewer. Use 'dolly' for zoom, 'none' for no zoom.
 * @property {string} [hdr="@utilitiesPath@@imagePath@/hdr/panorama_2_1.hdr"] - The path to the HDR environment map for real-time rendering.
 * @property {string} [env='production'] - The environment (e.g., 'development', 'production') for viewer metadata.
 * @property {boolean} [autoRotateCamera=false] - Whether to enable auto rotation of the camera in the real-time rendering viewer.
 * @property {boolean} [showBackground=true] - Whether to show the background in the real-time rendering viewer.
 * @property {string} [backgroundPath] - path of the background
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
            version,
            selector, 
            upc, 
            zoom,
            hdr,
            env,
            autoRotateCamera,
            showBackground,
            backgroundPath,
            clearColor,
            showEnvironment,
            boundingAreaTopLeftX,
            boundingAreaTopLeftY,
            boundingAreaBottomRightX,
            boundingAreaBottomRightY,

            safeArea
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
        this.zoom = zoom ? 'dolly' : 'none';
        this.backgroundPath= backgroundPath ? backgroundPath : '';
        this.boundingAreaTopLeftX = boundingAreaTopLeftX ? boundingAreaTopLeftX : 0,
        this.boundingAreaTopLeftY = boundingAreaTopLeftY ? boundingAreaTopLeftY : 0,
        this.boundingAreaBottomRightX = boundingAreaBottomRightX ? boundingAreaBottomRightX : 1,
        this.boundingAreaBottomRightY = boundingAreaBottomRightY ? boundingAreaBottomRightY : 1,

        this.safeArea = safeArea
        
        this.isRotating = false;
        this.isReady = false;
        
        loadScript(`@rtrPath@/lib/v/${version}/main.js`,()=>{this.isReady = true})
    
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
                backgroundPath: this.backgroundPath,
                settings:{
                    showEnvironment: this.showEnvironment,
                    showBackground: this.showBackground,
                    clearColor:this.clearColor,
                    
                    orbitPoint:false,
                    pixelRatio: Math.min(window.devicePixelRatio, 2),
                    
                    autoRotateCamera: this.autoRotateCamera,

                    //bounding area
                    boundingArea: {
                        topLeft: {
                            x: this.boundingAreaTopLeftX,
                            y: this.boundingAreaTopLeftY,
                        },
                        bottomRight: {
                            x: this.boundingAreaBottomRightX,
                            y: this.boundingAreaBottomRightY,
                        },
                    },

                    // gesture
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
