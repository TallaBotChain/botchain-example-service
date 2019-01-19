Rails.application.configure do
  # Verifies that versions and hashed value of the package contents in the project's package.json
  config.webpacker.check_yarn_integrity = true
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join('tmp', 'caching-dev.txt').exist?
    config.action_controller.perform_caching = true

    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  # Store uploaded files on the local file system (see config/storage.yml for options)
  config.active_storage.service = :local

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  config.action_mailer.perform_caching = false

  config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
  config.action_mailer.asset_host = 'http://localhost:3000'
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
      :address => 'smtp.gmail.com',
      :port => 587,
      :domain => ENV['SMTP_DOMAIN'],
      :user_name => ENV['SMTP_USER'],
      :password => ENV['SMTP_PASSWORD'],
      :authentication => 'plain',
      :enable_starttls_auto => true
  }

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Suppress logger output for asset requests.
  config.assets.quiet = true

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker
  config.x.coinbase_price_api_url = "https://api.coinbase.com/v2/prices/ETH-USD/spot"
  config.x.etherscan_api_key = "UI5FHY91GIQ94U6IUDKRGDYS4JWSGGXD24"
  # You mustn't use unencrypted secrets in VCS. It's used here only for quick launch demo app. 
  # Please read more about Rails credentials, for example here https://medium.com/cedarcode/rails-5-2-credentials-9b3324851336
  config.x.recaptcha_key = "6LeJjV0UAAAAAPIJAPaVa4B18NkFGJm-b5f-pKl2"
  config.x.recaptcha_secret = "6LeJjV0UAAAAACMqLMzypPUcP1FGDX_NLATkJVLn"
end
