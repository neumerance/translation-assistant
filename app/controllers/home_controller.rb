# frozen_string_literal: true
class HomeController < ApplicationController
  layout 'login'
  skip_before_action :verify_authenticity_token, only: [:logout]
  before_action :authenticate, except: [:index, :login, :login_with_token]

  def index
    flash[:error] = params[:redirect_message] if params[:redirect_message].present?
  end

  def login
    service = Service.new(params[:service] || Figaro.env.service_key)
    api_call = ApiCall.new service
    auth, user = api_call.authenticate(params[:email], params[:password])
    if auth.present? && user.present?
      session[:auth_token] = auth
      session[:current_user] = user
      session[:service_id] = service.id
      redirect_to controller: :dashboard, action: :index
    else
      flash[:error] = 'Wrong username or password.'
      render :index
    end
  end

  def logout
    session[:auth_token] = nil
    session[:service_id] = nil
    session[:current_user] = nil
    render json: { status: 200 }
  rescue => e
    render json: { error: e.as_json }
  end

  def login_with_token
    @errors = {}
    service = Service.new(params[:service])
    @job_id = params[:id]
    @type = params[:type] || 'translate'
    if @errors.keys.empty?
      api_call = ApiCall.new service
      auth, user = api_call.authenticate(params[:email], params[:password], params[:token])
      session[:auth_token] = auth
      session[:current_user] = user
      session[:service_id] = service.id
    end
    @errors[:authentication] = 'Invalid credentials. Please check your credentials and try again' unless session[:auth_token].present?
    if @errors.keys.empty?
      if @job_id
        redirect_to "/dashboard#/cms/#{@job_id}/#{@type}"
      else
        redirect_to '/dashboard#'
      end
    else
      render :index
    end
  end

  def language_mappings
    render json: Language::Mapping.language_lists
  end
end
