const cliProgress = require('cli-progress');
const _colors = require('colors');
const Bottleneck = require('bottleneck');
const bent = require('bent');
const { netboxUrls, infobloxUrls } = require('../serverUrls.js');

const { protocal, domain, port, prefixPath, ipV4Path, vlanPath } = netboxUrls;

module.exports = function(
    data,
    headers,
    url = protocal + domain + port + prefixPath,
    options = { barName: "POST PREFIX ID'S" },
) {
    const { barName } = options;
    const bar1 = new cliProgress.SingleBar(
        {
            format:
                '{barName} |' +
                _colors.cyan('{bar}') +
                '| {percentage}% || {value}/{total} Chunks',
            stopOnComplete: true,
        },
        cliProgress.Presets.shades_classic,
    );
    bar1.start(data.length, 0, { barName });
    const limiter = new Bottleneck({
        maxConcurrent: 10,
        minTime: 200,
    });
    const post = bent('POST', 201);
    return Promise.all(
        data.map((body, i) => {
            return limiter.schedule(() => {
                bar1.increment();
                return post(url, body, headers);
            });
        }),
    );
};
