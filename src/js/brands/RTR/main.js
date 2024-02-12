import RTR from "../../main"

document.addEventListener('DOMContentLoaded',()=>{
    new RTR({
        selector:'#ct_cm_RTR__container',
        version:"5.1.2",
        upc: "8056597988377",
        zoom: true,
        showBackground:false,
        showEnvironment:false,
        clearColor:'#000',
        minDistance: .4,
        hotPositionsEnabled:true,
        hotPositions:[ 
            [0.00,0.00,.5], //front
            [.5,0.00,0.00], //side left
            [-.5,0.00,0.00], //side right
            [0.30,-.2,.4], //front 3/4
            // [-.32,-.34,.6]
        ],
        initialPosition:[0.30,-.2,.4]
    }).init()
})

