// import { ct_sm__active_slide } from '../config_modules/slick_utils';




// check if mobile
export function isMobile(breakpoints) {
    
    if (window.innerWidth > breakpoints.mob_max){
        return false;
    }else {
        return true;
    }
}

/**
 * Determines the type of device based on the window width and specified breakpoints.
 *
 * @param {Object} breakpoints - Object containing breakpoint values.
 * @param {number} breakpoints.tab_max - Maximum width for tablet devices.
 * @param {number} breakpoints.mob_max - Maximum width for mobile devices.
 * @param {number} breakpoints.desk_min - Minimum width for desktop devices.
 * @param {number} breakpoints.tab_min - Minimum width for tablet devices.
 *
 * @returns {string} - The type of device ('desk' for desktop, 'tab' for tablet, 'mob' for mobile).
 */
export function getDeviceType(breakpoints){
    if (window.innerWidth > breakpoints.tab_max){
        return 'desk';
    }
    if (window.innerWidth > breakpoints.mob_max && window.innerWidth < breakpoints.desk_min){
        return 'tab'
    }
    if(window.innerWidth < breakpoints.tab_min){
        return 'mob'
    }
}


/**
 * Custom log
 * @param {String} log - Main message
 * @param {String} style - Add extra style
 * @param {String} type - "err" for error log, "wait" for wait log
*/
export const customLog = (log,style,type='') =>{
    // if (window.ct_SUPERNOVA.env === 'development' || localStorage.getItem("dev") == "true"){
      if(type=="err") {
        console.log('%c '+ '[RTR]  ' + log,`background: red;padding:2px 6px; border-radius:8px; color:#fff;font-family:sans-serif;font-size:14px; ${style};`)
      }
      if(type=="wait"){
         console.log('%c '+ '[RTR]  ' + log,`background: #ceb000;padding:2px 4px; border-radius:4px; color:#000;font-family:sans-serif;font-size:14px; ${style};`)
      }
      if(type==''){
        console.log('%c '+ '[RTR]  ' + log,`background: #650601;padding:4px 8px; border-radius:6px; color:#fff;font-family:sans-serif;font-size:14px; ${style};`)
    
      }
    // }
  }




/**
 * Registers an event listener for a specified event name and invokes a callback function when the event occurs.
 *
 * @param {string} name - The name of the event to listen for.
 * @param {function} cb - The callback function to be invoked when the event occurs.
 * @param {boolean} [once=false] - A flag indicating whether the event listener should only be invoked once.
 *
 * @typedef {Object} Event
 * @property {any} detail - The detail property of the event object.
 *
 * @example
 * // Example usage:
 * eventCatcher('customEvent', (data) => {
 *   console.log('Event caught with data:', data);
 * }, true); // Registers a one-time event listener
 */
export const eventCatcher = (name,cb,once=false) => {
     /**
     * @type {Event} e - The event object passed to the callback.
     * @property {any} e.detail - The detail property of the event.
     */
    window.addEventListener(name,(e)=>{
        cb(e.detail);
    },{once})
}

/**
 * Dispatches a custom event on the window with an optional detail object.
 *
 * @param {string} event - The name of the custom event to dispatch.
 * @param {any} [detail=undefined] - An optional detail object to include with the event.
 * @returns {void}
 */
export const eventDispatch = (event,detail=undefined)=> {
     /**
     * @typedef {CustomEvent} CustomEvent - A custom event object.
     * @property {any} detail - The detail property of the custom event.
     */

    /**
     * Creates a new custom event with the specified name and detail.
     *
     * @type {CustomEvent}
     */
    let eventToDispatch = new CustomEvent(event,{detail:detail})
    window.dispatchEvent(eventToDispatch)
}
/**
 * Retrieves a translated value based on the provided field, store information,
 * and fallback logic for country and language.
 *
 * @param {string | object} field - The field to be translated. It can be a string or an object with translations.
 * @param {Object} storeInfo - Object containing store information.
 * @param {string} storeInfo.country - The country code for localization.
 * @param {string} storeInfo.lang - The language code for localization.
 *
 * @returns {string} - The translated value based on the provided field and store information,
 *                    with fallbacks for country and language.
 */
export const getTrad = (field,storeInfo) => {
    let country = storeInfo.country;
    let lang = storeInfo.lang
    if (field === undefined || field === '') return ''
    if (typeof field === 'string') return field
    
    let keys = Object.keys(field);
    if (keys.includes(country)) return field[country];
    if (keys.includes(lang)) return field[lang];
    if (keys.includes('en-us')) return field['en-us'];
    if (keys.includes('en')) return field['en'];
    
    return field[0]
}

/**
 * Asynchronous function to check the environment and execute a specific store function.
 *
 * @param {string} env - The environment ('development' or other).
 * @param {Function} infoStoreLocal - The function to execute in the 'development' environment.
 * @param {Function} infoStore - The function to execute in environments other than 'development'.
 * @returns {Promise} A promise that resolves when the appropriate store function is executed.
 */
