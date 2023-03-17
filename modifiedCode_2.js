const express = require('express');
const router = express.Router()

const { exec, spawn }  = require('child_process');


router.post('/ping', (req,res) => {
    const sanitizedUrl = req.body.url.replace(/[^a-zA-Z0-9]/g, '');
    const validUrlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/; // Added regex to validate URL
    if(!validUrlRegex.test(sanitizedUrl)) { // Added check to validate URL
        return res.status(400).send('Invalid URL');
    }
    exec(`${sanitizedUrl}`, {shell: false}, (error) => { // Changed shell to false
        if (error) {
            return res.send('error');
        }
        res.send('pong')
    })
    
})

router.post('/gzip', (req,res) => {
    const sanitizedFilePath = req.query.file_path.replace(/[^a-zA-Z0-9]/g, '');
    exec(
        'gzip ' + sanitizedFilePath, {shell: false}, // Changed shell to false
        function (err, data) {
          console.log('err: ', err)
          console.log('data: ', data);
          res.send('done');
    });
})

router.get('/run', (req,res) => {
    // Check if user is authorized to access this route
    if(!req.user.isAuthorized) {
        return res.status(403).send('Unauthorized');
    }
    let cmd = req.params.cmd;
    runMe(cmd,res)
});

function runMe(cmd,res){
//    return spawn(cmd);

    const sanitizedCmd = cmd.replace(/[^a-zA-Z0-9]/g, '');
    const cmdRunning = spawn(sanitizedCmd, [], {shell: false, stdio: 'ignore'}); // Changed shell to false
    cmdRunning.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    cmdRunning.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });
    cmdRunning.on('close', (code) => {
        res.send(`child process exited with code ${code}`);
    });
}

module.exports = router