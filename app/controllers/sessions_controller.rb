class SessionsController < Clearance::SessionsController
  skip_before_action :verify_authenticity_token, only: [:destroy,:create]

  def new
    render html: '', layout: 'botchain'
  end

  def create
    respond_to do |format|
      format.json do
        @user = authenticate(params)

        sign_in(@user) do |status|
          if status.success?
            next_url = return_to || url_after_create
            render json: { redirect: next_url,
                           encrypted_mnemonic: @user.encrypted_mnemonic,
                           eth_address: @user.eth_address,
                           current_user: @user.email
                         }
          else
            render json: { error: status.failure_message }
          end
        end
      end
    end
  end

end
