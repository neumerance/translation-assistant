class ActivitiesController < ApplicationController

  skip_before_action :verify_authenticity_token

  def create
    params[:activities].each do |activity|
      activity[:tag] ||= :analytics
      activity[:host] = "webta-#{Rails.env}"
      activity[:version] = 1
      start_time = activity[:created_at]
      end_time = activity[:updated_at]
      activity[:duration] = (end_time.to_time - start_time.to_time) if end_time.present? && start_time.present?
      Rails.logger.info activity.as_json
    end
    render json: { status: 200, data: params[:activities] }
  rescue => e
    render json: { error: e }
  end

end
