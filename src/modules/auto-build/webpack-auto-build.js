const {resolve} = require('path'),
    fs = require('fs'),
    uglifycss = require('uglifycss'),
    imagemin = require('imagemin'),
    imageminJpegtran = require('imagemin-jpegtran'),
    imageminPngquant = require('imagemin-pngquant'),
    imageminSvgo = require('imagemin-svgo'),
    getSize = require('get-folder-size');



/* ------------------- HELPER FUNCTIONS ----------------------- */

/**
 * GUID generator
 *
 * @returns {string}
 */
const generateGUID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
 * Replace text in file
 *
 * @param path
 * @param str
 * @param replace
 * @param cb
 */
const replaceInFile = (path, str, replace, cb) => {
    fs.readFile(path, 'utf8', (err,data) => {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(str, replace);
        fs.writeFile(path, result, 'utf8', function (err) {
            if(cb){
                cb();
            }
            if (err) return console.log(err);
        });
    });
}

/**
 * Minify all images recursively
 *
 * @param dir
 */
const imgMinRecursive = (dir, cb) => {
    let imgToMinCount = 0;
    const imgMinRecursiveInner = (dir, cb)=>{
        fs.readdirSync(dir)
            .filter(file => {
                const imgFile = resolve(dir, file);
                if(fs.lstatSync(imgFile).isDirectory()){
                    imgMinRecursiveInner(imgFile, cb);
                }
                else{
                    imgToMinCount++;
                    let minifierObj = {
                        plugins: [
                            imageminJpegtran(),
                            imageminPngquant({quality: '65-80'})
                        ]
                    };
                    if(imgFile.indexOf(".svg") != -1){
                        minifierObj = {
                            use: [
                                imageminSvgo({
                                    plugins: [
                                        {removeViewBox: false}
                                    ]
                                })
                            ]
                        };
                    }
                    imagemin([imgFile], dir, minifierObj).then(files => {
                        imgToMinCount--;
                        if(imgToMinCount == 0 && cb){
                            cb();
                        }
                    });
                }
            });
    }
    imgMinRecursiveInner(dir, cb);
}

const optimize = (baseDirName, lastCb) => {
    /* ---------------- CSS UGLIFIYING LOGIC ------------------------ */
    const uglified = uglifycss.processFiles(
        [
            resolve(__dirname, `../build/css/normalize.css`),
            resolve(__dirname, `../build/css/style.css`),
            resolve(__dirname, `../build/css/fonts.css`),
            resolve(__dirname, `../build/css/global.css`),
            resolve(__dirname, `../build/css/bundle.css`),
        ],
        { maxLineLen: 500, expandVars: true }
    );
    fs.writeFile(resolve(__dirname, `../${baseDirName}/css/bundle.css`), uglified, (err) => err && console.log(err));



    /* ---------------------- FILE RENAMING WITH GUID --------------------- */
    const guid = generateGUID(),
        indexFile = resolve(__dirname, `../${baseDirName}/index.html`),
        filesToRename = {};

    filesToRename[resolve(__dirname, `../${baseDirName}/js/react/app.js`)] = resolve(__dirname, `../${baseDirName}/js/react/app.${guid}.js`);
    filesToRename[resolve(__dirname, `../${baseDirName}/js/react/vendor.js`)] = resolve(__dirname, `../${baseDirName}/js/react/vendor.${guid}.js`);
    filesToRename[resolve(__dirname, `../${baseDirName}/js/react/app.js.gz`)] = resolve(__dirname, `../${baseDirName}/js/react/app.${guid}.js.gz`);
    filesToRename[resolve(__dirname, `../${baseDirName}/js/react/vendor.js.gz`)] = resolve(__dirname, `../${baseDirName}/js/react/vendor.${guid}.js.gz`);
    filesToRename[resolve(__dirname, `../${baseDirName}/css/bundle.css`)] = resolve(__dirname, `../${baseDirName}/css/bundle.${guid}.css`);

    Object.keys(filesToRename).map(key=>{
        fs.rename(key, filesToRename[key],(err) => err && console.log('ERROR: ' + err));
    })


    /* ---------------------------------- REPLACE NEW FILENAMES WITH GUID ----------------------------- */
    replaceInFile(indexFile, "/js/react/app.js", `/js/react/app.${guid}.js`, ()=>{
        replaceInFile(indexFile, "/js/react/vendor.js", `/js/react/vendor.${guid}.js`, ()=> {
            replaceInFile(indexFile, '<link rel="stylesheet" href="/css/normalize.css">', '', () => {
                replaceInFile(indexFile, '<link rel="stylesheet" href="/css/style.css">', '', () => {
                    replaceInFile(indexFile, '<link rel="stylesheet" href="/css/fonts.css">', '', () => {
                        replaceInFile(indexFile, '<link rel="stylesheet" href="/css/global.css">', '', () => {
                            replaceInFile(indexFile, '<link rel="stylesheet" href="/css/bundle.css">', `<link rel="stylesheet" href='/css/bundle.${guid}.css'>`, ()=>{
                                console.log("\nfinish renames in index.html");
                            });
                        });
                    });
                });
            });
        });
    });



    /* ---------------- IMAGE MINIFICATION ----------------------------- */
    const imageDir = resolve(__dirname, `../${baseDirName}/images`);
    getSize(imageDir, (err, size) => {
        if (err) { throw err; }
        console.log("Image folder "+imageDir+" size: "+(size / 1024 / 1024).toFixed(2) + " Mb");
        imgMinRecursive(imageDir, ()=>{
            getSize(imageDir, (err, size) => {
                lastCb();
                if (err) { throw err; }
                console.log("Image folder "+imageDir+" new size: "+(size / 1024 / 1024).toFixed(2) + " Mb");
            });
        });
    });
}


module.exports = {
    optimize: (path, cb) => {
        optimize(path, cb)
    },
}
