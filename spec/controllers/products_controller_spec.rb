require 'rails_helper'

RSpec.describe ProductsController, type: :controller do

  describe "GET #create" do
    context 'not authenticated' do
      it "returns http 302" do
        post :create
        expect(response).to have_http_status(302)
      end
    end

    context 'authenticated' do
      before do
        sign_in
      end
      it "returns http success" do
        post :create, params: {product: {eth_address: '0x0000', name: 'new bot', create_bot_product_tx: '0x0000'}}
        json = JSON.parse(response.body)
        expect(response).to have_http_status(:success)
        expect(json['products'].count).to eq(1)
      end
    end
  end

end