const checkStore = async (env,infoStoreLocal,infoStore) => {
    return new Promise((resolve,reject)=>{
        if (env === 'development'){
            infoStoreLocal()
            .then((infoStore)=>{resolve(infoStore)});
        }else{
            infoStore()
                .then((infoStore)=>{console.log(infoStore);resolve(infoStore)});
        }
    });
   
}

/**
 * Asynchronous function to fetch and parse JSON data.
 *
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data.
 *
 * @throws {Error} Throws an error if the fetch or JSON parsing fails.
 *
 * @example
 * // Example usage:
 * try {
 *   const jsonData = await getData();
 *   console.log('Fetched JSON data:', jsonData);
 * } catch (error) {
 *   console.error('Error fetching or parsing JSON:', error.message);
 * }
 */
const getData = async () => {
    /**
     * @typedef {Object} Response
     * @property {function} json - A function to parse the response body as JSON.
     */

    /**
     * Represents the JSON data fetched from the specified URL.
     * @typedef {Object} JsonData
     */

    try {
        const response = await fetch(`./json/@currentBrand@/json.json`);

        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        
        const json = await response.json();
        return json;
    } catch (error) {
        throw new Error(`Error fetching or parsing JSON: ${error.message}`);
    }
};

/**
 * Asynchronous function to check data and resolve the promise with the data if available.
 *
 * @param {any} dataToCheck - The data to check.
 * @returns {Promise<any>} A promise that resolves with the checked data.
 *
 * @throws {Error} Throws an error if the data check fails after the specified timeout.
 *
 * @example
 * // Example usage:
 * checkData(someData)
 *   .then((checkedData) => {
 *      console.log('Data is valid:', checkedData);
 *   })
 *   .catch((error) => {
 *      console.error('Error checking data:', error.message);
 *   });
 */
const checkData = () => {
    /**
     * @typedef {Object} Error
     * @property {string} message - The error message.
     */

    return new Promise((resolve, reject) => {
        if (window.rtrViewer) {
            resolve(window.rtrViewer);
        } else {
            /**
             * Asynchronous function to retry the data check after a timeout.
             *
             * @returns {Promise<any>} A promise that resolves with the checked data.
             */
            const retryDataCheck = () => {
                return checkData().then(resolve).catch(reject);
            };

            // Retry data check after a timeout of 300 milliseconds
            setTimeout(retryDataCheck, 300);
        }
    });
};

const clearData = (rawJson,country) => {
    let currentCountry = country
    let finalJson = [];
    rawJson.forEach(elem => {
        if(!elem.countries && !elem.exceptCountries){
            finalJson.push(elem);
        }
        else if ((!elem.countries || elem.countries === 'ALL') && (!elem.exceptCountries || elem.exceptCountries.length == 0 || !elem.exceptCountries.includes(currentCountry) )){
            finalJson.push(elem);
        }
        else if (!!elem.countries && elem.countries.includes(currentCountry)){
            finalJson.push(elem);
        }
       
      
    });
    
    return finalJson;
}

/**
 * Load an external script by dynamically injecting a <script> tag into the DOM.
 *
 * @param {string} src - The source URL of the script to be loaded.
 * @param {function} callback - The callback function to be executed once the script is loaded.
 *
 * @example
 * // Example usage:
 * loadScript('https://example.com/script.js', () => {
 *   console.log('Script loaded successfully');
 *   // Your code to execute after the script is loaded
 * });
 *
 * @throws {Error} Throws an error if the script loading fails.
 */
const loadScript = (src, callback) => {
    /**
     * @typedef {Object} Error
     * @property {string} message - The error message.
     */

    // Create a script element
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    // Attach the script element to the document head
    document.head.appendChild(script);

    // Set up a callback for script load event
    script.onload = () => {
        if(callback) callback();
    };

    // Set up a callback for script error event
    script.onerror = () => {
        document.head.removeChild(script);
        if (callback) callback(new Error(`Failed to load script: ${src}`));
    };

    return callback;
};


/**
 * Finds the closest point to a given position from a list of positions.
 *
 * @param {number[]} currentPos - The current position as an array of three numbers [x, y, z].
 * @param {number[][]} posList - An array of positions, each represented as an array of three numbers [x, y, z].
 * @return {number[]} - The closest point in the posList to the currentPos.
 */
const getClosestPoint=(currentPos,posList) =>{
    let minDist = null;
    let minDistIndex = null;
    let currentDist = 0;
  
    posList.forEach((pos,i)=>{
      currentDist = Math.pow(currentPos[0]-pos[0],2)+ Math.pow(currentPos[1]-pos[1],2)+ Math.pow(currentPos[2]-pos[2],2);
      if (!minDist || currentDist < minDist){
        minDist = currentDist;
        minDistIndex = i;
      }
    })
    return posList[minDistIndex]
  }

export {checkData,checkStore,clearData,getData,loadScript,getClosestPoint}