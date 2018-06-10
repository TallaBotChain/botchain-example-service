module ApplicationHelper

  def js_config
    config = {
      current_user: current_user ? current_user.email : ''
    }
    javascript_tag("window.app_config=#{config.to_json};")
  end

end
