module.exports = function(
    network,
    prefix,
    site,
    tenant,
    isPool = false,
    description = 'AVAILABLE',
    options = { type: 'null', tags: [], vlanId: null, status: 1 },
) {
    const { type, tags, vlanId = 0, status = 1 } = options;
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
    } else if (type.toUpperCase() === 'VLAN') {
        postObject = {
            site: site,
            vid: vlanId,
            name: network,
            tenant: tenant,
            status: status,
            role: null,
            description: description,
            tags: tags,
        };
    } else {
        postObject = {
            prefix: `${network}/${prefix}`,
            site: site,
            vrf: null,
            tenant: tenant,
            vlan: vlanId,
            role: null,
            is_pool: isPool,
            description: description,
            tags: tags,
        };
    }

    return [JSON.stringify(postObject, null, '\t')];
};
