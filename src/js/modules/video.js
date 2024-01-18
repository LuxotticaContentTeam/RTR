import { eventDispatch, getDeviceType } from "./utils";

class Video {
    constructor(srcDesk,posterDesk,srcMob,posterMob,index){
        this.srcDesk = srcDesk;
        this.srcMob = srcMob ? srcMob : srcDesk;
        this.posterDesk = posterDesk;
        this.posterMob = posterMob ? posterMob : posterDesk;
        this.index = index;
        this.event = "videoBuilt"
        this.canplay = false;
        this.muted = true;
        this.stalled = false;
        this.error = false;
 
    }
    html(){
      
        this.videoHtml = document.createElement('video');
        this.videoHtml.preload = 'metadata'
        this.videoHtml.dataset.index = this.index;
        this.videoHtml.dataset.src = getDeviceType() === 'desk' ? this.srcDesk : this.srcMob
        this.videoHtml.dataset.poster = getDeviceType() === 'desk' ? this.posterDesk : this.posterMob
        this.videoHtml.muted = true;
        this.videoHtml.autoplay = true;
        this.videoHtml.playsInline = true;
            
        // eventDispatch();
        return this.videoHtml
    }
    posterLoad(){
        if (this.videoHtml.poster === ''){
            this.videoHtml.poster = this.videoHtml.dataset.poster
        }
    }
    load(){
        if (this.videoHtml.src === ''){
            this.videoHtml.src = this.videoHtml.dataset.src
            this.videoHtml.oncanplay = ()=>{
                if (!this.canplay){
                    this.pause();
                    this.canplay = true; 
                    this.timeProgress();
                    this.reset()
                }
               
            //     this.reset();
            }; 
            this.videoHtml.addEventListener('canplaythrough',()=> {
                eventDispatch('ct_cm__canplaythrough',this.index)
            },{once:true})
            this.videoHtml.onended = ()=>{
                this.pause();
                eventDispatch('ct_cm__ended')
            //     this.reset();
            }; 

            this.videoHtml.onplaying = () => {
                eventDispatch('ct_cm__play',this.index)
            }
            this.videoHtml.onstalled = () => {
                eventDispatch('ct_cm__pause',this.index);
                this.stalled = true;
            }
            this.videoHtml.addEventListener('error',()=> {
                console.log('video error detected')
                this.error = true;
                eventDispatch('ct_cm__pause',this.index);
            })

        }
    }
    play() {
        if (this.videoHtml.paused){
            try {
                this.videoHtml.play();
                eventDispatch('ct_cm__play',this.index)
            } catch (error) {
                console.log('PLAY FAILED')
            }
        }
    }
    pause() {
        this.videoHtml.pause();
        eventDispatch('ct_cm__pause',this.index)
        
    }
    reset() {
        // console.log('reset')
        if (this.videoHtml.currentTime > 0){
            this.videoHtml.currentTime = 0;
            this.anchorProgress.style.transform = "scaleX(0)";
        }
    }
    mute() {
        // console.log(this.videoHtml.muted)
        if (!this.videoHtml.muted){
            this.videoHtml.muted = true;
            this.muted = true;
            eventDispatch('ct_cm__mute')
        }
    }
    unmute() {
        if (this.videoHtml.muted){
            this.videoHtml.muted = false;
            this.muted = false;
            eventDispatch('ct_cm__unmute')
        }
    }
    timeProgress() {
        this.anchorProgress = document.querySelector(`[data-anchor="${this.index}"] .ct_cm__progress__container > .ct_cm__progress`)
        this.videoHtml.ontimeupdate = ()=> {
            this.anchorProgress.style.transform = `scaleX(${(Math.min ( ( (this.videoHtml.currentTime / this.videoHtml.duration)),1))})` 
           
        }
    }
}

