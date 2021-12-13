const rp = require('request-promise');
const JSSoup = require('jssoup').default;
const { performance } = require('perf_hooks');

let queue = [];
let queueMap = {};
let seenSites = [];

const crawl = async (url, linksLen, depthLen) => {
  try {
    seenSites.push(url);
    if (seenSites.length > depthLen) return;

    const htmlData = await rp(url);
    const soup = new JSSoup(htmlData);

    const relaLinks = soup
      .findAll('a')
      .map((anchor) =>
        anchor.attrs.href &&
        anchor.attrs.href[0] === '/' &&
        !anchor.attrs.href.includes('.')
          ? url.match(/^.+?[^\/:](?=[?\/]|$)/)[0] + anchor.attrs.href
          : anchor.attrs.href
      )
      .filter(
        (link) =>
          link &&
          link.includes(url.match(/^.+?[^\/:](?=[?\/]|$)/)[0])
      );

    for (let relaLink of relaLinks) {
      if (!queueMap[relaLink]) {
        if (queue.length >= linksLen) return;

        if (!seenSites.includes(relaLink)) {
          queue.push(relaLink);
          queueMap[relaLink] = true;
        }

        if (queue.length % 500 === 0)
          console.log('Relative Links Scraped:', queue.length);
      }
    }

    return crawl(queue.shift(), linksLen, depthLen);
  } catch (err) {
    console.log(err);
    return crawl(queue.shift(), linksLen, depthLen);
  }
};

const crawlJob = async (req, res) => {
  const { url, depth, max } = req.body;

  const startTime = performance.now();
  await crawl(url, max, depth);
  const endTime = performance.now();
  const executionTime = parseFloat((endTime - startTime) / 1000);

  console.log(
    `All Done! \nGot ${queue.length} links. \n\nFrom:\n[${
      seenSites.length
    }]\n\n Executed it in:${executionTime.toFixed(4)} seconds `
  );

  res.json({
    queue,
    msg:
      max > queue.length
        ? `You'll might need to go a bit deeper got\n${
            queue.length
          } links in ${executionTime.toFixed(4)} seconds `
        : `Got ${queue.length} links in ${executionTime.toFixed(
            4
          )} seconds`,
  });

  queue = [];
  seenSites = [];
  queueMap = {};
};

module.exports = crawlJob;
