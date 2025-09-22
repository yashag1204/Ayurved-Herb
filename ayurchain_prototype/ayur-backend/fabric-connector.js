const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, 'connection-org1.json'); // put a connection profile here
const walletPath = path.resolve(__dirname, 'wallet');

async function getContract(identity = 'appUser') {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identityExists = await wallet.get(identity);
    if (!identityExists) {
        throw new Error(`Identity ${identity} not found in wallet. Enroll user or import credentials.`);
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity, discovery: { enabled: true, asLocalhost: true } });

    const network = await gateway.getNetwork('ayurchannel');
    const contract = network.getContract('ayurtrace'); // chaincode name used during deploy
    return { contract, gateway };
}

module.exports = { getContract };
