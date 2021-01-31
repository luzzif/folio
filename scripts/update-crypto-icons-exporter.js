const fs = require("fs");
const prettier = require("prettier");
const prettierOptions = require("../.prettierrc");

fs.readdir(`${__dirname}/../assets/svg/crypto-icons`, (err, files) => {
    if (err) {
        throw err;
    }
    const requires = files.reduce((accumulator, file) => {
        const lowerCaseFile = file.toLowerCase();
        accumulator.push(
            `"${lowerCaseFile.split(".svg")[0]}": require("./${lowerCaseFile}")`
        );
        return accumulator;
    }, []);
    const exporterData = `export const cryptoIcons = {\n    ${requires.join(
        ",\n    "
    )}\n}`;

    fs.writeFile(
        `${__dirname}/../assets/svg/crypto-icons/index.js`,
        prettier.format(exporterData, prettierOptions),
        (error) => {
            if (error) {
                throw error;
            }
            console.log("icons successfully updated");
        }
    );
});
