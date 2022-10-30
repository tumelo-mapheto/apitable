export * from '../user/url.auth';
export * from '../user/url.user';
export * from '../space/url.space';
export * from '../space/url.node';
export * from '../enterprise/url.enterprise';
export * from '../org/url.org';
export * from '../space/url.template';
export * from '../widget/url.widget';
export * from '../database/url.data';
export * from '../space/url.notification';
export * from '../enterprise/url.billing';
export * from '../space/url.appstore';

/**
 * Main API URL Address
 */
export const BASE_URL = '/api/v1';

/**
 * Upload attachments
 */
export const UPLOAD_ATTACH = '/base/attach/upload';

/**
 * The url to get attachment preview
 */
export const OFFICE_PREVIEW = '/base/attach/officePreview/:spaceId';

// Space Station - Get a list of third-party apps SINGLE_APP_INSTANCE
export const GET_MARKETPLACE_APPS = '/marketplace/integration/space/:spaceId/apps';

// space station - start the application
export const APP_ENABLE = '/marketplace/integration/space/:spaceId/app/:appId/open';
// space station - close the app
export const APP_DISABLE = 'marketplace/integration/space/:spaceId/app/:appId/stop';

// =============== V code =======================
export const CODE_EXCHANGE = '/vcode/exchange/';

// =============== player related =======================

// ================ Risk control related =======================
// Content risk control
export const CREATE_REPORTS = '/censor/createReports';
// ================ Risk control related =======================

// Get the experimental features that are enabled
export const GET_LABS_FEATURE = 'user/labs/features';
// Get a list of experimental features
export const GET_LABS_FEATURE_LIST = 'labs/features';

// Get URL related information, used for URL column identification
export const GET_URL_META = '/internal/field/url/awareContent';
export const GET_URL_META_BATCH = '/internal/field/url/awareContents';

// Attachment direct upload
export const UPLOAD_PRESIGNED_URL = '/asset/upload/preSignedUrl';
export const UPLOAD_CALLBACK = 'asset/upload/callback';

// ============ Character related end =====================//
