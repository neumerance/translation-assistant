module MachineTranslations
  module MicrosoftTranslator
    class Client
      API_ACTION = 'Translate'.freeze
      SUCCESS = '200'.freeze

      def initialize(from_lang:, to_lang:)
        @from_lang = from_lang
        @to_lang = to_lang
      end

      def translate(text:)
        validate_langs!

        value = self.class.cache.fetch(from_lang: @from_lang, to_lang: @to_lang, original_text: text) do
          request = Requests::Get.new(
            API_ACTION,
            from: Language::Mapping.to_ms_iso_format(@from_lang),
            to: Language::Mapping.to_ms_iso_format(@to_lang),
            text: text
          )
          response = request.process
          parse(response) if response.code == SUCCESS
        end

        value || text
      end

      class << self
        def cache
          @cache ||= MachineTranslations::Caching::Driver.best_connected_driver
        end
      end

      private

      def validate_langs!
        raise Errors::Error, "#{@from_lang} is not supported" unless Languages::List.valid_lang?(@from_lang)
        raise Errors::Error, "#{@to_lang} is not supported" unless Languages::List.valid_lang?(@to_lang)
        raise Errors::Error, 'can not translate to same language' if @from_lang == @to_lang
      end

      def parse(response)
        xml = Nokogiri::XML(response.body)
        xml.css('string').map(&:text).join
      end
    end
  end
end
