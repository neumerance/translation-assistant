# frozen_string_literal: true
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  rescue_from ActionController::RoutingError, with: :render_404

  before_action :set_current_user

  helper_method :t, :localization_client

  def routing
    render_404
  end

  def t(key, args = {})
    localization_client.translate(key, args)
  end

  def localization_client
    @localization_client ||= CleanLocalization::Client.new(current_locale)
  end

  private

  def current_locale
    # TODO: validate locale, extend default locale value from user account
    cookies[:locale] || 'en'
  end

  def set_current_user
    @current_user = session[:current_user]
  end

  def render_404(exception = nil)
    Rails.logger.info "Rendering 404: #{exception.message}" if exception
    render file: "#{Rails.root}/public/404.html", status: 404, layout: false
  end

  def authenticate
    redirect_to root_path unless authenticated?
  end

  def authenticated?
    session[:auth_token].present?
  end
end