class VideoControls{
    constructor(){
        this.currentVideo = null;
        this.events = this.eventListener();
        
        this.muted = true;
        this.mobControls = getDeviceType() != 'desk' ? this.buildMobControls() : null;

        this.stateManger = ct_SMV2.StateManager;
    }
    html() {
        this.container = document.createElement('div');
        this.container.id = "ct_cm__videos__controls"
        this.playPauseBtnHtml = document.createElement('button');
        this.playPauseBtnHtml.ariaLabel = 'toggle play pause';
        this.playPauseBtnHtml.id = "ct_cm__togglePlay"
        this.playPauseBtnHtml.onclick = ()=>{this.togglePlay()};
        this.playPauseBtnHtml.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" width="26" height="26" fill="none">
                <use id="smv2_play_icon" xlink:href="#smv2_play"></use>
                <use id="smv2_pause_icon" xlink:href="#smv2_pause"></use>
            </svg>
        `    
      
        this.volumeBtnHtml = document.createElement('button');
        this.volumeBtnHtml.ariaLabel = 'toggle volume';
        this.volumeBtnHtml.id = "ct_cm__toggleVolume"
        this.volumeBtnHtml.onclick = ()=>{this.toggleVolume()};
        this.volumeBtnHtml.classList = "ct_cm__muted"
        this.volumeBtnHtml.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" width="26" height="26" fill="none">
                <use id="smv2_volume_on_icon" xlink:href="#smv2_volume_on"></use>
                <use id="smv2_volume_off_icon" xlink:href="#smv2_volume_off"></use>
            </svg>
        `    
        this.container.appendChild(this.playPauseBtnHtml);
        this.container.appendChild(this.volumeBtnHtml);
      
        return this.container
        // eventDispatch();
    }
    togglePlay() {
        if (this.playPauseBtnHtml.classList.contains('ct_cm__playing')){
            this.pause();
        }else{
            this.play();
        
        }
    }
    toggleVolume() {
        if (this.volumeBtnHtml.classList.contains('ct_cm__muted')){
            this.unmute();
        }else{
            this.mute();
        }
    }
    play() {
       
        this.stateManger.manualPause = false;
        if (this.stateManger.videoActive.stalled || this.stateManger.videoActive.error){
            this.stateManger.videoActive.videoHtml.load(); 
        }else{
            this.stateManger.videoActive.play(); 
        }
    }
    pause() {
       
        this.stateManger.manualPause = true;
        this.stateManger.videoActive.pause();
    }
    mute() {
        this.stateManger.videoActive.mute();
    }
    unmute() {
        this.stateManger.videoActive.unmute();
    }
    onPaused() {
        window.addEventListener('ct_cm__pause',(e)=>{
            // console.log('onPaused')
            if(e.detail === this.stateManger.activeIndex){
                this.playPauseBtnHtml.ariaLabel = 'play video';
                // console.log('onPaused')
                this.playPauseBtnHtml.classList.remove('ct_cm__playing')
            }
        })
      
    }
    onPlayed() {
        window.addEventListener('ct_cm__play',(e)=>{
            if(e.detail === this.stateManger.activeIndex){
                // console.log('onPLay')
                this.playPauseBtnHtml.ariaLabel = 'pause video';
                this.playPauseBtnHtml.classList.add('ct_cm__playing');
            }
           
        })
    }
    onMute() {
        window.addEventListener('ct_cm__mute',()=>{
            // console.log('onMuted')
            this.muted = true;
            this.volumeBtnHtml.classList.add('ct_cm__muted');
            this.volumeBtnHtml.ariaLabel = 'turn on video volume';
        })
    }
    onUnmute() {
        window.addEventListener('ct_cm__unmute',()=>{
            // console.log('onunMuted')
            this.muted = false;
            this.volumeBtnHtml.classList.remove('ct_cm__muted');
            this.volumeBtnHtml.ariaLabel = 'turn off video volume';
        })
    }
    eventListener() {
        this.onPlayed();
        this.onPaused();
        this.onUnmute();
        this.onMute();
    }

    buildMobControls() {
        this.nextBtn = document.createElement('button');
        this.nextBtn.id = 'ct_cm__next';
        this.nextBtn.onclick = () =>{ eventDispatch('ct_cm__next')}
        this.prevBtn = document.createElement('button');
        this.prevBtn.id = 'ct_cm__prev';
        this.prevBtn.onclick = () => {eventDispatch('ct_cm__prev')}
        
        document.querySelector('#ct_cm__smv2').appendChild(this.nextBtn);
        document.querySelector('#ct_cm__smv2').appendChild(this.prevBtn);
    }
}

export {Video,VideoControls};


