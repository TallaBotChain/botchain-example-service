import BotCoin from '../blockchain/BotCoin';

export const WalletActions = {
  SET_WALLET_ATTRIBUTE: 'SET_WALLET_ATTRIBUTE',
  RESET_STATE: 'WALLET_RESET_STATE'
}

export const setError = (error) => {
    return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: error };
}

const setInProgress = (inProgress) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

const setBallance = (ballance) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'balance', value: ballance }
}

const setTokenBallance = (tokenBalance) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'tokenBalance', value: tokenBalance }
}

export const resetState = () => {
  return { type: WalletActions.RESET_STATE}
}

export const getBalances = (address) => (dispatch) => {
  dispatch(setInProgress(true))
  let botCoin = new BotCoin()
  // ethers
  botCoin.getBalance(address).then((balance)=>{
    dispatch(setBallance(botCoin.web3.utils.fromWei(balance, 'ether')))
  }, (error) => {
    console.log(error)
    dispatch(setBallance(0))
    dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: "Failed to retrieve ballance" })
  });

  // tokens
  botCoin.getTokenBalance(address).then((balance) => {
    dispatch(setTokenBallance(botCoin.web3.utils.fromWei(balance, 'ether')))
    dispatch(setInProgress(false))
  }, (error) => {
    dispatch(setTokenBallance(0))
    dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: "Failed to retrieve token ballance" })
    dispatch(setInProgress(false))
  });
}



export const transferTokens = (to, amount) => (dispatch) => {
  dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'transferCompleted', value: false });
  if(!blockchainConnector.validAddress(to)){
    dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: `${to} is not valid address` })
    return;
  }
  dispatch(setInProgress(true))
  blockchainConnector.transferTokens(to, amount).then(function(result) {
    console.log("Sent tokens",result);
    if( result ) {
      dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: false });
      dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'transferCompleted', value: true });
    }else {
      dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: "Something went wrong" });
    }
    dispatch(setInProgress(false))
  }, function( error ) {
    console.log(error);
    dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: "Transfer failed" });
    dispatch(setInProgress(false))
  });
}
