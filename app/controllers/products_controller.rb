class ProductsController < ApplicationController
  before_action :require_login

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
