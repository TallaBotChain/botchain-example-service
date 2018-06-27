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

Developer registration workflow consists of 2 transactions:

1. Approval of future withdrawal of BOT ERC20 token from user's account.
2. Add developer transaction which saves information into [BotChain Developer Registry](https://github.com/TallaBotChain/botchain).

Second transaction can be performed only when first transaction successfully processed by blockchain. We provide UI to guide a user through this process.

Since any transaction on Ethereum network consumes a certain amount of gas, the user should have both BOT tokens and ETH.

You can get some Kovan Ether for free using [this faucet](https://gitter.im/kovan-testnet/faucet).

### Wallet

This example provides following wallet features:
* Balance of ETH and BOTC tokens
* Transfer of BOTC tokens

### Security considerations

While this example is considered somewhat secure. We do store an unencrypted private key in browser's LocalStorage for the sake of simplicity, which should not be done in production environment. We also use the same number for AES-CTR encryption counter and recommend to use a different approach in production environment.
