module ApplicationHelper

  def js_config
    config = {
      current_user: current_user ? current_user.email : '',
      geth_rpc: Rails.application.config.x.geth_rpc,
      recaptcha_key: Rails.application.credentials.recaptcha_key
    }
    javascript_tag("window.app_config=#{config.to_json};")
  end

end
