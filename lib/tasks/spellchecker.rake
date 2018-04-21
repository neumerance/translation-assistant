# frozen_string_literal: true
require 'open3'

namespace :webta_spellchecker do
  desc 'This is will install all spellchecker dictionaries'
  task install: :environment do
    puts '==== THIS WILL TAKE LONG HAVE PATIENCE ===='
    Open3.popen3('sudo apt-get install aspell php5.6-pspell') do |_stdin, stdout, _stderr|
      puts 'Installing: aspell'
      puts stdout.read
    end

    languages = ['af', 'am', 'ar', 'az', 'be', 'bg', 'bho', 'bn', 'bs', 'ca', 'cs', 'cu', 'cy', 'da', 'de', 'dr', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'ga', 'gd', 'ha', 'hau', 'he', 'hi', 'hr', 'hu', 'hy', 'id', 'is', 'it', 'ja', 'ka', 'kh', 'kk-KK', 'kn', 'ko', 'ku', 'la', 'lg', 'lt', 'lv', 'mk', 'ml', 'mm', 'mn', 'mo', 'mr', 'ms', 'mt', 'nb', 'ne', 'nl', 'pa', 'pl', 'pt-BR', 'pt-PT', 'qu', 'ro', 'ru', 'sl', 'sn', 'so', 'sq', 'sr', 'sv', 'sw', 'ta', 'te', 'th', 'ti', 'tl_PH', 'tr', 'uk', 'ur', 'uz', 'vi', 'yi', 'yr', 'zh-CN', 'zh-HK', 'zu', 'zh-Hans', 'zh-Hant']

    languages.each do |lang|
      puts "Installing: #{lang}"
      Open3.popen3("sudo apt-get install aspell-#{lang}") do |_stdin, stdout, _stderr|
        puts stdout.read
      end
    end
  end
end
