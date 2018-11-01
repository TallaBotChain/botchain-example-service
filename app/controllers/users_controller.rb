class UsersController < Clearance::UsersController

  before_action :require_login, only: [:update]

  def new
    render html: '', layout: 'application'
  end

  def create
    @user = user_from_params
    if @user.valid? && verify_recaptcha(model: @user) && @user.save
      sign_in @user
      render json: { current_user: @user.email }
    else
      render json: { errors: errors_to_array(@user.errors) }
    end
  end

  def update
    @user = current_user
    if @user.authenticated?(params[:current_password])
      if @user.update(password: params[:password], password_confirmation: params[:password_confirmation], encrypted_mnemonic: params[:encrypted_mnemonic])
         #sign_in @user
         return render json: { current_user: @user.email, encrypted_mnemonic: @user.encrypted_mnemonic }
      end
    else
      @user.errors.add(:password, :invalid)
    end

    render json: { errors: errors_to_array(@user.errors) }
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
