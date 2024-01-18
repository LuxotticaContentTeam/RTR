# RTR


## Project Structure

 **src**:  codebase files of the project, diveded in `views, js, scss, static, json`.
 - **views**:  HTML files, in pug format. Is possibile to define if an element must be included with the build command or not if the variable `isProd` and also include different element based on the brand with the variable `brand`. In particular this functionality has been used with the file `views > main > live > RB.html/SGH.html` that contains the path for the file uploaded on filezilla for the different brands.
 - **scss**: Includes the style files. `main.scss` with `components, layout, utils` are the common core for all the brands. Inside the `brand` folder there are the customization for each brand.
In the `utils > local.scss` file are included rules for dev in local, like imported font and base style that is not needed in production.
 - **static**: includes font and icons.
 - **js**: includes the scripts for the module. Inside `js > brands > [RB/SGH/..]` are included brand's specific function, like the product's service and how to get current store information.
 - **json**:  `json_default.js` contains the base common structure for the json, in the `brands` folder there are the data specific for each brand testable in the local or github pages environment.
 
**release**: contains the bundled/minified css and js divided by brand and release number. <br/>
**test**: contains the file testable on github pages, with the correct relative path

## Project Tasks

**DEV**

     npm run dev
To run local server, `env` variable is set to `"development"` and `isProd` is set to false. You can set with the prompt the brand is currently under development and the languange.

**TEST**

    npm run preProd
This command is used just to run a build and place the files in the `test` folder. Ad hoc paths for github pages are set. To share the module with others before going to prod.

**BUILD**

    npm run build
To bundle and minify alla the files. The prompt also ask is there is a release, if yes, it takes the project version from package.json file and create the file html, js, css with the release number inside the `release`folder. 
These are the file that should be uploaded on filezilla.
