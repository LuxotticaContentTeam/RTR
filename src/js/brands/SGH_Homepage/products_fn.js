// https://www.sunglasshut.com/wcs/resources/plp/10152/byPartNumbers/888392279743,888392279729,888392425638,888392253026,888392013767,888392486660,700285953625,888392253040,888392260550,888392465412,888392459664,888392424464,888392424457,888392351265,8053672611663,8053672611717,8056597598255,8056597672375,8053672689686,8053672611700,8056597493024,725125374408,725125378574,8056597555180
export  function getInfoProducts_local() {
    return new Promise((resolve, reject) => {
        setTimeout(
            ()=>{
                
                window.ct_SMV2_config.products_data={
                    "8056597792448":{
                        index : "1",
                        promotionalFlag : "1",
                        listPrice : "$ 125",
                        classPromotion: "",
                        offerPrice: "$ 89",
                        modelname: "Product",
                        moco: "",
                        pdpURL: '/8056597792448',
                        productImage: `${window.ct_SMV2_config.imagePath}8056597792448__STD__shad__qt.png?impolicy=SGH_bgtransparent`,
                        productImageHover: `${window.ct_SMV2_config.imagePath}8056597792448__STD__shad__qt.png?impolicy=SGH_bgtransparent`,
                        alt: "Product",
                        labelShop :'',
                    },
                    "8056597656559":{
                        index : "1",
                        promotionalFlag : "0",
                        listPrice : "$ 125",
                        classPromotion: "",
                        offerPrice: "$ 89",
                        modelname: "Product",
                        moco: "",
                        pdpURL: '/8056597656559',
                        productImage: `${window.ct_SMV2_config.imagePath}8056597656559__STD__shad__qt.png?impolicy=SGH_bgtransparent`,
                        productImageHover: `${window.ct_SMV2_config.imagePath}8056597656559__STD__shad__qt.png?impolicy=SGH_bgtransparent`,
                        alt: "Product",
                        labelShop : '',
                    }
                }
                resolve()
            },1000 )
    })
   
}
 
export async function getInfoProductsByServiceCall(storeID, mocos) {

    let  url = window.ct_SMV2_config.productsService;
    
    let mocos_carousel = mocos.join(',');
    let url_service;
    url = url.replace('{{storeID}}', storeID).replace('{{listProducts}}', mocos_carousel);
    url_service = window.location.origin + url;
    const response = await fetch(url_service);
    const json = await response.json();
    return json;
}

export function getInfoProducts(mocos) {
    return new Promise((resolve, reject) => {
        let productsInfo = getInfoProductsByServiceCall(window.ct_SMV2_config.store.storeId, mocos);
        productsInfo.then(data => {
            if(data.plpView.products.products.product.length === 0){
                resolve('No prod')
            }else{
                data.plpView.products.products.product.forEach((prod, index)=> {
                    let listPrice, classPromotion, offerPrice, labelShop;
        
                    // if(ct_data.ecomm == "true") {
                        listPrice = prod.listPrice == "0" ?  "" : `${prod.listPrice}`;
                        classPromotion = prod.offerPrice == undefined ? "ct_sm-hidden" : "";
                        offerPrice = prod.offerPrice == undefined ? '' : `${prod.offerPrice}`;
                    // } else {
                    //     listPrice = "";
                    //     classPromotion = "ct_sm-hidden";
                    //     offerPrice = "";
                    //     labelShop = this.defaultLabel["View"][this.except_lang] ? this.defaultLabel["View"][this.except_lang] : (this.defaultLabel["View"][this.lang] ? this.defaultLabel["View"][this.lang] : this.defaultLabel["View"]["en"]);
                    // }
                    
                    window.ct_SMV2_config.products_data[prod.partNumber] = {
                        index : index,
                        promotionalFlag : prod.offerPrice == undefined ? "0" : "1",
                        listPrice : listPrice,
                        classPromotion:  classPromotion,
                        offerPrice: offerPrice,
                        modelname: prod.brand,
                        moco: prod.partNumber,
                        pdpURL: prod.pdpURL,
                        productImage: `${window.ct_SMV2_config.imagePath}${prod.partNumber}__STD__shad__fr.png?impolicy=SGH_bgtransparent&width=240`,
                        productImageHover: `${window.ct_SMV2_config.imagePath}${prod.partNumber}__STD__shad__qt.png?impolicy=SGH_bgtransparent&width=240`,
                        alt: prod.modelName,
                    }
        
                   
                })
                resolve('Prod Loaded')
            }
           
        });

    });
}