# frozen_string_literal: true
Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.cache_classes = true

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Disable serving static files from the `/public` folder by default since
  # Apache or NGINX already handles this.
  config.public_file_server.enabled = true # ENV['RAILS_SERVE_STATIC_FILES'].present?

  # Compress JavaScripts and CSS.
  # config.assets.js_compressor = :uglifier
  # config.assets.css_compressor = :sass

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Suppress logger output for asset requests.
  config.assets.quiet = true

  # Do not fallback to assets pipeline if a precompiled asset is missed.
  config.assets.compile = true

  # `config.assets.precompile` and `config.assets.version` have moved to config/initializers/assets.rb

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.action_controller.asset_host = 'http://assets.example.com'

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = 'X-Sendfile' # for Apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for NGINX

  # Mount Action Cable outside main process or domain
  # config.action_cable.mount_path = nil
  # config.action_cable.url = 'wss://example.com/cable'
  # config.action_cable.allowed_request_origins = [ 'http://example.com', /http:\/\/example.*/ ]

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  # config.force_ssl = true

  # Use the lowest log level to ensure availability of diagnostic information
  # when problems arise.
  config.log_level = :debug

  # Prepend all log lines with the following tags.
  config.log_tags = [:request_id]

  # Use a different cache store in production.
  # config.cache_store = :mem_cache_store

  # Use a real queuing backend for Active Job (and separate queues per environment)
  # config.active_job.queue_adapter     = :resque
  # config.active_job.queue_name_prefix = "webta_#{Rails.env}"
  config.action_mailer.perform_caching = false

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.default_url_options = { host: 'qa-ate.wpml.org' }
  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners.
  config.active_support.deprecation = :notify

  # Use default logging formatter so that PID and timestamp are not suppressed.
  config.log_formatter = ::Logger::Formatter.new

  # config.lograge.enabled = true
  # config.lograge.custom_options = lambda do |event|
  #   opts = {
  #       params: event.payload[:params],
  #       time:  %Q('#{event.time}'),
  #       user_type: event.payload[:user_type],
  #       remote_ip: event.payload[:ip],
  #       browser: event.payload[:headers]['HTTP_USER_AGENT'],
  #       referer: event.payload[:headers]['HTTP_REFERER']
  #   }
  #   if event.payload[:exception]
  #     quoted_stacktrace = %Q('#{Array(event.payload[:exception_object].backtrace.select {|bct| bct.starts_with?(Rails.root.to_s)}.map {|err| err.sub(Rails.root.to_s, '')}).to_json}')
  #     opts[:exception_type] = event.payload[:exception][0]
  #     opts[:exception_message] = event.payload[:exception][1]
  #     opts[:stacktrace] = quoted_stacktrace
  #   end
  #   opts
  # end
  #
  # config.lograge.formatter = Lograge::Formatters::KeyValue.new
  # config.logger = GELF::Logger.new("192.168.1.83", 12201, "WAN", { :facility => "ate-#{Rails.env}" })

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false
end
