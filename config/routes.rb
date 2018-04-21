# frozen_string_literal: true
Rails.application.routes.draw do
  get '/dashboard', to: 'dashboard#index'
  root 'home#index'
  post 'home/login', to: 'home#login'
  post 'home/logout', to: 'home#logout', as: :logout
  get 'home/index', to: 'home#index'
  get '/language/mappings', to: 'home#language_mappings'
  get '/translate/job/:id/auth/:token/service/:service/:type', to: 'home#login_with_token'
  get '/translate/dashboard/auth/:token/service/:service', to: 'home#login_with_token'
  resources :activities, only: [:create]
  post '/machine_translation/translate', to: 'machine_translations#translate'
  post '/webta-spellchecker/spellcheck', to: 'webta_spellchecker#spellcheck'
  match '*a', to: 'application#routing', via: :get
end
