module MachineTranslations
  module MicrosoftTranslator
    module Requests
      class Get
        HOST = 'https://api.microsofttranslator.com/V2/Http.svc/'.freeze

        def initialize(path, params)
          @path = path
          @params = params
        end

        def process
          request = Net::HTTP::Get.new(uri)
          request['Ocp-Apim-Subscription-Key'] = Config.api_key

          Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
            http.request(request)
          end
        end

        private

        def uri
          @uri ||= URI(host + @path + '?' + URI.encode_www_form(@params))
        end

        def host
          HOST
        end
      end
    end
  end
end
