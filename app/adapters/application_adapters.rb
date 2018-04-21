class ApplicationAdapters
  class << self
    def config
      file_name = Rails.env.include?('ate') ? 'ate' : 'icl'
      @config ||= YAML.safe_load(ERB.new(File.read("config/application_adapters/#{file_name}.yml")).result)
    end
  end
end
