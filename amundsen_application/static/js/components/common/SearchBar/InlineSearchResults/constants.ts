import { ResourceType } from 'interfaces/Resources';
import { getDisplayNameByResource } from 'config/config-utils';

export const DATASETS = getDisplayNameByResource(ResourceType.table);
export const DATASETS_ITEM_TEXT = `in ${DATASETS}`;

export const USERS = getDisplayNameByResource(ResourceType.user);
export const USER_ITEM_TEXT = `in ${USERS}`;

export const DASHBOARDS = getDisplayNameByResource(ResourceType.dashboard);
export const DASHBOARD_ITEM_TEXT = `in ${DASHBOARDS}`;

export const POST_COMMENTS = getDisplayNameByResource(ResourceType.post_comment);
export const POST_COMMENT_ITEM_TEXT = `in ${POST_COMMENTS}`;

export const PEOPLE = getDisplayNameByResource(ResourceType.person);
export const PERSON_ITEM_TEXT = `in ${PEOPLE}`;

export const PEOPLE_USER_TYPE = 'User';
export const USER_ICON_CLASS = 'icon-users';

export const DASHBOARD_ICON_CLASS = 'icon-dashboard';

export const RESULT_LIST_FOOTER_PREFIX = 'See all';
export const RESULT_LIST_FOOTER_SUFFIX = 'results';

export const SEARCH_ITEM_NO_RESULTS = 'No results found';
