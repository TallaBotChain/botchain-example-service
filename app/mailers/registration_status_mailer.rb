class RegistrationStatusMailer < ApplicationMailer

  def developer_approved
    @user = params[:user]
    mail(to: @user.email, subject: 'BotChain Developer Registration Approved')
  end

  def developer_rejected
    @user = params[:user]
    mail(to: @user.email, subject: 'BotChain Developer Registration Denied')
  end
end
