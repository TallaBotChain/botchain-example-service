# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_01_10_114103) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "products", force: :cascade do |t|
    t.bigint "user_id"
    t.string "eth_address", default: "", null: false
    t.string "name", default: "", null: false
    t.string "create_bot_product_tx", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "network_id"
    t.index ["network_id"], name: "index_products_on_network_id"
    t.index ["user_id"], name: "index_products_on_user_id"
  end

  create_table "registrations", force: :cascade do |t|
    t.bigint "user_id"
    t.integer "network_id"
    t.integer "entry_id", default: 0
    t.integer "vote_final_block"
    t.integer "status", default: 0
    t.boolean "status_was_sent", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["status_was_sent"], name: "index_registrations_on_status_was_sent"
    t.index ["user_id", "network_id"], name: "index_registrations_on_user_id_and_network_id", unique: true
    t.index ["user_id"], name: "index_registrations_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", null: false
    t.string "encrypted_password", limit: 128, null: false
    t.string "confirmation_token", limit: 128
    t.string "remember_token", limit: 128, null: false
    t.string "name"
    t.text "encrypted_mnemonic"
    t.string "eth_address"
    t.integer "developer_entry_id", default: 0
    t.integer "registration_vote_final_block"
    t.integer "registration_status", default: 0
    t.boolean "registration_status_was_sent", default: false
    t.index ["email"], name: "index_users_on_email"
    t.index ["remember_token"], name: "index_users_on_remember_token"
  end

  add_foreign_key "products", "users"
  add_foreign_key "registrations", "users"
end
