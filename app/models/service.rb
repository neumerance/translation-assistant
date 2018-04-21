class Service
  attr_accessor :id, :name, :base_url, :login_api

  def initialize(service_id)
    @id = Service.valid_service_id(service_id)
    @name = self.class.services[@id][:name]
    @base_url = self.class.services[@id][:base_url]
    @login_api = self.class.services[@id][:login_api]
  end

  class << self
    def services
      @services ||= begin
        if Rails.env.development? || Rails.env.staging? || Rails.env.qa?
          data = YAML.safe_load(File.read(Rails.root.join('config/application.yml').to_s))
          data.values.map { |item| build_service(item) }.to_h
        else
          primary_service
        end
      end
    end

    def valid_service_id(service_id)
      valid_service_id = service_id if service_id.present? && self.services.keys.include?(service_id)
      if valid_service_id
        return valid_service_id
      else
        return DEFAULT_SERVICE[Rails.env.to_sym]
      end
    end

    def get_valid_service(_service_id)
      valid_service_id = valid_service_id
      if valid_service_id
        return self.services[valid_service_id]
      else
        return self.services[DEFAULT_SERVICE[Rails.env.to_sym]]
      end
    end

    private

    def build_service(item)
      key = item['service_key']

      value = {
        name: item['service_name'],
        base_url: item['service_base_url'],
        login_api: item['service_login_api']
      }

      [key, value]
    end

    def primary_service
      {
        Figaro.env.service_label => {
          name: Figaro.env.service_name,
          base_url: Figaro.env.service_base_url,
          login_api: Figaro.env.service_login_api
        }
      }
    end
  end
end
