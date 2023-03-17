const express = require('express');
const router = express.Router()

const { spawn } = require('child_process');

router.post('/ping', (req, res) => {
    const command = "ping";
    const args = [req.body.url];
    const child = spawn(command, args);

    child.on('error', (error) => {
        res.send('error');
    });

    child.on('exit', (code) => {
        res.send('pong');
    });
});

router.post('/gzip', (req, res) => {
    const command = "gzip";
    const args = [req.query.file_path];
    const child = spawn(command, args);

    child.on('error', (error) => {
        console.log('error:', error);
        res.send('error');
    });

    child.on('exit', (code) => {
        res.send('done');
    });
});

router.get('/run', (req, res) => {
    let cmd = req.params.cmd;
    runMe(cmd, res);
});

function runMe(cmd, res) {
    const allowedCommands = {
        "whoami": "whoami",
        "ls": "ls"
    };

    if (allowedCommands.hasOwnProperty(cmd)) {
        const child = spawn(allowedCommands[cmd], []);

        child.on('close', (code) => {
            res.send(`child process exited with code ${code}`);
        });
    } else {
        res.status(403).send('Unauthorized command');
    }
}

module.exports = router;