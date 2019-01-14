class AddNetworkIdToProducts < ActiveRecord::Migration[5.2]
  def change
    add_column :products, :network_id, :integer

    add_index :products, :network_id

    Product.all.update_all({network_id: Rails.application.config_for(:eth_networks)['networks']['kovan']['network_id']})
  end
end
