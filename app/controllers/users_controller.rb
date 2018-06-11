class UsersController < Clearance::UsersController

  def new
    render html: '', layout: 'botchain'
  end

  def create
    @user = user_from_params
    if verify_recaptcha(model: @user) && @user.save
      sign_in @user
      render json: { current_user: @user.email }
    else
      render json: { errors: errors_to_array(@user.errors) }
    end
  end

  private

  def errors_to_array(errors)
    errors.map { |key,value| "#{key} #{value}" }.uniq
  end

  def user_from_params
    Clearance.configuration.user_model.new(user_params)
  end

  def user_params
    params.permit(:name, :email, :password, :password_confirmation, :age, :encrypted_mnemonic, :eth_address)
  end

end
