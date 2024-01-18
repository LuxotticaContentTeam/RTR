# SMV2


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

## Data Structure

| 	Attribute 	 | Type  | Value                         |       Description         |
|----------------|----|---------------------------|-----------------------------|
|id           |`String`| -- |Not Mandatory. Just to identify the content
|country      |`String, String[]` | `"ALL",["en-us","it-it",ecc..]` | Not Mandatory. "ALL" is the default if the field is missing. It defines the country in which the story should be displayed.
|exceptCountries |`String[]`| `["en-us","it-it",ecc..]` |Not Mandatory. It defines the country in which the story shouldn't be displayed. It must be used when `country` is not present or set to "ALL"
|variant          |`String`| `"default", "default_center"` | Not Mandatory. It define the layout variant to use. If not definied the default variant is with text and product aligned to the left.
| anchor         |`String`| -- | Mandatory. Label for the button on top of the module, to navigate through different contents
| video         |`Object`| -- | Mandatory. Video of the story, it requires an asset desk `d` and mobile `m` and a poster `dCover, mCover`.
| video - d         |`String`| -- | Mandatory. Asset video desktop
| video - m         |`String`| -- | Mandatory. Asset video mobile
| video - dCover         |`String`| -- | Mandatory. Poster video desktop
| video - mCover         |`String`| -- | Mandatory. Poster video mobile
| text         |`Object`| -- | Mandatory. Copy of the story
| text - icon       |`String`| -- | Not Mandatory. Icon in SVG format.
| text - title       |`String`| -- | Not Mandatory.
| text - subtitle       |`String`| -- | Not Mandatory. 
| text - cta       |`Object`| -- | Not Mandatory. With `label` and `link` field.
| products       |`String[]`| -- | Mandatory. UPCs of the products to display, the array can be empty.
