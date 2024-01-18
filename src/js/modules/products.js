import { customLog, eventDispatch } from "./utils";

class ProductList {
    constructor(prodsUpc,index,variant){
        this.productsUpc = prodsUpc;
        this.variant = variant;
        this.prodCards = [];
        this.index = index;
        this.hovered = false;

        this.stateManger = ct_SMV2.StateManager;
    }
    html(){
        this.prodListHtml = document.createElement('div');
        this.prodListHtml.dataset.index = this.index;
        this.prodListHtml.classList.add('ct_cm__prods__container');
        this.variant === 'default_center' ? this.prodListHtml.classList.add('ct_cm__prods__center') : undefined;
        let currentProdCard;
        this.productsUpc.forEach((prodUpc,i) => {
            currentProdCard = new Product(prodUpc,i,this.index);
            this.prodCards.push(currentProdCard);
            this.prodListHtml.appendChild(currentProdCard.html())
        });
        this.checkHover();
        if (this.stateManger.device != 'desk') this.toggleOpenHandler()
        return this.prodListHtml
    }
    load(){
        this.prodCards.forEach(prodCard=>{
            if (Object.keys(window.ct_SMV2_config.products_data).includes(prodCard.info.upc) ){
                prodCard.udpateInfo(window.ct_SMV2_config.products_data[prodCard.info.upc])
            }else{
                customLog(`Prod ${prodCard.info.upc} not found`,'','err')
                prodCard.remove()
            }
        })   
    }
   
   
    checkHover(){
        this.prodListHtml.addEventListener('mouseenter',()=>{
            this.hovered = true
            eventDispatch('ct_cm__prodHover',{hovered:true})
           
        })
        this.prodListHtml.addEventListener('mouseleave',()=> {
            this.hovered = false
            eventDispatch('ct_cm__prodHover',{hovered:false})
        })
    }
    toggleOpenHandler(){
        this.prodListHtml.addEventListener('click',e=> {
            this.open();
        })
    }
    toggleOpen(){
        if (!this.prodListHtml.classList.contains('ct_cm__open')){
            this.open();
        }else{
            this.close();
        }
    }
    open(){
        if (!this.prodListHtml.classList.contains('ct_cm__open')){
            document.querySelector('#ct_cm__prodOverlay').classList.add('active');
            document.querySelector('#ct_cm__prodToggleOpen').classList.add('active');
            this.prodListHtml.classList.add('ct_cm__open');

            if (this.stateManger.device === 'mob'){
                document.querySelector('#ct_cm__prodToggleOpen').style.transform = `translate(-50%,-${ (this.prodCards.length - 1) * (this.prodCards[0].prodCardHtml.clientHeight + 8) }px)`
            }else{
                document.querySelector('#ct_cm__prodToggleOpen').style.transform = `translate(-50%,-${ ((this.prodCards.length - 1) * (this.prodCards[0].prodCardHtml.clientHeight + 8))* 1.3 }px)`
            }
            this.prodCards.forEach((prodCard,i)=> {
                prodCard.prodCardHtml.style.transform = `translate(-50%, ${ -115 * (this.prodCards.length - 1 - i) }%)`;
            })
            this.stateManger.videoActive.pause();
        }
    }
    close(){
        this.prodListHtml.classList.remove('ct_cm__open');
        document.querySelector('#ct_cm__prodToggleOpen').classList.remove('active');
        document.querySelector('#ct_cm__prodOverlay').classList.remove('active');
        document.querySelector('#ct_cm__prodToggleOpen').style.transform = `translate(-50%,${0}px)`
        if(!this.stateManger.manualPause){
            this.stateManger.videoActive.play();
        }
    }
    setActive(){
        // if(document.querySelector('#ct_cm__products__container .active'))  document.querySelector('#ct_cm__products__container .active').classList.remove('active');
        this.prodListHtml.classList.add('active');
        this.prodCards.forEach(prod=>{
            prod.setActive();
        })
    }
    setUnActive(){
        this.prodListHtml.classList.remove('active');
        this.prodCards.forEach(prod=>{
            prod.setUnActive();
        })
    }
}

/**
 * @param {string} listPrice - Current Price [Currency] [Value]
 * @param {string} offerPrice - Offer Price [Currency] [Value]
 * @param {string} modelname 
 * @param {string} upc - ProdUpc
 * @param {string} pdpURL - Link PDP
 * @param {string} productImage 
 * @param {string} alt - image alt [Prod UPC]
 */
class Product{
    constructor(upc,prodIndex,storyIndex){
        this.loading = true;
        this.info = {
            listPrice : '',
            promotionalFlag:  '',
            offerPrice: '',
            modelname: '',
            upc: upc,
            pdpURL: '',
            productImage: '',
            alt: upc,
        }
        this.index = prodIndex;
        this.storyIndex = storyIndex
       
       
    }
    html(){
        this.prodCardHtml = document.createElement('a');
        this.prodCardHtml.href = 'javascript:void(0)'
        this.prodCardHtml.classList.add(...['ct_cm__prod__card','ct_cm__loading'])
        this. prodCardHtml.innerHTML = `
            <div class="ct_cm__img__container">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjOHPmzH8ACDADZKt3GNsAAAAASUVORK5CYII=" alt="placeholder"/>
            </div>
            <div class="ct_cm__info">
                <span class="ct_cm__name"></span>
                <span class="ct_cm__price ct_cm__pst">
                    <span class="ct_cm__offer"></span>
                    <span class="ct_cm__list"></span>
                </span>
            </div>
        `
        this.prodCardHtml.tabIndex = -1;
        return this.prodCardHtml
      
       
    }  
    udpateInfo(info){
        Object.keys(info).forEach(key=>{
            this.info[key] = info[key]
        })
        this.prodCardHtml.href = this.info.pdpURL
        this.prodCardHtml.ariaLabel = `shop ${this.info.upc}`
        this.prodCardHtml.dataset.elementId = `X_SMV2_Story${this.storyIndex}_Prod${this.index}`;
        this.prodCardHtml.dataset.description = this.info.upc;
        this.prodCardHtml.innerHTML = `
            <div class="ct_cm__img__container">
                <img src="${this.info.productImage}" alt="prod image ${this.info.upc}"/>
            </div>
            <div class="ct_cm__info">
                <span class="ct_cm__name">${this.info.modelname}</span>
                <span class="ct_cm__price ${this.info.promotionalFlag === '1' ? 'ct_cm__pst' : '' }">
                    <span class="ct_cm__offer">${this.info.offerPrice}</span>
                    <span class="ct_cm__list">${this.info.listPrice}</span>
                </span>
            </div>
        `
      
        this.prodCardHtml.classList.remove('ct_cm__loading')
    }
    remove(){
        this.prodCardHtml.remove()
    }
    setActive(){
        this.prodCardHtml.tabIndex = 0;
    }
    setUnActive(){
        
        this.prodCardHtml.tabIndex = -1;
    }
}

const getProdInfo =  async() => {
    let mocos = getMocos(window.ct_SMV2.json);
    
    if (window.ct_SMV2_config.env === 'development'){
        return window.ct_SMV2_config.products_fn_local();
    }else{
        return window.ct_SMV2_config.products_fn(mocos)
    }
}

const getMocos = (json) => {
    let mocos = new Set()
    json.forEach(story=>{
        story.products.forEach(prod=>{
            mocos.add(prod)
        })
    })
    return [...mocos]
   
}

export {ProductList,Product, getProdInfo};


