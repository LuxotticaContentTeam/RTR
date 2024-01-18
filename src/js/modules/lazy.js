import { eventDispatch } from "./utils"

const getIntersect = (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // console.log(entry.intersectionRatio)
            if(entry.intersectionRatio < .6){
                eventDispatch('ct_cm__load_poster');
                eventDispatch('ct_cm__out_viewport');   
            }else{
                eventDispatch('ct_cm__load_video'); 
                eventDispatch('ct_cm__in_viewport');
                eventDispatch('ct_cm__load_prod');
            }
         
        }
    })
}

export const Lazy = (offset=100) => {
    let options = {
        rootMargin: `${offset}px`,
        threshold: [0,.6],
      };
    let observer = new IntersectionObserver(getIntersect, options);
    observer.observe(   document.querySelector('#ct_cm__smv2'))
}