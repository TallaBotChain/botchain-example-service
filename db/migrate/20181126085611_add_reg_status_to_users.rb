class AddRegStatusToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :developer_entry_id, :integer
    add_column :users, :registration_vote_final_block, :integer
    add_column :users, :registration_status, :integer, default: 0
    add_column :users, :registration_status_was_sent, :boolean, default: false

  end
end
