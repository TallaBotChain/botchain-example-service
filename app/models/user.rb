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
    json = super({:only => [:email, :eth_address]})
    json['registrations'] = registrations_json
    json
  end

  def registrations_json
    reg = {}
    registrations.map{|r| reg[r['network_id']]=r.as_json(only: [:entry_id, :vote_final_block, :status])}
    reg
  end
end
