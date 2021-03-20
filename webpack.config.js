const path = require('path');

module.exports = {
    mode: 'development',
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    target: 'node'
};
const nodeExternals = require('webpack-node-externals');

module.exports = {
    externals: [nodeExternals()],
};
const puppeteer = require('puppeteer');
const browser = puppeteer.launch({
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
    ],
});