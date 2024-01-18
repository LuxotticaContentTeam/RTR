import { getTrad } from "./utils";

class Anchor {
    constructor(label,index){
        this.label = label;
        this.index = index;
        this.stateManger = ct_SMV2.StateManager;

        this.anchorHtml = null
    }
    html(){
        let anchor = document.createElement("li");
            anchor.dataset.anchor=this.index;
        let button = document.createElement("button")
            button.classList.add("ct_cm__anchor");
         
            button.ariaLabel=this.label;
            button.innerHTML=this.label;
            button.onclick= ()=>{this.handleClick()};
        let progress_container = document.createElement("span")
            progress_container.classList = 'ct_cm__progress__container'
        let progress = document.createElement("span")
            progress.classList = 'ct_cm__progress'
        
        anchor.appendChild(button);
        progress_container.appendChild(progress);
        anchor.appendChild(progress_container);
        this.anchorHtml = anchor;

        return anchor
    }
    handleClick(){
        if (!this.anchorHtml.classList.contains('active')){
            window.ct_SMV2.Contents.update(this.index,this.stateManger.activeIndex)
        }
    }
   
}

class Nav { 
    constructor(){
        this.container = document.querySelector('#ct_cm__anchors');
        this.event="NavBuilt";
        
        this.json = ct_SMV2.json;

        this.build();
        
    }
    html(){
        return document.createElement('ul');
    }
    build(){
        let navHtml = this.html()
        this.json.forEach((story,i)=>{
            navHtml.appendChild( new Anchor(getTrad(story.anchor),i).html())
        })
        this.anchors = navHtml
        this.container.append(navHtml);
       
        
    }
}


export default Nav;

