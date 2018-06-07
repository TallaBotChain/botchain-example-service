class AddEncryptedMnemonicToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :encrypted_mnemonic, :text
  end
end
