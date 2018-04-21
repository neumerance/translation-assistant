server '', user: 'ubuntu', roles: %w(app web)
server '', user: 'ubuntu', roles: %w(app web)
server '', user: 'ubuntu', roles: %w(app db web)

set :application, 'ate-editor'
set :repo_url, 'put_repo_url_here'

set :deploy_to, '~/rails_apps/ate-editor'

# set :branch, 'master'
set :branch, 'release'

set :rvm_ruby_version, '2.3.1@editor'

namespace :deploy do
  task :compile_webpack do
    on roles(:app), in: :sequence, wait: 5 do
      within "#{fetch(:release_path)}/client" do
        with rails_env: :ate_production do
          execute :sh, '-c "yarn --ignore-engines"'
          execute :rake, 'react_on_rails:locale'
          execute :yarn, '--ignore-engines run build:production'
        end
      end
    end
  end

  task :update_config_file do
    on roles(:app) do
      execute "git archive --remote=ssh://git_url_here:10022/icl-upgrade/icl-secrets.git HEAD webta/ate-production/application.yml | tar -xO > #{deploy_to}/shared/config/application.yml"
    end
  end

end

before :deploy, 'deploy:update_config_file'
before 'deploy:assets:precompile', 'deploy:compile_webpack'

# set :ssh_options,    keys: %w(~/.ssh/id_temp_01),
#     forward_agent: true,
#     auth_methods: %w(publickey)
