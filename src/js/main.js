
// import {ct_log, ct_get__device_type, eventCatcher} from './modules/utils';

import { checkData, customLog, eventCatcher, eventDispatch, getClosestPoint, loadScript } from "./modules/utils";

    /**
 * Real Time Render (RTR) class for rendering 3D environments in real time.
 *
 * @class
 * @classdesc This class provides functionality for real-time rendering with customizable settings.
 * @exports RTR
 * @default
 */
export default class RTR {
    /**
     * @constructor
     * @param {Object} options - Configuration options for the RTR instance.
     * @param {string} options.version - Version of the RTR library.
     * @param {string} options.selector - Selector for the HTML element where the RTR will be rendered.
     * @param {string} options.upc - UPC (Universal Product Code) associated with the 3D model.
     * @param {boolean} options.zoom - Enable zoom functionality.
     * @param {string} options.hdr - Path to the HDR environment map.
     * @param {string} options.env - Environment setting, default is 'production'.
     * @param {boolean} options.autoRotateCamera - Enable auto-rotation of the camera.
     * @param {boolean} options.showBackground - Show the background.
     * @param {string} options.backgroundPath - Path to the custom background.
     * @param {string} options.clearColor - Color used to clear the background.
     * @param {boolean} options.showEnvironment - Show the environment.
     * @param {number} options.boundingAreaTopLeftX - X-coordinate of the top-left corner of the bounding area.
     * @param {number} options.boundingAreaTopLeftY - Y-coordinate of the top-left corner of the bounding area.
     * @param {number} options.boundingAreaBottomRightX - X-coordinate of the bottom-right corner of the bounding area.
     * @param {number} options.boundingAreaBottomRightY - Y-coordinate of the bottom-right corner of the bounding area.
     * @param {number} options.minDistance - Minimum distance for the camera.
     * @param {boolean} options.safeAreaEnabled - Enable safe area.
     * @param {string} options.safeAreaWidthLeft - Width of the safe area on the left.
     * @param {string} options.safeAreaWidthRight - Width of the safe area on the right.
     * @param {number[]} options.initialPosition - Initial position of the camera as an array [x, y, z].
     * @param {boolean} options.hotPositionsEnabled - Enable hot positions.
     * @param {number[][]} options.hotPositions - Array of hot positions, each represented as an array [x, y, z].
     */
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

            minDistance,
            
            safeAreaEnabled,
            safeAreaWidthLeft,
            safeAreaWidthRight,

