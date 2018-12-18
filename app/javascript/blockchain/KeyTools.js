import Web3 from 'web3'
import EthereumHDKey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import aes from 'aes-js'
import createHash from 'create-hash'

class KeyTools {
  /** @constructor
   * @param rpcUrl - geth/parity RPC URL, most likely Infura
   **/
  constructor(rpcUrl) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    if( this.savedPK ) this.privateKey = this.savedPK;
  }

  /** Returns user address */
  get address() {
    return this.web3.eth.accounts.wallet[0].address;
  }

  /**
   * Generates mnemonic and encrypt it with password
   * @param password - plain password string
   */
  generateEncryptedMnemonic(password) {
    let plainMnemonic = bip39.generateMnemonic();
    let pk = this.privateKeyFromMnemonic(plainMnemonic);
    this.encryptAndSave(pk, password);
    let encryptedMnemonic = this.encryptMnemonic(plainMnemonic, password);
    return encryptedMnemonic;
  }

  /**
   * Applies encrypted mnemonic phrase
   * @param encryptedMnemonic - encrypted mnemonic phrase
   * @param password - plain password string
   */
  applyEncryptedMnemonic(encryptedMnemonic, password) {
    let decryptedMnemonic = this.decryptMnemonic(encryptedMnemonic, password);
    console.log("decrypted mnemonic: ", decryptedMnemonic);
    let pk = this.privateKeyFromMnemonic(decryptedMnemonic);
    this.encryptAndSave(pk, password);
  }

  /**
   * Encrypt mnemonic
   * @param mnemonic - plain mnemonic
   * @param password - plain password
   */
  encryptMnemonic(mnemonic, password) {
    let encryptionKey = this.encryptionKeyFromPassword(password);
    let encryptedMnemonic = this.aesEncrypt(mnemonic, encryptionKey);
    return encryptedMnemonic;
  }

  /**
   * Decrypt mnemonic
   * @param mnemonic - encrypted mnemonic
   * @param password - plain password
   */
  decryptMnemonic(mnemonic, password) {
    let encryptionKey = this.encryptionKeyFromPassword(password);
    let decryptedMnemonic = this.aesDecrypt(mnemonic, encryptionKey);
    return decryptedMnemonic;
  }

  /**
   * Gets encryption key from password
   * @param password - plain password
   */
  encryptionKeyFromPassword(password) {
    let hash = createHash("sha256");
    hash.update(password);
    return hash.digest();
  }

  /**
   * process AES encrypt
   * @param payload - mnemonic for encrypt
   * @param key - encryption key
   */
  aesEncrypt(payload, key) {
    let payloadBytes = aes.utils.utf8.toBytes(payload);
    let aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(42));
    let encryptedBytes = aesCtr.encrypt(payloadBytes);
    let encryptedHex = aes.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
  }

  /**
   * process AES decrypt
   * @param encryptedHex - encrypted mnemonic
   * @param key - decryption key
   */
  aesDecrypt(encryptedHex, key) {
    let encryptedBytes = aes.utils.hex.toBytes(encryptedHex);
    let aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(42));
    let decryptedBytes = aesCtr.decrypt(encryptedBytes);
    let decryptedHex = aes.utils.utf8.fromBytes(decryptedBytes);
    return this.isValidMnemonic(decryptedHex) ? decryptedHex : null
  }

  /**
   * Creates private key from mnemonic passphrase
   * @param mnemonic - plain mnemonic string
   */
  privateKeyFromMnemonic(mnemonic) {
    let hdkey = EthereumHDKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    let walletPath = "m/44'/60'/0'/0/";
    let wallet = hdkey.derivePath(walletPath + "0").getWallet();
    let address = "0x" + wallet.getAddress().toString("hex");
    console.log("address: ", address);
    return "0x"+wallet.getPrivateKey().toString("hex");
  }

  /** Returns localstorage key */
  get walletStorageKey() {
    return "botcoin"; // recommended to have different storage key per user
  }

  /** Sets private key */
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

  /** Imports private key and stores it encrypted with password */
  encryptAndSave(pk, password) {
    this.rememberPK(pk);
    this.privateKey = pk;
    this.web3.eth.accounts.wallet.save(password, this.walletStorageKey);
  }

  /** Decrypts private key and loads from localstorage */
  decryptAndLoad(password) {
    this.web3.eth.accounts.wallet.load(password, this.walletStorageKey);
  }

  /** Checks if mnemonic is valid */
  isValidMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic)
  }
}
export default KeyTools;
