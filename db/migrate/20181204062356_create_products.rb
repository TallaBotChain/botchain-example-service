class CreateProducts < ActiveRecord::Migration[5.2]
  def change
    create_table :products do |t|
      t.references :user, foreign_key: true
      t.string :eth_address, null: false, default: ""
      t.string :name, null: false, default: ""
      t.string :create_bot_product_tx, null: false, default: ""

      t.timestamps
    end
  end
end
