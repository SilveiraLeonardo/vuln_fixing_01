const express = require('express');
const router = express.Router();
const url = require('url');
const { spawn } = require('child_process');

router.post('/ping', (req, res) => {
    const command = "ping";
    const args = [url.parse(req.body.url).hostname]; // Get only the hostname from the supplied URL
    const child = spawn(command, args);

    child.on('error', (error) => {
        res.send('error');
    });

    child.on('exit', (code) => {
        res.send('pong');
    });
});

const allowedFiles = ["file1.txt", "file2.txt", "file3.txt"];

router.post('/gzip', (req, res) => {
    const command = "gzip";

    if (!allowedFiles.includes(req.query.file_path)) {
        res.status(403).send('Unauthorized file');
        return;
    }

    const args = [`/secure/folder/${req.query.file_path}`];
    const child = spawn(command, args);

    child.on('error', (error) => {
        console.log('error:', error);
        res.send('error');
    });

    child.on('exit', (code) => {
        res.send('done');
    });
});

router.get('/run/:cmd', (req, res) => {
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