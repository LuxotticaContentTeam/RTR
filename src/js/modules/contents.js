import Nav from "./nav";
import { ProductList, getProdInfo } from "./products";
import { Text } from "./text";
import {Video, VideoControls } from "./video"




class Contents{
    constructor(){
        this.container = document.querySelector('#ct_cm__smv2');
        this.videos = [];
        this.texts = [];
        this.prodLists = [];
        
        this.VideoControls = new VideoControls();
        this.firstActive = true;
        this.videoLoaded = false;

        this.stateManger = ct_SMV2.StateManager;
        this.json = ct_SMV2.json;

        this.build();
        this.setActive();
        this.autoUpdate();
        
    }
    build(){
        this.buildNav();
        this.buildVideos();
        this.buildTexts();
        this.buildProducts();
       
    }
    buildNav(){
        this.Nav = new Nav();
    }
    buildVideos(){
        let currentVideo;
        this.json.forEach((story,i)=>{
            currentVideo =  new Video(story.video.d,story.video.dCover,story.video.m,story.video.mCover,i)
            this.videos.push(currentVideo)
            this.container.querySelector('#ct_cm__videos__container').appendChild(  currentVideo.html())
        })    
        this.container.appendChild(this.VideoControls.html());
        this.stateManger.videoActive = this.videos[0];
        this.stateManger.activeIndex = 0;

        this.eventsHandler();
        
    }
    buildTexts(){
        let currentText
        this.json.forEach((story,i)=>{
            currentText =  new Text(story.text.icon,story.text.title,story.text.subtitle,story.text.cta,i,story.variant)
            this.texts.push(currentText)
            this.container.querySelector('#ct_cm__texts__container').appendChild(  currentText.html())
        })    
          
    }
    buildProducts(){
        let currentProdList
        this.json.forEach((story,i)=>{
            currentProdList =  new ProductList(story.products,i,story.variant)
            this.prodLists.push(currentProdList)
            this.container.querySelector('#ct_cm__products__container').appendChild(  currentProdList.html())
        })
        this.stateManger.prodListActive = this.prodLists[0];
        if (this.stateManger.device != 'desk') {
            this.prodOverlay = document.createElement('div');
            this.prodOverlay.id = 'ct_cm__prodOverlay';
            this.prodOverlay.onclick = ()=>{ this.stateManger.prodListActive.toggleOpen()}
            this.container.appendChild(this.prodOverlay);

            this.buttonToggleOpen =  document.createElement('button');
            this.buttonToggleOpen.id = "ct_cm__prodToggleOpen";
            this.buttonToggleOpen.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" width="26" height="26">
                    <use id="smv2_play_icon" xlink:href="#smv2_arrow"></use>
                </svg>
            `
            this.buttonToggleOpen.onclick = () =>{ this.stateManger.prodListActive.toggleOpen()}
            this.container.querySelector('#ct_cm__products__container').appendChild(this.buttonToggleOpen);
        }
    }

    setActive (index = 0,prevIndex=null,prev=false) {

        //Anchor
        if(document.querySelector('#ct_cm__anchors .active')) { 
            if (this.stateManger.device != 'desk' && !prev) document.querySelector('#ct_cm__anchors .active').classList.add('ct_cm__completed')
            document.querySelector('#ct_cm__anchors .active').classList.remove('active');
        }
        document.querySelector(`#ct_cm__anchors li[data-anchor="${index}"]`).classList.add('active')
        if (this.stateManger.device != 'desk') {
            if (index === 0){
                document.querySelectorAll(`#ct_cm__anchors li.ct_cm__completed`).forEach(anchor=>anchor.classList.remove('ct_cm__completed'))
            }else{
                document.querySelector(`#ct_cm__anchors li[data-anchor="${index}"]`).classList.remove('ct_cm__completed')
            }
        }
        
        //Videos
        if(document.querySelector('#ct_cm__videos__container .active'))  document.querySelector('#ct_cm__videos__container .active').classList.remove('active');
        document.querySelector(`#ct_cm__videos__container video[data-index="${index}"]`).classList.add('active');
        if(!this.firstActive){
            this.stateManger.videoActive.play();
            if (this.VideoControls.muted !=  this.stateManger.videoActive.muted){
                if (this.VideoControls.muted){
                    this.stateManger.videoActive.mute()
                }else{
                    this.stateManger.videoActive.unmute()
                }
            }
           
        }else{
            this.firstActive = false;
        }

        //Text
        if( this.texts[prevIndex]){
            this.texts[prevIndex].setUnActive();
        }
        this.texts[index].setActive()
        
        if(document.querySelector('#ct_cm__texts__container .active'))  document.querySelector('#ct_cm__texts__container .active').classList.remove('active');
        document.querySelector(`#ct_cm__texts__container .ct_cm__text__container[data-index="${index}"]`).classList.add('active');
        
        //Products
        if( this.prodLists[prevIndex]){
            this.prodLists[prevIndex].setUnActive();
        }
        this.prodLists[index].setActive()

        if (this.stateManger.device != 'desk') {
            if (this.stateManger.prodListActive.prodCards.length === 0){
                this.buttonToggleOpen.style.display = 'none'
            }else{
                this.buttonToggleOpen.style.display = 'block'
            }
            
            
        }
        
    }
    update(index,prevIndex,prev=false){
        // console.log(`update to content ${index}`)
        let prevVideo = this.stateManger.videoActive;
        prevVideo.pause()
        this.stateManger.videoActive = this.videos[index];
        this.stateManger.activeIndex = index;
        this.stateManger.prodListActive = this.prodLists[index]
        this.setActive(index,prevIndex,prev)
        prevVideo.reset()
    }
    autoUpdate(){
        window.addEventListener('ct_cm__ended',()=>{
            let newIndex = this.stateManger.activeIndex == this.videos.length - 1 ? 0 : this.stateManger.activeIndex + 1
            this.checkAutoUpdate(newIndex,this.stateManger.activeIndex)
        })
    }
    eventsHandler(){
        window.addEventListener('ct_cm__load_poster',()=>{
            this.videos.forEach(video=>video.posterLoad())
        },{ once: true })
        window.addEventListener('ct_cm__load_prod',async ()=>{
            await getProdInfo()
            this.prodLists.forEach(prodList=>prodList.load())
        },{ once: true })
        window.addEventListener('ct_cm__load_video',()=>{
            this.videos[0].load();
        },{ once: true })
        window.addEventListener('ct_cm__canplaythrough',(e)=>{
            if (e.detail == 0){
                this.videos[0].play();
                if(!this.videoLoaded){
                    this.videoLoaded = true;
                    this.videos.forEach(video=>video.load())
                }
            }
        })
        window.addEventListener('ct_cm__out_viewport',()=>{
            this.stateManger.videoActive.pause()
        })
        window.addEventListener('ct_cm__in_viewport',()=>{
            if (!this.VideoControls.manualPause){
                this.stateManger.videoActive.play()
            }
        })
        window.addEventListener('ct_cm__next',()=>{
            let newIndex = this.stateManger.activeIndex == this.videos.length - 1 ? 0 : this.stateManger.activeIndex + 1
            this.update(newIndex,this.stateManger.activeIndex)
        })
        window.addEventListener('ct_cm__prev',()=>{
            if(this.stateManger.activeIndex != 0){
                let newIndex = this.stateManger.activeIndex - 1;
                this.update(newIndex,this.stateManger.activeIndex,true);
            }
        })
    }
    checkAutoUpdate(newIndex,prevIndex){ //to fix
        if (!this.stateManger.prodListActive.hovered){
            this.update(newIndex,prevIndex)
        }else{
            setTimeout(()=>{
                this.checkAutoUpdate(newIndex,prevIndex)
            },2000)
        }
    }
}
export default Contents;