const path = require('path');
const AsyncLock = require('async-lock');
const puppeteer = require('puppeteer-core');
const models = require('./models');
const User = models.User;

module.exports.isEmpty = function(val) {
  if (!val) { // null|undefined|''|0|false
    if ( val !== 0 && val !== false ) {
      return true;
    }
  }　else if　(typeof val == "object"){ //array|object
    return Object.keys(val).length === 0;
  }
  return false; // 値は空ではない
}

// module.exports.filterObject : 削除, 以下で代替
// _.pick
// _.omit

// TODO:ちゃんと自分で定義したErrorのみメッセージを返すようにしないと、任意のエラーが外部にもれて攻撃につながる恐れがある。 
module.exports.restApiRes = async function(req, res, processFn, formatFn) {
  try {
    const processRes = await processFn();
    const resJson = {
      'result': 'ok'
    };
    Object.assign(resJson, formatFn(processRes));
    res.json(resJson);
  } catch (e) {
    const resJson = {
      'result': 'error',
      'type': e.message,
    };
    res.status(400).json(resJson);
  }
}

// ブラウザ操作関係

let browser = null;
let page = null;
const browserLock = new AsyncLock();

// ページを用意
async function preparePageInstance() {
  await browserLock.acquire('getPageInstance', async (done) => {
    if (!browser) {
      browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: false,
        executablePath: process.env.BROWSER_EXECUTABLE,
        //slowMo: 200,
        defaultViewport: {
          width: 1200,
          height: 630
        },
	args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      process.on('SIGINT', function() {
        if (browser) {
          browser.close();
        }
        process.exit();
      });
    }
    page = (await browser.pages())[0];
    done();
  });
  return page;
}

// カードイメージのスクリーンショットを撮る
module.exports.genCardImage = async function (masterRegToken) {
  await browserLock.acquire('genCardImage', async (done) => {
    await preparePageInstance();
    await page.goto(`${process.env.WEB_APP_URL}/gen/master/${masterRegToken}`),
    await page.waitFor('.card')
    await page.waitFor(3000);
    await page.screenshot({
      path: path.resolve(process.env.UPLOAD_PATH, `master/cardimage/${masterRegToken}.jpeg`)
    });
    done()
  });
}


