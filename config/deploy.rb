# frozen_string_literal: true
# config valid only for current version of Capistrano
lock '3.8.0'

set :stages, %w(production staging qa ate_production ate_stating ate_qa)

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
set :branch, ENV['BRANCH'] if ENV['BRANCH']

set :deploy_via, :remote_cache
set :scm, 'git'

set :format, :airbrussh
set :format_options, command_output: true, log_file: 'log/capistrano.log', color: :auto, truncate: :auto

set :pty, true

set :passenger_restart_with_touch, true

append :linked_files, 'config/application.yml'
append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/system', 'bin' # , 'public/images/production', 'public/images', 'public/javascripts', 'public/stylesheets'

set :keep_releases, 5
set :rvm_type, :user
