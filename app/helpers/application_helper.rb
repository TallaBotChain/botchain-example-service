module ApplicationHelper

  def js_config
    config = {
      current_user: current_user ? current_user.email : '',
      eth_address: current_user ? current_user.eth_address : nil,
      encrypted_mnemonic: current_user ? current_user.encrypted_mnemonic : nil,
      geth_rpc: Rails.application.config.x.geth_rpc,
      recaptcha_key: Rails.application.config.x.recaptcha_key,
      gas_price: Rails.application.config.x.gas_price,
      coinbase_price_api_url: Rails.application.config.x.coinbase_price_api_url,
      etherscan_api_key: Rails.application.config.x.etherscan_api_key,
      etherscan_api_url: Rails.application.config.x.etherscan_api_url,
      eth_networks: Rails.application.config_for(:eth_networks)
    }
    javascript_tag("window.app_config=#{config.to_json};")
  end

end
