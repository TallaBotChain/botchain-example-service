class Api::ProductsController < ApplicationController
  before_action :require_login

  def index
    products = current_user.products.where(network_id: params[:network_id])
    render json: {products: products.as_json}
  end

  def create
    product = current_user.products.create(product_params)
    if product.valid?
      render json: {products: [product.as_json]}
    else
      render json: {errors: product.errors.full_messages}
    end
    
  end

  private

  def product_params
    params.require(:product).permit(:eth_address, :name, :create_bot_product_tx, :network_id)
  end
end
