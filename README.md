# BotChain example service

Example of a service website that allows end-users to register with BotChain.
This example contains simplified wallet build-in and doesn't require any external Ethereum wallet in order to use this service.

## Setup

### Dependencies

This project is a standard Ruby on Rails application with Webpack.

* [Ruby 2.4.2](https://www.ruby-lang.org/en/)
* [Rails 5.2](https://rubyonrails.org/)
* [PostgreSQL 9.6](https://www.postgresql.org/)
* [NodeJS 8](https://nodejs.org/en/)
* [yarn](https://yarnpkg.com/lang/en/)

### Quick start

```
$ git clone https://github.com/TallaBotChain/botchain-example-service.git
$ cd botchain-example-service
$ bundle install
$ yarn install
$ rm config/credentials.yml.enc
$ bin/rails credentials:edit
$ bin/rails db:create
$ bin/rails db:migrate
$ bin/webpack-dev-server
$ bin/rails server
```

Now open http://localhost:3000 and use example service.

## Overview

This example application is build using React/Redux and uses Rails as a backend for user accounts management. Interactions with smart contracts are performed on a client side. We don't store unencrypted mnemonic or private key on the server.

### Mnemonic passphrase

During user registration process we generate backup mnemonic (see [BIP39](https://www.npmjs.com/package/bip39)). This passphrase will be encrypted using AES encryption with users password in the browser before sending this backup passphrase to the server (for storage purpose only).

Example passphrase:
```
gather ecology upgrade quote broccoli crumble off betray glow gaze display long
```

### Private key

In order to sign Ethereum transaction, a user needs a private key to be created. We use mnemonic passphrase as a seed to generate a private key. This way safe storage of mnemonic passphrase guarantees access to a private key. In this example application, we don't transmit private key encrypted or unencrypted outside user's browser.

The private key creation and storage are hidden from end-user. There is no way to export or import a private key.

### Developer registration

This example uses [Kovan testnet](https://kovan-testnet.github.io/website/).

Developer registration workflow consists of several steps:
1. BotChain registration service checks developer's balance and shows alert message
in case wallet does not have enough ETH or BOT token to pay for registration transactions
2. Developer enters relevant information that is externally verifiable in to the BotChain Registration Service
3. BotChain Registration service constructs the JSON file and stores the file in IPFS
4. In case registration price is more than 0 BOT, service gets approval of future withdrawal of BOT ERC20 token from user's account. If registration price is 0 BOT, this step will be skipped in UI.
5. Add developer transaction which saves information into [BotChain Developer Registry](https://github.com/TallaBotChain/botchain).
6. Create Registration Vote in Curation Council smart contract to approve developer registration by Curation Council.

Since any transaction on Ethereum network consumes a certain amount of gas, the user should have both BOT tokens and ETH.

You can get some Kovan Ether for free using [this faucet](https://gitter.im/kovan-testnet/faucet).

### Wallet

This example provides following wallet features:
* Balance of ETH and BOT tokens
* Transfer of ETH and BOT tokens

### External services and APIs
In this example we use few external services:
- reCAPTCHA for new user registration;
- Etherscan to show transaction in wallet fast;

For your useability we've added credentials for these services in `config/environments/development.rb`

**IMPORTANT WARNING!** You must not use these credentials in production for real app! Also, you shouldn't put credentials in these files in real app, and they shouldn't get into your VCS in plane text. Use file `credentials.yml.enc` instead. You can read more in [Rails 5.2 credentials](https://medium.com/cedarcode/rails-5-2-credentials-9b3324851336)

You can get your personal keys here:
- [reCAPTCHA](https://www.google.com/recaptcha/)
- [Etherscan](https://etherscan.io/myapikey)

### Security considerations

While this example is considered somewhat secure. We do store an unencrypted private key in browser's LocalStorage for the sake of simplicity, which should not be done in production environment. We also use the same number for AES-CTR encryption counter and recommend to use a different approach in production environment.
