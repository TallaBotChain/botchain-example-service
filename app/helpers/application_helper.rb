module ApplicationHelper

  def js_config
    config = {
      current_user: current_user ? current_user.email : '',
      eth_address: current_user ? current_user.eth_address : nil,
      encrypted_mnemonic: current_user ? current_user.encrypted_mnemonic : nil,
      geth_rpc: Rails.application.config.x.geth_rpc,
      recaptcha_key: Rails.application.credentials.recaptcha_key,
      botcoin_contract: Rails.application.config.x.botcoin_contract,
      developer_registry_contract: Rails.application.config.x.developer_registry_contract,
      curation_council_contract: Rails.application.config.x.curation_council_contract,
      gas_price: Rails.application.config.x.gas_price,
      coinbase_price_api_url: Rails.application.config.x.coinbase_price_api_url,
      etherscan_api_key: Rails.application.config.x.etherscan_api_key,
      etherscan_api_url: Rails.application.config.x.etherscan_api_url
    }
    javascript_tag("window.app_config=#{config.to_json};")
  end

end
