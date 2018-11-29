class RegistrationStatusMailer < ApplicationMailer

  def developer_approved
    @user = params[:user]
    mail(to: @user.email, subject: 'Developer registration approved')
  end

  def developer_rejected
    @user = params[:user]
    mail(to: @user.email, subject: 'Developer registration denied')
  end
end
