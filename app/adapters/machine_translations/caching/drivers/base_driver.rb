module MachineTranslations
  module Caching
    module Drivers
      class BaseDriver
        def read(from_lang:, to_lang:, original_text:)
          raise NotImplementedError
        end

        def write(from_lang:, to_lang:, original_text:, translated_text:)
          raise NotImplementedError
        end

        def fetch(from_lang:, to_lang:, original_text:)
          value = read(from_lang: from_lang, to_lang: to_lang, original_text: original_text)
          if value.nil?
            value = yield
            if value
              write(from_lang: from_lang, to_lang: to_lang, original_text: original_text, translated_text: value)
            end
          end
          value
        end

        private

        def build_key(from_lang, to_lang, original_text)
          hash = Digest::MD5.hexdigest(original_text)
          "#{from_lang}-#{to_lang}-#{hash}"
        end
      end
    end
  end
end
