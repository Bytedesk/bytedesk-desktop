/*
 * @Author: jack ning github@bytedesk.com
 * @Date: 2024-07-27 13:01:04
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-09-20 21:36:27
 * @FilePath: /electron-vite-react/electron/main/pup.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import puppeteer from 'puppeteer';
// import puppeteer from "puppeteer-core";

const testPuppeteer = async () => {
  console.log("test puppeteer");

  // // // Launch the browser and open a new blank page
  // const browser = await puppeteer.launch({ headless: false});
  // // const page = await browser.newPage();
  // const pages = await browser.pages();
  // const page = pages[0];
  // page.on("request", (request) => {
  //   console.log(request.url());
  // });
  // page.on("response", (response) => {
  //   console.log(response.url());
  // });

  // // 改变视图窗口大小，而不是浏览器大小
  // await page.setViewport({ width: 1440, height: 900 }); // 设置页面大小
  // await page.goto('https://www.baidu.com');
  // await page.keyboard.type('微语AI');
  // await page.keyboard.press('Enter');

  // await browser.close();
};

export default testPuppeteer;
