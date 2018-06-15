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
	    urlshortener_api_key: Rails.application.config.x.urlshortener_api_key,
      gas_price: Rails.application.config.x.gas_price
    }
    javascript_tag("window.app_config=#{config.to_json};")
  end

end
