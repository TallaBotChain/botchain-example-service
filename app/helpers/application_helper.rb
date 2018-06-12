module ApplicationHelper

  def js_config
    config = {
      current_user: current_user ? current_user.email : '',
      eth_address: current_user ? current_user.eth_address : nil,
      encrypted_mnemonic: current_user ? current_user.encrypted_mnemonic : nil,
      geth_rpc: Rails.application.config.x.geth_rpc,
      recaptcha_key: Rails.application.credentials.recaptcha_key,
      botcoin_contract: Rails.application.config.x.botcoin_contract
    }
    javascript_tag("window.app_config=#{config.to_json};")
  end

end
