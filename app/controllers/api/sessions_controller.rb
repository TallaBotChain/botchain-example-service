class Api::SessionsController < Clearance::SessionsController
  before_action :require_login

  def check
    render json: { user: current_user.as_json(only: [:email, :eth_address, :encrypted_mnemonic])}
  end

  def destroy
    sign_out
    render json: :ok
  end

end
