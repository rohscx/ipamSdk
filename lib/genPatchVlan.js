module.exports = function(
    arraySize = 169,
    arrayMin = 162,
    arrayMax = 169,
    subnetSize = 256,
    increment = 0,
    payLoadGeneratator = (d, i) => [`10.${d}.${i + 16}.0/24`],
    body = (data) => ({ vlan: data.next().value }),
) {
    return [...Array(arraySize).keys()]
        .map((d, i) => ++i)
        .filter((f) => f >= arrayMin)
        .filter((f) => f <= arrayMax)
        .map((d, i) => d)
        .map((d) => {
            //const splitOctant = d.split('.');
            return [...Array(subnetSize).keys()]
                .map((d2, i) => i)
                .filter((f, i) => i <= increment)
                .map((d3, i) => ({
                    payload: payLoadGeneratator(d, i),
                    body: body(),
                }));
        })
        .reduce((n, o) => {
            n.push(...o);
            return n;
        }, []); //?
};
