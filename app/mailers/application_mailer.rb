class ApplicationMailer < ActionMailer::Base
  default from: Rails.application.credentials[Rails.env.to_sym][:smtp_user]
  layout 'mailer'
end
