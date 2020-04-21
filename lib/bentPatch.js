const cliProgress = require('cli-progress');
const _colors = require('colors');
const Bottleneck = require('bottleneck');
const bent = require('bent');
const { netboxUrls, infobloxUrls } = require('../serverUrls.js');

module.exports = function(data, body, headers) {
    const {
        protocal,
        domain,
        port,
        prefixPath,
        ipV4Path,
        vlanPath,
    } = netboxUrls;
    const targetPrefixes = data;
    const getJSON = bent('json');
    const multibar = new cliProgress.MultiBar(
        {
            clearOnComplete: false,
            hideCursor: true,
            format:
                '{barName} |' +
                _colors.cyan('{bar}') +
                '| {percentage}% || {value}/{total} Chunks',
            stopOnComplete: true,
        },
        cliProgress.Presets.shades_grey,
    );
    const b1 = multibar.create(data.length, 0, { barName: "GET PREFIX ID'S" });
    const limiter = new Bottleneck({
        maxConcurrent: 10,
        minTime: 200,
    });

    return Promise.all(
        targetPrefixes.map((d) => {
            return limiter.schedule(() => {
                b1.increment();
                return getJSON(
                    `${protocal}${domain}${port}${prefixPath}?limit=1000&prefix=${d}`,
                    {},
                    headers,
                ).then((t) => ({
                    results: t.results,
                    bar: new cliProgress.SingleBar(
                        {
                            format:
                                '{barName} |' +
                                _colors.cyan('{bar}') +
                                '| {percentage}% || {value}/{total} Chunks',
                            stopOnComplete: true,
                        },
                        cliProgress.Presets.shades_classic,
                    ),
                }));
            });
        }),
    ).then((t) => {
        const flattend = t.reduce((n, o) => {
            n.push(...o.results);
            return n;
        }, []);
        const idArrayLegth = flattend.length;
        if (idArrayLegth > 0) {
            t[0].bar.start(flattend.length, 0, {
                barName: "PATCH PREFIX ID'S",
            });
            return Promise.all(
                flattend.map(({ id }) => {
                    const bentPatch = bent('PATCH', 200);
                    return limiter.schedule(() => {
                        t[0].bar.increment();
                        return bentPatch(
                            `${protocal}${domain}${port}${prefixPath}${id}/`,
                            body,
                            headers,
                        );
                    });
                }),
            );
        } else {
            return [
                {
                    statusMessage: `idArrayLegth : `,
                    statusCode: `${idArrayLegth}`,
                },
            ];
        }
    });
};
