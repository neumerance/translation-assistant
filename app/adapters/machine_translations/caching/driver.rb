module MachineTranslations
  module Caching
    class Driver
      OPTIONS = {
        redis: Drivers::RedisDriver,
        in_memory: Drivers::InMemoryDriver
      }.freeze

      class << self
        def get(type)
          OPTIONS[type].new
        end

        def best_connected_driver
          OPTIONS.keys.each do |type|
            driver = get(type)
            return driver if connected?(driver)
          end
        end

        private

        def connected?(driver)
          test_key = 'WebTA-key'
          test_val = 'WebTA-value'

          opts = { from_lang: 'test', to_lang: 'test', original_text: test_key }
          driver.write(opts.merge(translated_text: test_val))
          result = driver.read(opts)

          test_val == result
        rescue StandardError => ex
          Rails.logger.error(ex.message)
          false
        end
      end
    end
  end
end
