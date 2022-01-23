require('chromedriver');
const webdriver = require('selenium-webdriver');
const {until} = require('selenium-webdriver');
chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const EXTENSTION_PATH = './src/metamask.crx';
const EXTENSION_ID = 'nkbihfbeogaeaoehlefnkodbefgpgknn';
const SECRET_RECOVERY_PHRASE  = 'blouse shrug device forget black refuse gas repeat gain leaf achieve machine';
const NEW_PASSWORD = '19960203';

const RinkebyNetwork = {
    networkName: 'Rinkeby Test Network',
    chainId: '4',
    blockExplorerUrl: 'https://rinkeby.etherscan.io',
    newRpcUrl: 'https://rinkeby.infura.io/v3/',
    currentSymbol: 'ETH',
}

options = new chrome.Options();
// options.addArguments('headless'); // note: without dashes
// options.addArguments('disable-gpu');
options.addExtensions(EXTENSTION_PATH);
options.addArguments("--start-maximized");
const service = new chrome.ServiceBuilder(path.join(__dirname, "chromedriver.exe")).build();
chrome.setDefaultService(service);
const driver = 
    new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(webdriver.Capabilities.chrome())
    .setChromeOptions(options)
    .build();

const {By} = webdriver;

const openSeaUrl = 'https://testnets.opensea.io/';

const sleep = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

async function installWallet(){
    try{
        await driver.get(`chrome-extension://${EXTENSION_ID}/home.html#initialize/welcome`);

        await driver.manage().setTimeouts({
            implicit: 1000, // 10 seconds
        });

        await driver.findElement(By.xpath('//button[text()="Get Started"]')).click();

        await driver.findElement(By.xpath('//button[text()="Import wallet"]')).click();

        await driver.findElement(By.xpath('//button[text()="No Thanks"]')).click();

        await driver.manage().setTimeouts({
            implicit: 1000, // 10 seconds
        });

        await driver.findElement(By.xpath('//input[@placeholder="Paste Secret Recovery Phrase from clipboard"]')).sendKeys(SECRET_RECOVERY_PHRASE);

        await driver.findElement(By.xpath('//input[@id="password"]')).sendKeys(NEW_PASSWORD);

        await driver.findElement(By.xpath('//input[@id="confirm-password"]')).sendKeys(NEW_PASSWORD);

        let checkboxList = await driver.findElements(By.xpath('//div[@role="checkbox"]'))

        let clickCheck = await checkboxList.map((ele, index) => {
            if(index === 1 ){
                ele.click();
            }
        });

        await clickCheck;

        await driver.findElement(By.xpath('//div[@role="checkbox"]')).click();

        await driver.findElement(By.xpath('//button[@type="submit"]')).click();

        await driver.manage().setTimeouts({
            implicit: 10000, // 10 seconds
        });

        await driver.findElement(By.xpath('//button[text()="All Done"]')).click();

        await driver.get(`chrome-extension://${EXTENSION_ID}/home.html`);

        await driver.manage().setTimeouts({
            implicit: 1000, // 10 seconds
        });

        await driver.findElement(By.xpath('//button[@data-testid="popover-close"]')).click();
        
        await driver.findElement(By.className('identicon')).click();

        let account = await driver.findElement(By.className('account-menu'));
        
        let settingList = await account.findElements(By.className('account-menu__item account-menu__item--clickable'));

        let clickSetting = await settingList.map((ele, index) => {
            if(index === 4){
                ele.click();
            }
        })

        await clickSetting;

        // await driver.wait(until.elementLocated(By.xpath('//div[@class="tab-bar"]//button[@class="tab-bar__tab pointer"]')), 30000, 'Timed out after 30 seconds', 5000);
        await sleep(1000)

        let tabList = await driver.findElements(By.xpath('//div[@class="tab-bar"]//button[@class="tab-bar__tab pointer"]'));
        let clickAdvanced = await tabList.map((ele, index) => {
            if(index === 1){
                ele.click();
            }
        })

        await clickAdvanced;
        await driver.findElement(By.className('settings-page__close-button')).click();
        
        // await driver.findElements(By.xpath('//div[@data-testid="advanced-setting-show-testnet-conversion"]')).then((res) => {
        //     res.map((ele, index) => {
        //         if(index === 1){
        //             ele.findElements(By.className('settings-page__content-item')).then((r) => {
        //                 r.map((ele, index) => {
        //                     if(index === 1) ele.click();
        //                 })
        //             })
        //         }
        //     })
        // });
        
        // await driver.findElement(By.className('chip__right-icon')).click();

        // await driver.findElement(By.xpath('//span[text()="Rinkeby Test Network"]')).click();

    }catch(err){
        console.log(err.message);
    }
}

async function openOpenSeaSite(url){
    try{
        await driver.executeScript(`window.open("${url}");`);
        // await driver.get(url);
        await driver.manage().setTimeouts({
            implicit: 1000, // 10 seconds
        });
        // await driver.findElement(By.xpath('//a[text()="Create"]')).click();

    }catch(e){
        console.log("error" + e.message);
    }
}

async function switchToOther(isOpenSea){
    driver.getAllWindowHandles()
    .then((availableWindows) => {
        if(isOpenSea){
            driver.switchTo().window(availableWindows[2]);
        }else{
            driver.switchTo().window(availableWindows[1]);
        }
    })
}

async function startProject(){
    // install metamask
    await installWallet();
    // open opensea
    await openOpenSeaSite(openSeaUrl);
    // false - switch to metamask
    await switchToOther(true);
}



startProject();