# config/initializers/recaptcha.rb
Recaptcha.configure do |config|
  config.site_key = Rails.application.config.x.recaptcha_key
  config.secret_key = Rails.application.config.x.recaptcha_secret
end
