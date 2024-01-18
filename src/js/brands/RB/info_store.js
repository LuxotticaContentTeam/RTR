export const info_store = ()=> {
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
            window.ct_SMV2_config.store = info_store;
            resolve();
        }
        else{
            setTimeout(()=>{
                info_store().then(resolve).catch(reject);
            },300)
        }
    })
}

export const info_store_local =()=> {
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
            window.ct_SMV2_config.store = info_store;
            resolve();
        },1000)
       
    })
}