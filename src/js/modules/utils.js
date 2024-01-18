// import { ct_sm__active_slide } from '../config_modules/slick_utils';




// check if mobile
export function ct_is__mobile() {
    
    if (window.innerWidth > window.ct_SMV2_config.breakpoints.mob_max){
        return false;
    }else {
        return true;
    }
}

// detect desk tab mob device dimensions
export function getDeviceType(){
    if (window.innerWidth > window.ct_SMV2_config.breakpoints.tab_max){
        return 'desk';
    }
    if (window.innerWidth > window.ct_SMV2_config.breakpoints.mob_max && window.innerWidth < window.ct_SMV2_config.breakpoints.desk_min){
        return 'tab'
    }
    if(window.innerWidth < window.ct_SMV2_config.breakpoints.tab_min){
        return 'mob'
    }
}

//check if element is in viewport
export function ct_in_viewport(this_){
    var elementTop = $(this_).offset().top;
  
    var elementBottom = elementTop + $(this_).outerHeight();
  
    var viewportTop = $(window).scrollTop();
   
    var viewportBottom = viewportTop + $(window).height();
   

    // return elementBottom > viewportTop && elementTop < viewportBottom;
    if(ct_is__mobile()){
        return elementBottom > viewportTop && elementTop < viewportBottom && ((elementBottom - viewportTop) > $(this_).outerHeight()*.5 ) &&  ((viewportBottom - elementTop) > $(this_).outerHeight()*.2 );
    }else{
        return elementBottom > viewportTop && elementTop < viewportBottom && ((elementBottom - viewportTop) > $(this_).outerHeight()*.5 ) &&  ((viewportBottom - elementTop) > $(this_).outerHeight()*.5 );
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
        console.log('%c '+ '[SMV2]  ' + log,`background: red;padding:2px 6px; border-radius:8px; color:#fff;font-family:sans-serif;font-size:14px; ${style};`)
      }
      if(type=="wait"){
         console.log('%c '+ '[SMV2]  ' + log,`background: #ceb000;padding:2px 4px; border-radius:4px; color:#000;font-family:sans-serif;font-size:14px; ${style};`)
      }
      if(type==''){
        console.log('%c '+ '[SMV2]  ' + log,`background: #650601;padding:4px 8px; border-radius:6px; color:#fff;font-family:sans-serif;font-size:14px; ${style};`)
    
      }
    // }
  }


export function ct_sm__checkCountryNameUrl(url){
    let normalizedUrl = ''
    if (!window.ct_SMV2_config.store.countryName || url.includes(window.ct_SMV2_config.store.countryName) ){
        if (url[0] === "/"){
            normalizedUrl = url
        }else{
            normalizedUrl = `/${url}`
        }
        return normalizedUrl
    }
    
    if (!url.includes(window.ct_SMV2_config.store.countryName)){
        if (url[0] === "/"){
            normalizedUrl = `/${window.ct_SMV2_config.store.countryName}${url}`
        }else{
            normalizedUrl = `/${window.ct_SMV2_config.store.countryName}/${url}`
        }
    }
    return normalizedUrl
   
}

/**
 * 
 * @param {String} name - Event Name
 * @param {Function} cb - CallBack
 * @returns Run Callback
 */
export const eventCatcher = (name,cb) => [
    window.addEventListener(name,(e)=>{
        cb(e.detail);
    })
]

export const eventDispatch = (event,detail=undefined)=> {
    let eventToDispatch = new CustomEvent(event,{detail:detail})
    window.dispatchEvent(eventToDispatch)
}

export const getTrad = (field) => {
    let country = ct_SMV2_config.store.country;
    let lang = ct_SMV2_config.store.lang
    
    if (typeof field === 'string') return field
    
    let keys = Object.keys(field);
    if (keys.includes(country)) return field[country];
    if (keys.includes(lang)) return field[lang];
    if (keys.includes('en-us')) return field['en-us'];
    if (keys.includes('en')) return field['en'];
    
    return field[0]
}