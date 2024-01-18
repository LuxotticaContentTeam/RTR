import { getDeviceType, getTrad } from "./utils";

class Text {
    constructor(icon,title,subtitle,cta,index,variant='default'){
        this.index = index;
        this.icon = icon;
        this.title = title;
        this.subtitle = subtitle;
        this.cta = cta;
        this.variant = variant
    }
    html(){
        this.textHtml = document.createElement('div');
        this.textHtml.dataset.index = this.index;
        this.textHtml.classList.add('ct_cm__text__container')
        this.buildVariant();
        
        return this.textHtml
    }
    buildVariant(){
        if (this.variant === 'default'){
            this.textHtml.classList.add('ct_cm__text__default')
            this.textHtml.innerHTML = variants.default({
                icon: getTrad(this.icon),
                title:getTrad(this.title),
                subtitle:getTrad(this.subtitle),
                cta:{label:getTrad(this.cta.label),link:getTrad(this.cta.link)},
                index:this.index,
            })
        }
        if (this.variant === 'default_center'){
            this.textHtml.classList.add(...['ct_cm__text__default','ct_cm__text__center'])
            this.textHtml.innerHTML = variants.default({
                icon:getTrad(this.icon),
                title:getTrad(this.title),
                subtitle:getTrad(this.subtitle),
                cta:{label:getTrad(this.cta.label),link:getTrad(this.cta.link)},
                index:this.index,
            })
        }
    }
    setActive(){
        this.textHtml.classList.add('active');
        if (this.textHtml.querySelector('a')){
            this.textHtml.querySelector('a').tabIndex = 0;
        }
    }
    setUnActive(){
        this.textHtml.classList.remove('active');
        if (this.textHtml.querySelector('a')){
            this.textHtml.querySelector('a').tabIndex = -1;
        }
    }
}

const variants = {
    default:(data)=> {
        return(
            `
                <div class="ct_cm__icon">${data.icon}</div>
                <h2 class="ct_cm__title">${data.title}</h2>
                <p class="ct_cm__subtitle">${data.subtitle}</p>
                <a tabindex="-1" class="ct_cm__cta" href="${data.cta.link}" aria-label="${data.cta.label}" data-element-id="X_SMV2_Story${data.index}_CTA" data-description="${data.cta.label}">${data.cta.label}</a>
            `
        )
    } 
}


export {Text};
