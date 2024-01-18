import {getInfoProducts_local, getInfoProducts} from './products_fn';
import {info_store, info_store_local} from './info_store';

window.ct_SMV2_config = {
    brand : "SGH",
    imagePath : "https://assets.sunglasshut.com/is/image/LuxotticaRetail/",
    env : "@env@",
    mocos : [],
    store: {},
    breakpoints : {
        mob_max : 767,
        tab_min: 768,
        tab_max : 1024,
        desk_min: 1025
    },
    products_data: {},
    productsService  : "/wcs/resources/plp/{{storeID}}/byPartNumbers/{{listProducts}}"
    // productsService  : "/ajaxSearchDisplayView?storeId={{storeID}}&catalogId={{catalogID}}&langId={{langId}}&pageSize=60&orderBy=1&searchTerm={{searchTerm}}"
}
window.ct_SMV2_config.products_fn_local = getInfoProducts_local;
window.ct_SMV2_config.products_fn = getInfoProducts; // getInfoProducts --> pass mocos
window.ct_SMV2_config.store_info = info_store;
window.ct_SMV2_config.store_info_local = info_store_local;