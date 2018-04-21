# frozen_string_literal: true
require 'rest-client'
class ApiCall
  def initialize(service)
    @service = service
  end

  def authenticate(email, password, token = nil)

    response = RestClient.post "#{@service.base_url}#{@service.login_api}", email: email, password: password, token: token
    if response.code == 200
      result = JSON.parse(response.body)
      return [result['auth_token'], result['user']]
    end
    return nil
  rescue => e
    Rails.logger.error("Can't parse authorization response, #{e.inspect}")
    return nil

  end
end
