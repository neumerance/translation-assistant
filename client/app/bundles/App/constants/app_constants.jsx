import { CleanLocalizationClient as t } from '../components/clean_localization/client';

export const INPROGRESS = 4;
export const REVIEW_INPROGRESS = 5;
export const COMPLETED = 6;
export const CMS_STATUSES  = {};
CMS_STATUSES[INPROGRESS] = t.t('cms.footer.status.in_progress');
CMS_STATUSES[REVIEW_INPROGRESS] = t.t('cms.footer.status.review_in_progress');
CMS_STATUSES[COMPLETED] = t.t('cms.footer.status.completed');
export const ENABLE_MACHINE_TRANSLATION = true;