import { UserListDTO } from 'src/modules/homepage/user-list/dtos/user-list.dto';

export const SuperAdmin: UserListDTO = {
  userName: 'ADMIN-NEX',
  userPhoto: '',
  personalNumber: '782659',
  personalName: 'ANTONIO SAIFUL ISLAM',
  personalTitle: 'ICT ANALYST',
  personalUnit: 'JKTTDI-2',
  personalBirthPlace: '1996-09-09',
  personalBirthDate: 'GARUT',
  personalGrade: null,
  personalJobDesc: null,
  personalEmail: 'antonio.saiful@gmf-aeroasia.co.id',
  personalImage: null,
  instagram: null,
  linkedIn: null,
  facebook: null,
  token: null,
};

export enum permissionENUM {
  GET_INTEREST_BY_UUID = 'GET_INTEREST_BY_UUID',
  GET_INTEREST_LIST = 'GET_INTEREST_LIST',
  CREATE_INTEREST = 'CREATE_INTEREST',
  UPDATE_INTEREST = 'UPDATE_INTEREST',
  DELETE_INTEREST = 'DELETE_INTEREST',
  GET_SKILL_LIST = 'GET_SKILL_LIST',
  GET_SKILL_BY_UUID = 'GET_SKILL_BY_UUID',
  CREATE_SKILL = 'CREATE_SKILL',
  UPDATE_SKILL = 'UPDATE_SKILL',
  DELETE_SKILL = 'DELETE_SKILL',
  GET_SHARING_EXP_BY_UUID = 'GET_SHARING_EXP_BY_UUID',
  GET_SHARING_EXP_LIST = 'GET_SHARING_EXP_LIST',
  CREATE_SHARING_EXP = 'CREATE_SHARING_EXP',
  UPDATE_SHARING_EXP = 'UPDATE_SHARING_EXP',
  DELETE_SHARING_EXP = 'DELETE_SHARING_EXP',
  APPROVE_REJECT_SHARING_EXP = 'APPROVE_REJECT_SHARING_EXP',
  GET_SLIDER_BY_UUID = 'GET_SLIDER_BY_UUID',
  GET_SLIDER = 'GET_SLIDER',
  CREATE_SLIDER = 'CREATE_SLIDER',
  UPDATE_SLIDER = 'UPDATE_SLIDER',
  DELETE_SLIDER = 'DELETE_SLIDER',
  CREATE_FOLLOWER = 'CREATE_FOLLOWER',
  DELETE_FOLLOWER = 'DELETE_FOLLOWER',
  CREATE_FOLLOWING = 'CREATE_FOLLOWING',
  DELETE_FOLLOWING = 'DELETE_FOLLOWING',
  GET_USER_LIST_BY_PERSONAL_NUMBER = 'GET_USER_LIST_BY_PERSONAL_NUMBER',
  GET_USER_LIST = 'GET_USER_LIST',
  CREATE_USER_LIST = 'CREATE_USER_LIST',
  UPDATE_USER_LIST = 'UPDATE_USER_LIST',
  DELETE_USER_LIST = 'DELETE_USER_LIST',
  GET_USER_SKILL = 'GET_USER_SKILL',
  CREATE_USER_SKILL = 'CREATE_USER_SKILL',
  UPDATE_USER_SKILL = 'UPDATE_USER_SKILL',
  DELETE_USER_SKILL = 'DELETE_USER_SKILL',
  GET_USER_INTEREST = 'GET_USER_INTEREST',
  CREATE_USER_INTEREST = 'CREATE_USER_INTEREST',
  UPDATE_USER_INTEREST = 'UPDATE_USER_INTEREST',
  DELETE_USER_INTEREST = 'DELETE_USER_INTEREST',
  GET_ARTICLE_CATEGORY = 'GET_ARTICLE_CATEGORY',
  CREATE_ARTICLE_CATEGORY = 'CREATE_ARTICLE_CATEGORY',
  UPDATE_ARTICLE_CATEGORY = 'UPDATE_ARTICLE_CATEGORY',
  DELETE_ARTICLE_CATEGORY = 'DELETE_ARTICLE_CATEGORY',
  ACTIVE_DEACTIVATE_ARTICLE_CATEGORY = 'ACTIVE_DEACTIVATE_ARTICLE_CATEGORY',
  GET_ARTICLE = 'GET_ARTICLE',
  CREATE_ARTICLE = 'CREATE_ARTICLE',
  UPDATE_ARTICLE = 'UPDATE_ARTICLE',
  DELETE_ARTICLE = 'DELETE_ARTICLE',
  APPROVAL_REJECTION_ARTICLE = 'APPROVAL_REJECTION_ARTICLE',
  EDITOR_CHOICE_ARTICLE = 'EDITOR_CHOICE_ARTICLE',
  ACTIVE_DEACTIVATE_ARTICLE = 'ACTIVE_DEACTIVATE_ARTICLE',
  GET_COMMENT_ARTICLE = 'GET_COMMENT_ARTICLE',
  CREATE_COMMENT_ARTICLE = 'CREATE_COMMENT_ARTICLE',
  UPDATE_COMMENT_ARTICLE = 'UPDATE_COMMENT_ARTICLE',
  DELETE_COMMENT_ARTICLE = 'DELETE_COMMENT_ARTICLE',
  CREATE_UPDATE_LIKE_COMMENT_ARTICLE = 'CREATE_UPDATE_LIKE_COMMENT_ARTICLE',
  GET_STORY_STATISTIC = 'GET_STORY_STATISTIC',
  GET_STORY_LIST = 'GET_STORY_LIST',
  GET_STORY_BY_ID = 'GET_STORY_BY_ID',
  CREATE_STORY = 'CREATE_STORY',
  UPDATE_STORY = 'UPDATE_STORY',
  DELETE_STORY = 'DELETE_STORY',
  APPROVE_REJECT_STORY = 'APPROVE_REJECT_STORY',
  MARK_AS_EDITOR_CHOICE_STORY = 'MARK_AS_EDITOR_CHOICE_STORY',
  ACTIVATE_DEACTIVATE_STORY = 'ACTIVATE_DEACTIVATE_STORY',
  WATCH_STORY = 'WATCH_STORY',
  GET_BEST_PRACTICE_STATISTIC = 'GET_BEST_PRACTICE_STATISTIC',
  GET_REPLY_COMMENT_BEST_PRACTICE = 'GET_REPLY_COMMENT_BEST_PRACTICE',
  GET_COMMENT_BEST_PRACTICE = 'GET_COMMENT_BEST_PRACTICE',
  GET_BEST_PRACTICE_LIST = 'GET_BEST_PRACTICE_LIST',
  GET_BEST_PRACTICE_BY_ID = 'GET_BEST_PRACTICE_BY_ID',
  CREATE_BEST_PRACTICE = 'CREATE_BEST_PRACTICE',
  UPDATE_BEST_PRACTICE = 'UPDATE_BEST_PRACTICE',
  DELETE_BEST_PRACTICE = 'DELETE_BEST_PRACTICE',
  APPROVE_REJECT_BEST_PRACTICE = 'APPROVE_REJECT_BEST_PRACTICE',
  MARK_AS_EDITOR_CHOICE_BEST_PRACTICE = 'MARK_AS_EDITOR_CHOICE_BEST_PRACTICE',
  ACTIVATE_DEACTIVATE_BEST_PRACTICE = 'ACTIVATE_DEACTIVATE_BEST_PRACTICE',
  CREATE_COMMENT_BEST_PRACTICE = 'CREATE_COMMENT_BEST_PRACTICE',
  UPDATE_COMMENT_BEST_PRACTICE = 'UPDATE_COMMENT_BEST_PRACTICE',
  DELETE_COMMENT_BEST_PRACTICE = 'DELETE_COMMENT_BEST_PRACTICE',
  LIKE_DISLIKE_COMMENT_BEST_PRACTICE = 'LIKE_DISLIKE_COMMENT_BEST_PRACTICE',
  GET_COMMUNITY = 'GET_COMMUNITY',
  GET_COMMUNITY_BY_ID = 'GET_COMMUNITY_BY_ID',
  CREATE_COMMUNITY = 'CREATE_COMMUNITY',
  UPDATE_COMMUNITY = 'UPDATE_COMMUNITY',
  DELETE_COMMUNITY = 'DELETE_COMMUNITY',
  PUBLISH_PRIVATE_COMMUNITY = 'PUBLISH_PRIVATE_COMMUNITY',
  BAN_COMMUNITY = 'BAN_COMMUNITY',
  GET_COMMUNITY_ACTIVITY_BY_COMMUNITY = 'GET_COMMUNITY_ACTIVITY_BY_COMMUNITY',
  GET_ACTIVITY_BY_ID = 'GET_ACTIVITY_BY_ID',
  GET_COMMUNITY_ACTIVITY = 'GET_COMMUNITY_ACTIVITY',
  CREATE_COMMUNITY_ACTIVITY = 'CREATE_COMMUNITY_ACTIVITY',
  UPDATE_COMMUNITY_ACTIVITY = 'UPDATE_COMMUNITY_ACTIVITY',
  DELETE_COMMUNITY_ACTIVITY = 'DELETE_COMMUNITY_ACTIVITY',
  GET_COMMUNITY_MEMBER = 'GET_COMMUNITY_MEMBER',
  CREATE_COMMUNITY_MEMBER = 'CREATE_COMMUNITY_MEMBER',
  UPDATE_COMMUNITY_MEMBER = 'UPDATE_COMMUNITY_MEMBER',
  DELETE_COMMUNITY_MEMBER = 'DELETE_COMMUNITY_MEMBER',
  GET_COMMUNITY_ROLE = 'GET_COMMUNITY_ROLE',
  CREATE_COMMUNITY_ROLE = 'CREATE_COMMUNITY_ROLE',
  UPDATE_COMMUNITY_ROLE = 'UPDATE_COMMUNITY_ROLE',
  DELETE_COMMUNITY_ROLE = 'DELETE_COMMUNITY_ROLE',
  FILTER_MERCHANDISE = 'FILTER_MERCHANDISE',
  GET_MERCHANDISE = 'GET_MERCHANDISE',
  GET_MERCHANDISE_BY_UUID = 'GET_MERCHANDISE_BY_UUID',
  CREATE_MERCHANDISE = 'CREATE_MERCHANDISE',
  UPDATE_MERCHANDISE = 'UPDATE_MERCHANDISE',
  PIN_UNPIN = 'PIN_UNPIN',
  DELETE_MERCHANDISE = 'DELETE_MERCHANDISE',
  CREATE_IMAGE_MERCHANDISE = 'CREATE_IMAGE_MERCHANDISE',
  UPDATE_IMAGE_MERCHANDISE = 'UPDATE_IMAGE_MERCHANDISE',
  DELETE_IMAGE_MERCHANDISE = 'DELETE_IMAGE_MERCHANDISE',
  GET_ALL_MILES = 'GET_ALL_MILES',
  GET_MILES_BY_UUID = 'GET_MILES_BY_UUID',
  GET_MILES = 'GET_MILES',
  CREATE_MILES = 'CREATE_MILES',
  UPDATE_MILES = 'UPDATE_MILES',
  DELETE_MILES = 'DELETE_MILES',
  GET_POINT_CONFIG_BY_UUID = 'GET_POINT_CONFIG_BY_UUID',
  GET_POINT_CONFIG = 'GET_POINT_CONFIG',
  CREATE_POINT_CONFIG = 'CREATE_POINT_CONFIG',
  UPDATE_POINT_CONFIG = 'UPDATE_POINT_CONFIG',
  DELETE_POINT_CONFIG = 'DELETE_POINT_CONFIG',
  GET_REDEEM_BY_UUID = 'GET_REDEEM_BY_UUID',
  GET_REDEEM = 'GET_REDEEM',
  CREATE_REDEEM = 'CREATE_REDEEM',
  UPDATE_REDEEM = 'UPDATE_REDEEM',
  DELETE_REDEEM = 'DELETE_REDEEM',
  GET_ALBUM_GALLERY = 'GET_ALBUM_GALLERY',
  GET_ALBUM_GALLERY_PAGINATE_BY_ALBUM_ID = 'GET_ALBUM_GALLERY_PAGINATE_BY_ALBUM_ID',
  CREATE_ALBUM_GALLERY = 'CREATE_ALBUM_GALLERY',
  UPDATE_ALBUM_GALLERY = 'UPDATE_ALBUM_GALLERY',
  DELETE_ALBUM_GALLERY = 'DELETE_ALBUM_GALLERY',
  GET_ALBUM_CATEGORY = 'GET_ALBUM_CATEGORY',
  CREATE_ALBUM_CATEGORY = 'CREATE_ALBUM_CATEGORY',
  UPDATE_ALBUM_CATEGORY = 'UPDATE_ALBUM_CATEGORY',
  UPDATE_ALBUM_CATEGORY_STATUS = 'UPDATE_ALBUM_CATEGORY_STATUS',
  DELETE_ALBUM_CATEGORY = 'DELETE_ALBUM_CATEGORY',
  GET_ALBUM = 'GET_ALBUM',
  GET_ALBUM_BY_ID = 'GET_ALBUM_BY_ID',
  GET_ALBUM_BY_PERSONAL_NUMBER = 'GET_ALBUM_BY_PERSONAL_NUMBER',
  CREATE_ALBUM = 'CREATE_ALBUM',
  UPDATE_ALBUM = 'UPDATE_ALBUM',
  UPDATE_ALBUM_STATUS = 'UPDATE_ALBUM_STATUS',
  UPDATE_ALBUM_STATUS_APPROVAL = 'UPDATE_ALBUM_STATUS_APPROVAL',
  DELETE_ALBUM = 'DELETE_ALBUM',
  GET_EBOOK_CATEGORY = 'GET_EBOOK_CATEGORY',
  CREATE_EBOOK_CATEGORY = 'CREATE_EBOOK_CATEGORY',
  UPDATE_EBOOK_CATEGORY = 'UPDATE_EBOOK_CATEGORY',
  UPDATE_EBOOK_CATEGORY_STATUS = 'UPDATE_EBOOK_CATEGORY_STATUS',
  DELETE_EBOOK_CATEGORY = 'DELETE_EBOOK_CATEGORY',
  GET_EBOOK = 'GET_EBOOK',
  GET_EBOOK_BY_ID = 'GET_EBOOK_BY_ID',
  CREATE_EBOOK = 'CREATE_EBOOK',
  UPDATE_EBOOK = 'UPDATE_EBOOK',
  UPDATE_EBOOK_STATUS_APPROVAL = 'UPDATE_EBOOK_STATUS_APPROVAL',
  UPDATE_EBOOK_STATUS = 'UPDATE_EBOOK_STATUS',
  UPDATE_EBOOK_EDITOR_CHOICE = 'UPDATE_EBOOK_EDITOR_CHOICE',
  DELETE_EBOOK = 'DELETE_EBOOK',
  UPDATE_VIEW_EBOOK = 'UPDATE_VIEW_EBOOK',
  GET_EBOOK_COLLECTION = 'GET_EBOOK_COLLECTION',
  CREATE_EBOOK_COLLECTION = 'CREATE_EBOOK_COLLECTION',
  CHECK_EBOOK_COLLECTION_EXIST = 'CHECK_EBOOK_COLLECTION_EXIST',
  DELETE_EBOOK_COLLECTION = 'DELETE_EBOOK_COLLECTION',
  GET_EBOOK_READ = 'GET_EBOOK_READ',
  CREATE_EBOOK_READ = 'CREATE_EBOOK_READ',
  DELETE_EBOOK_READ = 'DELETE_EBOOK_READ',
  GET_EBOOK_REVIEWS = 'GET_EBOOK_REVIEWS',
  CREATE_EBOOK_REVIEW = 'CREATE_EBOOK_REVIEW',
  UPDATE_EBOOK_REVIEW = 'UPDATE_EBOOK_REVIEW',
  DELETE_EBOOK_REVIEW = 'DELETE_EBOOK_REVIEW',
  GET_ALL_UNIT_DINAS = 'GET_ALL_UNIT_DINAS',
  GET_UNIT_DINAS = 'GET_UNIT_DINAS',
  CREATE_UNIT_DINAS = 'CREATE_UNIT_DINAS',
  UPDATE_UNIT_DINAS = 'UPDATE_UNIT_DINAS',
  DELETE_UNIT_DINAS = 'DELETE_UNIT_DINAS',
  GET_WEB_DIRECTORY = 'GET_WEB_DIRECTORY',
  GET_WEB_DIRECTORY_BY_ID = 'GET_WEB_DIRECTORY_BY_ID',
  CREATE_WEB_DIRECTORY = 'CREATE_WEB_DIRECTORY',
  UPDATE_WEB_DIRECTORY = 'UPDATE_WEB_DIRECTORY',
  UPDATE_WEB_DIRECTORY_STATUS = 'UPDATE_WEB_DIRECTORY_STATUS',
  DELETE_WEB_DIRECTORY = 'DELETE_WEB_DIRECTORY',
  GET_FORUM = 'GET_FORUM',
  GET_FORUM_STATISTIC = 'GET_FORUM_STATISTIC',
  GET_FORUM_BY_ID = 'GET_FORUM_BY_ID',
  CREATE_FORUM = 'CREATE_FORUM',
  UPDATE_FORUM = 'UPDATE_FORUM',
  DELETE_FORUM = 'DELETE_FORUM',
  UPDATE_FORUM_STATUS = 'UPDATE_FORUM_STATUS',
  UPDATE_FORUM_STATUS_APPROVAL = 'UPDATE_FORUM_STATUS_APPROVAL',
  UPDATE_FORUM_EDITOR_CHOICE = 'UPDATE_FORUM_EDITOR_CHOICE',
  UPDATE_FORUM_VOTE = 'UPDATE_FORUM_VOTE',
  GET_COMMENT_FORUM = 'GET_COMMENT_FORUM',
  CREATE_COMMENT_ACTION = 'CREATE_COMMENT_ACTION',
  UPDATE_COMMENT_ACTION = 'UPDATE_COMMENT_ACTION',
  DELETE_COMMENT_ACTION = 'DELETE_COMMENT_ACTION',
  UPDATE_FORUM_COMMENT_CHILD_SHOW = 'UPDATE_FORUM_COMMENT_CHILD_SHOW',
  GET_CREATORS = 'GET_CREATORS',
  GET_CREATOR_STATISTIC = 'GET_CREATOR_STATISTIC',
  GET_CREATOR_BY_UUID = 'GET_CREATOR_BY_UUID',
  CREATE_CREATOR = 'CREATE_CREATOR',
  UPDATE_CREATOR = 'UPDATE_CREATOR',
  DELETE_CREATOR = 'DELETE_CREATOR',
  UPDATE_CREATOR_STATUS = 'UPDATE_CREATOR_STATUS',
  UPDATE_CREATOR_STATUS_APPROVAL = 'UPDATE_CREATOR_STATUS_APPROVAL',
  UPDATE_CREATOR_EDITOR_CHOICE = 'UPDATE_CREATOR_EDITOR_CHOICE',
  GET_PODCAST = 'GET_PODCAST',
  GET_PODCAST_STATISTIC = 'GET_PODCAST_STATISTIC',
  GET_PODCAST_BY_UUID = 'GET_PODCAST_BY_UUID',
  CREATE_PODCAST = 'CREATE_PODCAST',
  UPDATE_PODCAST = 'UPDATE_PODCAST',
  DELETE_PODCAST = 'DELETE_PODCAST',
  UPDATE_PODCAST_STATUS = 'UPDATE_PODCAST_STATUS',
  UPDATE_PODCAST_STATUS_APPROVAL = 'UPDATE_PODCAST_STATUS_APPROVAL',
  UPDATE_PODCAST_EDITOR_CHOICE = 'UPDATE_PODCAST_EDITOR_CHOICE',
  PLAY_PODCAST = 'PLAY_PODCAST',
  GET_SERIES = 'GET_SERIES',
  GET_SERIES_STATISTIC = 'GET_SERIES_STATISTIC',
  GET_SERIES_BY_UUID = 'GET_SERIES_BY_UUID',
  CREATE_SERIES = 'CREATE_SERIES',
  UPDATE_SERIES = 'UPDATE_SERIES',
  DELETE_SERIES = 'DELETE_SERIES',
  UPDATE_SERIES_STATUS = 'UPDATE_SERIES_STATUS',
  UPDATE_SERIES_STATUS_APPROVAL = 'UPDATE_SERIES_STATUS_APPROVAL',
  UPDATE_SERIES_EDITOR_CHOICE = 'UPDATE_SERIES_EDITOR_CHOICE',
  GET_TALK_CATEGORY = 'GET_TALK_CATEGORY',
  GET_TALK_CATEGORY_BY_ID = 'GET_TALK_CATEGORY_BY_ID',
  CREATE_TALK_CATEGORY = 'CREATE_TALK_CATEGORY',
  UPDATE_TALK_CATEGORY = 'UPDATE_TALK_CATEGORY',
  DELETE_TALK_CATEGORY = 'DELETE_TALK_CATEGORY',
  UPDATE_TALK_CATEGORY_STATUS = 'UPDATE_TALK_CATEGORY_STATUS',
  GET_STREAM = 'GET_STREAM',
  GET_STREAM_STATISTIC = 'GET_STREAM_STATISTIC',
  GET_STREAM_BY_UUID = 'GET_STREAM_BY_UUID',
  CREATE_STREAM = 'CREATE_STREAM',
  UPDATE_STREAM = 'UPDATE_STREAM',
  DELETE_STREAM = 'DELETE_STREAM',
  ADD_FAVORITE = 'ADD_FAVORITE',
  DELETE_FAVORITE = 'DELETE_FAVORITE',
  ADD_WATCH_STREAM = 'ADD_WATCH_STREAM',
  UPDATE_STREAM_STATUS = 'UPDATE_STREAM_STATUS',
  UPDATE_STREAM_STATUS_APPROVAL = 'UPDATE_STREAM_STATUS_APPROVAL',
  UPDATE_STREAM_EDITOR_CHOICE = 'UPDATE_STREAM_EDITOR_CHOICE',
}
