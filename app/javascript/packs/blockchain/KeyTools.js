import Web3 from 'web3'
import EthereumHDKey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import aes from 'aes-js'
import createHash from 'create-hash'

class KeyTools {
    constructor(rpcUrl) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    }

    generateEncryptedMnemonic(password) {
        let plainMnemonic = bip39.generateMnemonic();
        console.log("mnemonic: ", plainMnemonic);
        let pk0 = this.privateKeyFromMnemonic(plainMnemonic);
        console.log("pk0: ", pk0);
        let encryptionKey = this.encryptionKeyFromPassword(password);
        console.log("encryption key: ", encryptionKey);
        let encryptedMnemonic = this.aesEncrypt(plainMnemonic, encryptionKey);
        console.log("encrypted mnemonic: ", encryptedMnemonic);
        let decryptedMnemonic = this.aesDecrypt(encryptedMnemonic, encryptionKey);
        console.log("decrypted mnemonic: ", decryptedMnemonic);
        let pk = this.privateKeyFromMnemonic(decryptedMnemonic);
        console.log("pk: ", pk);
        this.encryptAndSave(pk, password); // this is going to happen on successful login
    }

    encryptionKeyFromPassword(password) {
        let hash = createHash("sha256");
        hash.update(password);
        return hash.digest();
    }

    aesEncrypt(payload, key) {
        var payloadBytes = aes.utils.utf8.toBytes(payload);
        var aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(42));
        var encryptedBytes = aesCtr.encrypt(payloadBytes);
        var encryptedHex = aes.utils.hex.fromBytes(encryptedBytes);
        return encryptedHex;
    }

    aesDecrypt(encryptedHex, key) {
        var encryptedBytes = aes.utils.hex.toBytes(encryptedHex);
        var aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(42));
        var decryptedBytes = aesCtr.decrypt(encryptedBytes);
        return aes.utils.utf8.fromBytes(decryptedBytes);
    }

    privateKeyFromMnemonic(mnemonic) {
        let hdkey = EthereumHDKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
        let walletPath = "m/44'/60'/0'/0/";
        let wallet = hdkey.derivePath(walletPath + "0").getWallet();
        let address = "0x" + wallet.getAddress().toString("hex");
        console.log("address: ", address);
        return "0x"+wallet.getPrivateKey().toString("hex");
    }

    get walletStorageKey() {
        return "botcoin"; // TODO: recommended to have different per user
    }

    set privateKey(pk) {
        this.web3.eth.accounts.wallet.clear();
        this.web3.eth.accounts.wallet.add(pk);
    }

    encryptAndSave(pk, password) {
        this.privateKey = pk;
        this.web3.eth.accounts.wallet.save(password, this.walletStorageKey);
    }

    decryptAndLoad(password) {
        this.web3.eth.accounts.wallet.load(password, this.walletStorageKey);
    }
}
export default KeyTools;
