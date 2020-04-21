module.exports = function(data) {
    return data.map((d) => JSON.parse(d));
    //.map((d) => JSON.stringify(d,null,'\t'));
};
