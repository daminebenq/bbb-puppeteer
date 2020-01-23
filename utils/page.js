require('dotenv').config();
const puppeteer = require('puppeteer');
const e = require('./elements')
const axios = require('axios');
const url = require('url')
const URL = url.parse(process.env.SERVER_URL)

const browser = await puppeteer.launch({
    headless: false
})
const page = await browser.newPage();
await page.waitForNavigation();

class Page {
    async login(){
        await page.goto(URL+``)
    }
    async clearChat(){
        await page.waitForSelector(e.chatOptions);
        await page.click(e.chatOptions)
        await page.waitForSelector(e.deleteIcon)
        await page.click(e.deleteIcon)
    }
}
module.exports = Page;