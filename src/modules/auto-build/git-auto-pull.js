/**
 * Auto building from multiple branches using simple-git
 * https://github.com/steveukx/git-js
 */


const fs = require('fs'),
    {resolve} = require('path'),
    exec = require('child_process').exec,
    workingDirPath = resolve(__dirname, "../"),
    staticDir = resolve(workingDirPath, "static"),
    git = require('simple-git')(workingDirPath),
    optimizer = require("./master-branch-optimizer"),
    RUN_INTERVAL = 30 * 1000;

const makeDir = (dir) => {
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

const pull = (branchName, cb) => {
    git.checkout(branchName, (error, data)=>{
        console.log("\ncheckout branch "+branchName);
        if(!error){
            git.pull('origin', branchName, (error, update)=>{
                console.log("pull branch "+branchName, update);
                if(update && update.summary.changes) {
                    console.log("----------start updating----------");
                    exec("npm i"+branchName, ()=>{
                        console.log("npm i done");
                        if(branchName == "master"){
                            exec("npm run build:prod", ()=>{
                                console.log("npm run build:prod done");
                                const preMasterDir = 'static/premaster';
                                exec(`rsync -tr build/* ${preMasterDir}`, ()=>{
                                    optimizer.optimize(preMasterDir, ()=>{
                                        exec(`rm -rf static/old-master && mv static/master static/old-master && mv ${preMasterDir} static/master`, ()=>{
                                            console.log("----------finish master----------");
                                            if(cb){
                                                cb();
                                            }
                                        })
                                    });
                                });
                            });
                        }
                        else{
                            exec("npm run build:dev", ()=>{
                                console.log("npm run build:dev done");
                                exec(`rsync -tr build/* static/${branchName}`, ()=>{
                                    console.log("copy to static/"+branchName);
                                    console.log("----------finish----------");
                                    if(cb){
                                        cb();
                                    }
                                });
                            });
                        }
                    });
                }
                else{
                    console.log("no updates");
                    if(cb){
                        cb();
                    }
                }
            });
        }
    });
}

const execCbList = (list, cb, lastCb) => {
    const arr = list.slice();
    const loopThroughArr = ()=>{
        if(arr.length == 0){
            lastCb();
        }
        else{
            cb(arr[0], ()=>{
                arr.splice(0, 1);
                loopThroughArr();
            })
        }
    }
    loopThroughArr();
}

const branches = ["dev", "hotfix", "master"];

let execRun = 0;
const run = () => {
    console.log("\n--------------------------------------------------------------------------\n\nrun npm/branch-bundler.js");
    if(execRun == 0){
        execRun = 1;
        makeDir(staticDir);
        branches.map((branchName, i)=>{
            const branchDir = resolve(staticDir, branchName);
            makeDir(branchDir);
        });
        execCbList(branches, pull, ()=>{
            console.log("end");
            execRun = 0;
        });
    }
    else{
        console.log("\nwaiting...")
    }
}

run();
setInterval(run, RUN_INTERVAL);
























































