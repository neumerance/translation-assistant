module MachineTranslations
  module Caching
    module Drivers
      class RedisDriver < BaseDriver
        def read(from_lang:, to_lang:, original_text:)
          key = build_key(from_lang, to_lang, original_text)
          self.class.store.get(key)
        end

        def write(from_lang:, to_lang:, original_text:, translated_text:)
          key = build_key(from_lang, to_lang, original_text)
          self.class.store.set(key, translated_text)
        end

        class << self
          def settings
            @settings ||= begin
              path = Rails.root.join('config/application.yml')
              content = YAML.safe_load(File.read(path))
              content[Rails.env]['redis_cache_settings']
            rescue
              {}
            end
          end

          def store
            @store ||= Redis.new(settings)
          end
        end
      end
    end
  end
end
