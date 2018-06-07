class UsersController < Clearance::UsersController

  def create
    @user = user_from_params

    if verify_recaptcha(model: @user) && @user.save
      sign_in @user
      redirect_back_or url_after_create
    else
      render template: "users/new"
    end
  end

  private

  def user_from_params
    Clearance.configuration.user_model.new(user_params)
  end

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :age, :encrypted_mnemonic)
  end

end
