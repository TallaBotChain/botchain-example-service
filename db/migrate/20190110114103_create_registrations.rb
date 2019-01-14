class CreateRegistrations < ActiveRecord::Migration[5.2]
  def change
    create_table :registrations do |t|
      t.references :user, foreign_key: true
      t.integer :network_id
      t.integer :entry_id, default: 0
      t.integer :vote_final_block
      t.integer :status, default: 0
      t.boolean :status_was_sent, default: false

      t.timestamps
    end

    add_index :registrations, [:user_id, :network_id], unique: true
    add_index :registrations, :status_was_sent

    User.find_each do |user|
      user.registrations.find_or_create_by(network_id: Rails.application.config_for(:eth_networks)['networks']['kovan']['network_id']) do |reg|
        reg.entry_id = user.developer_entry_id
        reg.vote_final_block = user.registration_vote_final_block
        reg.status = user.registration_status
        reg.status_was_sent = user.registration_status_was_sent
      end
    end
  end
end
