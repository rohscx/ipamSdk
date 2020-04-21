module.exports = function(
    subnets = 32,
    network,
    prefix,
    site,
    tenant,
    isPool = false,
    description = 'AVAILABLE',
    options = { type: 'null', tags: [], vlan: null },
) {
    const { type, tags, vlan } = options;

    return [...Array(256).keys()]
        .map((d, i) => i)
        .filter((f) => f % subnets === 0)
        .map((d) => {
            let postObject;
            if (type.toUpperCase() === 'IPV4') {
                postObject = {
                    address: `${network}/${prefix}`,
                    tenant: tenant,
                    status: 1,
                    role: 10,
                    description: description,
                    tags: tags,
                };
            } else {
                postObject = {
                    prefix: `${network}${d}/${prefix}`,
                    site: site,
                    vrf: null,
                    tenant: tenant,
                    vlan: vlan,
                    role: null,
                    is_pool: isPool,
                    description: description,
                    tags: tags,
                };
            }
            return JSON.stringify(postObject, null, '\t');
        });
};
