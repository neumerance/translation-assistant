# frozen_string_literal: true
# used to enable/disable backend API selector
ENVS_WITH_SELECTOR = %w(development qa).freeze

DEFAULT_SERVICE = {
  development: Figaro.env.service_label,
  qa: Figaro.env.service_label,
  staging: Figaro.env.service_label,
  production: Figaro.env.service_label
}.freeze

# activity tracker constants
SPELLCHECKER_TURNED_ON = 0
SPELLCHECKER_TURNED_OFF = 1
SENTENCE_ACTIVITY = 2
SENTENCE_FEEDBACK = 3
CMS_JOB_ACTIVITY = 4

# activity project types
CMS_JOBS = 1
IT_JOBS = 2
