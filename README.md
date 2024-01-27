
# RTR

  

## Project Spefic

RTR class basically it's an extension of the rtrViewer class (RTR: [docs](https://rtr-viewer.luxottica.com/guide/version/5/index.html)) , with some additional functionality and some default values.

In the the folder brands there are the specific implementation for each brand, since the RTR is used in different ways in different brands( banner homepage, PDP overlay) I use the naming convention **BRAND_ModuleType** to specify the brand and the module variant. (es SGH_homepage, RB_PDPoverlay)
  

## Project Structure


**src**: codebase files of the project, diveded in `views, js, scss, static, json`.

-  **js [project specific]**:  for this project since there is a RTR core that is implementend in different ways, in the main folder there is the RTR class that extends the rtrViewer, then this class is importend in the brand specific implementation under `brands > SGH_Homepage/RB/ec...> main.js`. 
For this reason the inject-js task and script task have been updated to build only the brand main.js 

-  **views**: HTML files, in pug format. Is possibile to define if an element must be included with the build command or not if the variable `isProd` and also include different element based on the brand with the variable `brand`. In particular this functionality has been used with the file `views > main > live > RB.html/SGH.html` that contains the path for the file uploaded on filezilla for the different brands.

-  **scss**: Includes the style files. `main.scss` with `components, layout, utils` are the common core for all the brands. Inside the `brand` folder there are the customization for each brand.

In the `utils > local.scss` file are included rules for dev in local, like imported font and base style that is not needed in production.

-  **static**: includes font and icons.

-  **json**: `json_default.js` contains the base common structure for the json, in the `brands` folder there are the data specific for each brand testable in the local or github pages environment.

**release**: contains the bundled/minified css and js divided by brand and release number. <br/>

**test**: contains the file testable on github pages, with the correct relative path

  

## Project Tasks

  

**DEV**

  

npm run dev

To run local server, `env` variable is set to `"development"` and `isProd` is set to false. You can set with the prompt the brand is currently under development and the languange.

  

**TEST**

  

npm run preview

This command is used just to run a build and place the files in the `test` folder. Ad hoc paths for github pages are set. To share the module with others before going to prod.

  

**BUILD**

  

npm run build

To bundle and minify alla the files. The prompt also ask is there is a release, if yes, it takes the project version from package.json file and create the file html, js, css with the release number inside the `release`folder.

These are the file that should be uploaded on filezilla.