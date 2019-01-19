Rails.application.routes.draw do
  resource :session, controller: "sessions", only: [:create]
  resources :users, controller: "users", only: [:create, :update]

  get "/sign_in" => "sessions#new", as: "sign_in"
  delete "/sign_out" => "sessions#destroy", as: "sign_out"
  get "/sign_up" => "users#new", as: "sign_up"
  get "/help" => "pages#developer", as: "help"
  get "/about" => "pages#developer", as: "about"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  constraints Clearance::Constraints::SignedIn.new do
    root to: "pages#developer"
    get "/products" => "pages#developer", as: "products"
    get "/products/new" => "pages#developer", as: "products/new"
    get "/settings" => "pages#developer", as: "settings"
    get "/wallet/ethereum" => "pages#developer", as: "wallet/ethereum"
    get "/wallet/botcoin" => "pages#developer", as: "wallet/botcoin"
    namespace :api do
      resources :products, only: [:index, :create]
    end
  end

  constraints Clearance::Constraints::SignedOut.new do
    root to: redirect('/sign_up')
  end

end
