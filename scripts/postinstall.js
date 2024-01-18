const fs = require('fs');
const c = require('ansi-colors');
const inquirer = require('inquirer');

const projectConfigurations = {
    serveInNewTab: "local", // false | "local" |  "external" | "ui" | "tunnel"
    langs : ['en-us']
};

let smartlingDefault = {
    projectName : `GH test ${Date.now()}`,
    translationFileDirectory: 'to-translate',
    translationFileExtension: '.json',
    localeToTranslate: 'ALL', // ALL or [ 'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'ja-JP', 'ko-KR', 'pt-BR', 'zh-CN', 'zh-TW' ]
    translationsInOneFile : false
};

let brands = [
    {
        'label': 'RB',
        'projectID': 'baffcad2e',
    },
    {
        'label': 'OO',
        'projectID': 'baffcad2e',
    },
    {
        'label': 'OSI',
        'projectID': 'baffcad2e',
    },
    {
        'label': 'SGH',
        'projectID': 'baffcad2e',
    }
]

const skipConfig = () => {
    return new Promise((resolve) => {
        inquirer.prompt([{
            type: 'confirm',
            name: 'skip_config',
            message: `Do you want to start the configuration? ${(c.grey(`default false`))}`,
            default: false
        },
        {
            type: 'confirm',
            name: 'confirm_answer',
            message: `Are you sure? If so, remember to set the projectConfig.json file.`,
            default: true,
            when: (answers) => answers.skip_config === false,
        }
        ]).then(answers => {
            resolve(answers.skip_config);
        })
    })
}

const brandConfig = () => {
    return new Promise((resolve) => {
        inquirer.prompt([
            {
                type: 'checkbox',
                name: 'selectedBrands',
                message: "Enter your brand:",
                choices: brands.map(brand => {return {name: brand.label}}),
            }
        ]).then(answers => {
            const { selectedBrands } = answers;
            resolve(selectedBrands);
        });
    });
};

const smartlingConfig = () => {
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'project_name',
                message: 'Enter the name of the project',
                validate: function(input) {
                    if (input.trim() === '') {
                        return "Input cannot be empty";
                    }
                    return true;
                }                
            },
            {
                type: 'input',
                name: 'USER_IDENTIFIER',
                message: "Enter your user ID:",
                validate: function(input) {
                    if (input.trim() === '') {
                        return "Input cannot be empty";
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'ACCOUNT_UID',
                message: "Enter your account UID:",
                validate: function(input) {
                    if (input.trim() === '') {
                        return "Input cannot be empty";
                    }
                    return true;
                }
            },
            {
                type: 'password',
                name: 'USER_SECRET',
                message: "Enter your user secret:",
                validate: function(input) {
                    if (input.trim() === '') {
                        return "Input cannot be empty";
                    }
                    return true;
                }
            },
        ]).then(answers => {
            const { USER_IDENTIFIER, ACCOUNT_UID, USER_SECRET } = answers;

            resolve({
                project_name,
                USER_IDENTIFIER,
                ACCOUNT_UID,
                USER_SECRET
            });

        });
    });
};

// Immediately Invoked Function Expression (IIFE) that is asynchronous
(async () => {

    const skipResponse = await skipConfig();
    if(!skipResponse) return;
    
    const brandSelected = await brandConfig();
    projectConfigurations.brands = brandSelected;

    // Call the smartlingConfig function and wait for it to resolve
    // The result is stored in smartlingResponse
    const smartlingResponse = await smartlingConfig();
    projectConfigurations.smartling = {
        ...smartlingDefault,
        ...smartlingResponse,
        projectIDs: brands.filter(brand => brandSelected.includes(brand.label))
    }

    console.log(projectConfigurations);

    // Write the projectConfigurations object to a file named projectConfig.json
    // This is done using Node.js's fs.writeFile function, which is asynchronous
    // If there's an error during the write operation, it logs the error to the console
    // If the operation is successful, it logs a success message to the console
    fs.writeFile('projectConfig.json', JSON.stringify(projectConfigurations), err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(c.green('Values saved successfully in ./.projectConfig file.'));
        console.log(c.green('Please read the README.md file to add more customizations.'));
    });

})();