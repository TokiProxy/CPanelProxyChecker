const axios = require('axios');
const fs = require('fs');
const token = "Token here"

const config = {
    headers: { Authorization: `Bearer ${token}` }
}

// Create txt file
fs.writeFile('data.txt', 'random_chain\nproxy_dns\n[ProxyList]\nsocks5\n', (err) => {
    if (err) throw err;
    console.log('File created');
});

axios.get('https://tokiproxy.co.uk/api/proxies/socks5', config).then(response => {

    const proxies = response.data;
    const ips = proxies.map(proxy => proxy.ip);
    console.log(ips)

    ips.forEach(ip => {

        ip = ip.split(':');
        let port = ip[1];
        ip = ip[0];
        axios.get(`https://verify.cpanel.net/api/verifyfeed?json=1&ip=${ip}`).then(response => {
            if (!response.data.license[0].attributes && !response.data.license[0].history) {
                fs.appendFile('data.txt', `${ip}:${port}\n`, (err) => {
                    if (err) throw err;
                });
            } else if (response.data.license[0] === 0) {
                fs.appendFile('data.txt', `${ip}:${port}\n`, (err) => {
                    if (err) throw err;
                });
            } else {
                return;
            }
        })
    })
})
