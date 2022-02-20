const axios = require('axios');
const fs = require('fs');
const token = "Bearer Token"

const config = {
    headers: { Authorization: `Bearer ${token}` }
}

// Create txt file
fs.writeFile('data.txt', 'random_chain\nsocks5\n[ProxyList]\n', (err) => {
    if (err) throw err;
    console.log('File created');
});

axios.get('https://proxy.olliwes.me/api/proxies/socks5', config).then(response => {

    const proxies = response.data;
    const ips = proxies.map(proxy => proxy.ip);
    console.log(ips)

    ips.forEach(ip => {

        ip = ip.split(':');
        let port = ip[1];
        ip = ip[0];
        axios.get(`https://verify.cpanel.net/api/verifyfeed?json=1&ip=${ip}`).then(response => {
            if(!response.data.license[0].attributes) {
                return
            } else {
                if (response.data.license[0].attributes[0].status === 1) {
                    return
                } else {
                    fs.appendFile('data.txt', `${ip}:${port}\n`, (err) => {
                        if (err) throw err;
                        console.log('Saved!');
                    });
                }
            }
        })
    })

})