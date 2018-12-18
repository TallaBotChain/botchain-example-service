FactoryBot.define do
  factory :user do
    sequence(:email) {|n| "username#{n}@mailinator.com"}
    password SecureRandom.hex(32)
    remember_token SecureRandom.hex(128)
    sequence(:name) {|n| "username#{n}"}
    encrypted_mnemonic SecureRandom.hex(128)
    eth_address SecureRandom.hex(32)
  end
end
