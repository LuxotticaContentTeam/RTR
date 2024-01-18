const checkStore = async () => {
    return new Promise((resolve,reject)=>{
        if (window.ct_SMV2_config.env === 'development'){
            window.ct_SMV2_config.store_info_local()
                .then(resolve);
                
            
        }else{
            window.ct_SMV2_config.store_info()
            .then(resolve);
        }
    });
   
}
const checkData = () =>{
    return new Promise((resolve,reject)=>{
        if (window.ct_SMV2_json){
            resolve(window.ct_SMV2_json)
        }else{
            setTimeout(()=>{
                checkData().then(resolve).catch(reject);
            },300)
        }
    });
}

const clearData = (rawJson) => {
    let currentCountry = ct_SMV2_config.store.country;
    let finalJson = [];
    rawJson.forEach(story => {
        if(!story.countries && !story.exceptCountries){
            finalJson.push(story);
        }
        else if ((!story.countries || story.countries === 'ALL') && (!story.exceptCountries || story.exceptCountries.length == 0 || !story.exceptCountries.includes(currentCountry) )){
            finalJson.push(story);
        }
        else if (!!story.countries && story.countries.includes(currentCountry)){
            finalJson.push(story);
        }
       
      
    });
    
    return finalJson;
}


export {checkData,checkStore,clearData}