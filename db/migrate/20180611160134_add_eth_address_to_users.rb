class AddEthAddressToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :eth_address, :string
  end
end
