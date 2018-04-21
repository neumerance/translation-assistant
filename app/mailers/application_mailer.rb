# frozen_string_literal: true
class ApplicationMailer < ActionMailer::Base
  default from: 'info@migration.icanlocalize.com'
  layout 'mailer'
end
