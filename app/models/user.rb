class User < ApplicationRecord
  include Clearance::User
  has_many :products
  has_many :registrations

  enum registration_status: [:not_approved, :approved, :rejected]

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, confirmation: true, length: { minimum: 8 }
  validates_acceptance_of :age

  def as_json(options={})
    super({:only => [:email, :eth_address, :developer_entry_id, :registration_vote_final_block, :registration_status]})
  end
end
