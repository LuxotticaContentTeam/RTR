import RTR from "../../main";
import { eventCatcher, getTrad, loadScript } from "../../modules/utils";

export class Contents{
    constructor(stateManger){
        this.RTR = null;
        this.json = window.ct_RTRBannerHome.json;
        this.stateManger = stateManger;
        this.fistRender = false;
        
        this.init();
        
       
    }
    init(){
        this.buildHtml();
        this.load();
        this.eventHandler();
        
       
    }
    buildHtml(){
        this.container = document.querySelector('#ct_cm_RTR__container .ct_cm__contents');

        this.buildSkeletonAndStaticText();
        this.buildDynamicContent();
        
    }
    buildSkeletonAndStaticText(){
        this.container.querySelector('.ct_cm__text').innerHTML = `
            <h3 class="ct_cm_RTR__headline">${getTrad(this.json.labels.headline,this.stateManger.infoStore)}</h3>
            <div class="ct_cm_RTR__buttons"></div>
            <div class="ct_cm_RTR__titles"></div>
            <div class="ct_cm_RTR__cta">
                <a data-element-id="X_X_MainPlacement12_RTR-CTA0" aria-label="${getTrad(this.json.labels.shop_now,this.stateManger.infoStore)}">${getTrad(this.json.labels.shop_now,this.stateManger.infoStore)}</a>
            </div>
            <div class="ct_cm_RTR__bottom_text"> ${getTrad(this.json.labels.bottom_text,this.stateManger.infoStore)}</div>
        `;
        this.container.querySelector('.ct_cm_RTR__viewer').innerHTML = `
            <div class="ct_cm_RTR__viewer_text">
                <span>${getTrad(this.json.labels.rotate,this.stateManger.infoStore)}</span>
                <img src="https://media.sunglasshut.com/2023/utility/WOW/rtr/459.svg">
            </div>
            <p id="ct_cm_RTR__viewer_cursor">
                ${getTrad(this.json.labels.cursor,this.stateManger.infoStore)}
            </p>
        `;
        this.cursor = this.container.querySelector(`#ct_cm_RTR__viewer_cursor`)
    }
    buildDynamicContent(){
        this.buttonsContainerHtml = this.container.querySelector('.ct_cm_RTR__buttons');
        this.titlesContainerHtml = this.container.querySelector('.ct_cm_RTR__titles');
        this.ctaHtml = this.container.querySelector('.ct_cm_RTR__cta a');
        Object.keys(this.json.products).forEach((key,i)=>{
            let button = document.createElement('button');
            button.classList.add('ct_cm_RTR__product')
            button.dataset.upc = key;
            button.dataset.elementId = "X_X_MainPlacement12_RTR";
            button.dataset.description = this.json.products[key].name;
            button.ariaLabel = `Select ${this.json.products[key].name}`;
            button.innerHTML = `
                <img src="${this.json.products[key].img}" alt="${this.json.products[key].name}"/>
            `
            button.onclick = ()=>{this.updateProd(button)};
            this.buttonsContainerHtml.appendChild(button)
            if (i === 0){
                button.classList.add('active');
                this.titlesContainerHtml.innerHTML = `
                    <div class="ct_cm_RTR__title active" data-upc="${key}">
                        <span>${this.json.products[key].brand}</span>
                        <h2>${this.json.products[key].name}</h2>
                    </div>
                `
                this.ctaHtml.href = getTrad(this.json.products[key].url,this.stateManger.infoStore);
                this.ctaHtml.dataset.descirption = key
            }
        })
    }
    load(){
        eventCatcher('ct_cm_rtr__loadData',()=>{
            this.RTR = new RTR({
                selector:'.ct_cm_RTR__viewer',
                version:"5.1.2",
                upc: Object.keys(this.json.products)[0],
                zoom: true,
                showBackground:true,
                clearColor:'#D9CDC4',
                backgroundPath: this.stateManger.device ==='desk' ? '@utilitiesPath@@rtrImgPath@/RTRimages/SGH/bkg_rtr_full.jpg':'@utilitiesPath@@rtrImgPath@/RTRimages/SGH/bkg_rtr_full_m.jpg', //dev
                // backgroundPath:'@utilitiesPath@@imagePath@images/SGH/bkg_rtr.jpg' //prod
                boundingAreaTopLeftX:this.stateManger.device ==='desk' ? .5 : 0,
                boundingAreaTopLeftY:this.stateManger.device === 'desk' ? 0 : this.stateManger.device ==='tab' ? .4 : .5
            })
        },true)

        eventCatcher('ct_cm_rtr__loadModel',()=>{
            this.RTR.init();
        },true);
    }
    eventHandler(){
     
        eventCatcher('ct_cm__RTR_rendered',({id})=>{
            if (!this.fistRender){ 
                this.fistRender = true;
                this.container.querySelector('.ct_cm_RTR__viewer').addEventListener('mousemove',e=>{
                    this.cursor.style.top = `${e.pageY - 8}px`
                    this.cursor.style.left = `${e.pageX + 16}px`
                })
            }
            if(id === this.RTR.selector) document.querySelector('.ct_cm__loader').classList.add('ct_cm__loaded')
        })
    }
    updateProd(button){
        if (!button.classList.contains('active')){
            if( this.buttonsContainerHtml.querySelector('.active')){
                this.buttonsContainerHtml.querySelector('.active').classList.remove('active')
            }
            button.classList.add('active');
            
            this.titlesContainerHtml.querySelector('span').innerHTML = this.json.products[button.dataset.upc].brand;
            this.titlesContainerHtml.querySelector('h2').innerHTML = this.json.products[button.dataset.upc].name;
            this.ctaHtml.dataset.descirption = button.dataset.upc;
            this.ctaHtml.href = getTrad(this.json.products[button.dataset.upc].url,this.stateManger.infoStore);

            this.RTR.RTRViewr.setId({type:'upc',value: button.dataset.upc});
            document.querySelector('.ct_cm__loader').classList.remove('ct_cm__loaded')

        }
        
    }
}