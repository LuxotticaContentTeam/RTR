import { eventDispatch } from "./utils"

const getIntersect = (entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // console.log(entry.intersectionRatio)
            if(entry.intersectionRatio < .6){
                eventDispatch('ct_cm_rtr__loadData');   
            }else{
                eventDispatch('ct_cm_rtr__loadData');   
                eventDispatch('ct_cm_rtr__loadModel');  
            }
         
        }
    })
}

export const Lazy = ({offset=100,selector}) => {
    let options = {
        rootMargin: `${offset}px`,
        threshold: [0,.6],
      };
    let observer = new IntersectionObserver(getIntersect, options);
    observer.observe(   document.querySelector(selector))
}