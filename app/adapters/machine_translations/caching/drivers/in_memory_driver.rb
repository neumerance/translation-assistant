module MachineTranslations
  module Caching
    module Drivers
      class InMemoryDriver < BaseDriver
        def read(from_lang:, to_lang:, original_text:)
          key = build_key(from_lang, to_lang, original_text)
          self.class.store[key]
        end

        def write(from_lang:, to_lang:, original_text:, translated_text:)
          key = build_key(from_lang, to_lang, original_text)
          self.class.store[key] = translated_text
        end

        class << self
          def store
            @store ||= {}
          end
        end
      end
    end
  end
end
