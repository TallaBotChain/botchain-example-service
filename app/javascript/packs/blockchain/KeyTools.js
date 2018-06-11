import Web3 from 'web3'
import EthereumHDKey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import aes from 'aes-js'
import createHash from 'create-hash'

class KeyTools {
    constructor(rpcUrl) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
        if( this.savedPK ) this.privateKey = this.savedPK;
    }

    get address() {
        return this.web3.eth.accounts.wallet[0].address;
    }

    generateEncryptedMnemonic(password) {
        let plainMnemonic = bip39.generateMnemonic();
        let pk = this.privateKeyFromMnemonic(plainMnemonic);
        this.encryptAndSave(pk, password);
        let encryptionKey = this.encryptionKeyFromPassword(password);
        let encryptedMnemonic = this.aesEncrypt(plainMnemonic, encryptionKey);
        return encryptedMnemonic;
    }

    applyEncryptedMnemonic(encryptedMnemonic, password) {
        let encryptionKey = this.encryptionKeyFromPassword(password);
        let decryptedMnemonic = this.aesDecrypt(encryptedMnemonic, encryptionKey);
        console.log("decrypted mnemonic: ", decryptedMnemonic);
        let pk = this.privateKeyFromMnemonic(decryptedMnemonic);
        this.encryptAndSave(pk, password);
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
        return "botcoin"; // recommended to have different storage key per user
    }

    set privateKey(pk) {
        this.web3.eth.accounts.wallet.clear();
        this.web3.eth.accounts.wallet.add(pk);
    }

    // this is unsafe feature is for demo purpose only
    rememberPK(pk) {
        localStorage.setItem( this.walletStorageKey + "_pk", pk );
    }

    // this is unsafe feature is for demo purpose only
    get savedPK() {
        return localStorage.getItem( this.walletStorageKey + "_pk" );
    }

    encryptAndSave(pk, password) {
        this.rememberPK(pk);
        this.privateKey = pk;
        this.web3.eth.accounts.wallet.save(password, this.walletStorageKey);
    }

    decryptAndLoad(password) {
        this.web3.eth.accounts.wallet.load(password, this.walletStorageKey);
    }
}
export default KeyTools;
