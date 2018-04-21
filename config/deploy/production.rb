# frozen_string_literal: true
server '', user: 'icl', roles: %w(app db web) # stg

set :branch, 'release'

set :deploy_to, '~/rails_apps/ta'

set :application, 'webta'
set :repo_url, 'put_repo_url_here'

set :keep_releases, 50
set :rvm_type, :user
set :rvm_ruby_version, '2.3.1@ta'

namespace :deploy do
  task :compile_webpack do
    on roles(:app), in: :sequence, wait: 5 do
      within "#{fetch(:release_path)}/client" do
        with rails_env: :production do
          execute :sh, '-c yarn --ignore-engines'
          execute :rake, 'react_on_rails:locale'
          execute :yarn, 'run build:production'
        end
      end
    end
  end

  task :update_config_file do
    on roles(:app) do
      execute "git archive --remote=ssh://git_url_here/icl-upgrade/icl-secrets.git HEAD webta/production/application.yml | tar -xO > #{deploy_to}/shared/config/application.yml"
    end
  end

end

before :deploy, 'deploy:update_config_file'

before 'deploy:assets:precompile', 'deploy:compile_webpack'

# set :ssh_options,    keys: %w(~/.ssh/id_temp_01),
#     forward_agent: true,
#     auth_methods: %w(publickey)
