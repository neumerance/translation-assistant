require 'rails_helper'

describe DashboardController, type: :controller do
  render_views

  describe '#index' do
    before do
      allow(controller).to receive(:authenticated?) { 'token' }
      get :index
    end

    subject { response }

    it { is_expected.to be_success }
  end
end
