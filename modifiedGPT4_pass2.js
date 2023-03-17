const express = require('express');
const router = express.Router();
const url = require('url');
const path = require('path');
const { spawn } = require('child_process');
const { URL } = require('url');

router.post('/ping', (req, res) => {
    const command = "ping";
    let userUrl;
    try {
        userUrl = new URL(req.body.url);
    } catch (err) {
        res.status(400).send('Invalid URL');
        return;
    }

    const hostname = userUrl.hostname;

    if (!isValidDomain(hostname)) {
        res.status(400).send('Invalid URL');
        return;
    }

    const args = [hostname];
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

    const secureFilePath = path.join('/secure/folder/', req.query.file_path);
    const args = [secureFilePath];
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
    let cmd = req.params.cmd.toLowerCase();
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

function isValidDomain(domain) {
    // Add implementation for domain validation based on requirements
    // Example: use regular expression to match domain format
    const domainRegex = /^(?=.{1,253}(?<!\.)\.)((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.?)+[A-Za-z]{2,6}$/;
    return domainRegex.test(domain);
}

module.exports = router;