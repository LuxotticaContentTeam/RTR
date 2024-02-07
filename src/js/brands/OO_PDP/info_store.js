export const infoStoreLocal =()=> {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            let info_store = {
                lang :  document.querySelector('#ct_lang').getAttribute('lang'),
                storeId : "12001",
                currency: "$",
                catalog : "",
                country :  document.querySelector('#ct_lang').getAttribute('country'),
                langID : "-1"
            }
           
            resolve(info_store);
        },1000)
       
    })
}
export const infoStore = ()=> {
    return new Promise((resolve,reject)=>{
        if(window.language && window.country){
            let info_store = {
                lang : window.language,
                storeId : window.storeId,
                catalog : window.catalogId,
                currency: window.currencySymbol,
                country : window.language +  '-' + window.country.toLowerCase(),
                except_lang : currentCountry(),
                langID :  langId
            }
          
            resolve(info_store);
        }
        else{
            setTimeout(()=>{
                info_store().then(resolve).catch(reject);
            },300)
        }
    })
}
