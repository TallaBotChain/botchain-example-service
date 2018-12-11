class Product < ApplicationRecord
  belongs_to :user

  validates :name, :eth_address, :create_bot_product_tx, presence: true

  def as_json(options={})
    super({:only => [:eth_address, :name, :create_bot_product_tx, :created_at]})
  end
end