            initialPosition,
            hotPositionsEnabled,
            hotPositions
        }){

        window.ct_RTR = this;
        this.RTRViewr = undefined;
        this.selector = selector;
        this.upc = upc;
        this.hdr = hdr || "@utilitiesPath@@rtrimagePath@/hdr/panorama_2_1.hdr"; // if not defined takes automatically the hdr in the static folder  and in prod https://media.BRAND.com/utilities/WebEFX/RTR/hdr/panorama_2_1.hdr 
        this.metadata = env ? { env } : { env: 'production'};
        this.showEnvironment = showEnvironment ? showEnvironment : false;
        this.autoRotateCamera = autoRotateCamera ? autoRotateCamera : false;
        this.showBackground = showBackground ? showBackground : false;
        this.clearColor = clearColor ? clearColor : "#fff";
        this.zoom = zoom ? 'dolly' : 'none';
        this.backgroundPath= backgroundPath ? backgroundPath : undefined;
        this.boundingAreaTopLeftX = boundingAreaTopLeftX ? boundingAreaTopLeftX : 0,
        this.boundingAreaTopLeftY = boundingAreaTopLeftY ? boundingAreaTopLeftY : 0,
        this.boundingAreaBottomRightX = boundingAreaBottomRightX ? boundingAreaBottomRightX : 1,
        this.boundingAreaBottomRightY = boundingAreaBottomRightY ? boundingAreaBottomRightY : 1,

        this.safeAreaEnabled = safeAreaEnabled ? true : false,
        this.safeAreaWidthLeft = safeAreaWidthLeft ? safeAreaWidthLeft : "15%"
        this.safeAreaWidthRight = safeAreaWidthRight ? safeAreaWidthRight : "15%"
        
        this.minDistance = minDistance ? minDistance : false

        this.initialPosition = initialPosition ? initialPosition : false
        this.hotPositionsEnabled = hotPositionsEnabled ? true : false
        this.hotPositions = hotPositions ? hotPositions : []
        
        this.isRotating = false;
        this.isReady = false;
        this.isFirsfitRender = true;
        this.camera = undefined;
        
        if (window.rtrViewer){
            this.isReady = true
        }else{
            loadScript(`@rtrPath@/lib/v/${version}/main.js`,()=>{this.isReady = true})
        }
    
    }    
    /**
   * Initialize the RTR instance.
   *
   * @async
   * @function
   * @memberof RTR
   * @throws {Error} Throws an error if data validation fails.
   * @returns {Promise<void>} A promise that resolves when the RTR instance is initialized.
   */
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
                    if ( this.isFirsfitRender){
                        this.isFirsfitRender = false;
                        this.customSettings();
                    }
                    if (this.initialPosition){
                        this.setInitialPosition();
                    }
                },
                onActions:({actions})=> {
                    if (actions.rotate){
                        this.isRotating = true;
                        eventDispatch('ct_cm__RTR_startRotate',{id:this.selector,rotate:actions.rotate})
                    }else{
                        if (this.isRotating){
                            this.isRotating = false; 
                            eventDispatch('ct_cm__RTR_endRotate',{id:this.selector,rotate:actions.rotate})
                        }
                    }
                    eventDispatch('ct_cm__RTR_actions',{id:this.selector,actions})
                },
                onFocus:({focus})=>{
                    eventDispatch('ct_cm__RTR_focus',{id:this.selector,focus})
                    this.isFocus = focus;
                },
                onError: ({ code, context, error }) =>  {
                    console.log('RTR - Error code:', code);
                    console.log('RTR - Error context:', context);
                    console.error(error);
                },
            }
        })

        
    }
     /**
   * Set up the safe area for the RTR instance.
   *
   * @function
   * @memberof RTR
   * @private
   */
    setSafeArea(){
       
        document.querySelector(this.selector).classList.add('ct_cm_RTR__safe_area_enabled');
        this.boundingArea = document.querySelector(`${this.selector} #rtr-bounding-area`)
        let safeAreaLeft = document.createElement('span');
        let safeAreaRight = document.createElement('span');
        safeAreaLeft.style.cssText = `
            position:absolute;
            top:0;
            left:0;
            width:${this.safeAreaWidthLeft};
            height:100%;
            pointer-events:all;

        `
        safeAreaRight.style.cssText = `
            position:absolute;
            top:0;
            right:0;
            width:${this.safeAreaWidthRight};
            height:100%;
            pointer-events:all;

        `
        this.boundingArea.appendChild(safeAreaLeft)
        this.boundingArea.appendChild(safeAreaRight)
            
    }
     /**
   * Apply custom settings to the RTR instance after rendering.
   *
   * @function
   * @memberof RTR
   * @private
   */
    customSettings(){
        this.camera = this.RTRViewr.getCameraControls();
        if (this.safeAreaEnabled){
            this.setSafeArea()
        }
        if (this.minDistance){
            this.camera.minDistance = this.minDistance
        }

        if (this.hotPositionsEnabled){
            this.hotPositionsHandler();
        }
    }
    /**
     * Handle hot positions for the RTR instance.
     *
     * @function
     * @memberof RTR
     * @private
     */
    hotPositionsHandler(){
        if (this.hotPositions.length === 0){
            customLog('no hot position set','','err')
        }else{
            eventCatcher('ct_cm__RTR_startRotate',()=>{
                if(this.rotateTimer)  clearTimeout(this.rotateTimer);
            })
            eventCatcher('ct_cm__RTR_endRotate',()=>{
                this.rotateTimer = setTimeout(this.setHotPosition.bind(this),1000)
            })
        }

    }
     /**
   * Set a hot position for the RTR instance.
   *
   * @function
   * @memberof RTR
   * @private
   */
    setHotPosition(){
        if (!this.isFocus){
            let currentPos = this.camera.getPosition();
            let closestPoint = getClosestPoint([currentPos.x,currentPos.y,currentPos.z],this.hotPositions)
            this.camera.setPosition(closestPoint[0],closestPoint[1],closestPoint[2],true);
        }
    }
    /**
     * Set the initial position for the RTR instance.
     *
     * @function
     * @memberof RTR
     * @private
     */
    setInitialPosition(){
        this.camera.setPosition(...this.initialPosition,true)
    }
    /**
     * Set the position for the RTR instance.
     *
     * @function
     * @memberof RTR
     * @param {number[]} position - The new position to set [x, y, z].
     * @returns {void}
     */
    setPosition(position){
        this.camera.setPosition(...position,true)
    }
    /**
     * Update the UPC (Universal Product Code) associated with the RTR instance.
     *
     * @function
     * @memberof RTR
     * @param {string} upc - The new UPC value to be set.
     * @returns {void}
     */
    updateUpc(upc){
        this.RTRViewr.setId({
            type: 'upc',
            value: upc
        })
    }
}
