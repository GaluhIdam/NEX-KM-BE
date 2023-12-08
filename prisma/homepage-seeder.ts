import { InterestDTO } from 'src/modules/homepage/interest/dtos/interest.dto';
import {
  MasterPermissionDTO,
  PermissionMasterNameOnlyDTO,
  RoleDTO,
} from 'src/modules/homepage/roles/dtos/role-permission.dto';
import { SkillDTO } from 'src/modules/homepage/skill/dtos/skill.dto';
import { UserListDTO } from 'src/modules/homepage/user-list/dtos/user-list.dto';
import { Page, SuperAdmin, permissionENUM } from './meta-data';

export const users: Array<UserListDTO> = [SuperAdmin];

export const interest: Array<InterestDTO> = [
  {
    name: 'Game',
  },
  {
    name: 'Education',
  },
  {
    name: 'Art',
  },
  {
    name: 'Music',
  },
  {
    name: 'Nature',
  },
  {
    name: 'Travel',
  },
  {
    name: 'Sports',
  },
  {
    name: 'Technology',
  },
];

export const skill: Array<SkillDTO> = [
  {
    name: 'Communication',
  },
  {
    name: 'Problem Solving',
  },
  {
    name: 'Time Management',
  },
  {
    name: 'Leadership',
  },
  {
    name: 'Adaptability',
  },
  {
    name: 'Technical',
  },
  {
    name: 'Financial Literacy',
  },
  {
    name: 'Project Management',
  },
];

export const role: Array<RoleDTO> = [
  {
    name: 'Super Administrator',
    description: 'Manage all feature and can access anything',
    page: Page.ADMIN,
  },
  {
    name: 'User',
    description: 'Manage User Module',
    page: Page.USER,
  },
];

export const rolePermission: Array<PermissionMasterNameOnlyDTO> = [
  {
    name: permissionENUM.GET_ACTIVITY_BY_ID,
  },
];

export const permissionMaster: Array<MasterPermissionDTO> = [
  //Homepage
  //Interest Action
  {
    name: 'get-interest-by-uuid',
    description: 'Retrieve interest by UUID.',
  },
  {
    name: 'get-interest-list',
    description: 'Retrieve a list of interests with optional filters.',
  },
  {
    name: 'create-interest',
    description: 'Create a new interest.',
  },
  {
    name: 'update-interest',
    description: 'Update an existing interest by UUID.',
  },
  {
    name: 'delete-interest',
    description: 'Delete an interest by UUID.',
  },

  //Skill Action
  {
    name: 'get-skill-list',
    description: 'Retrieve a list of skills with optional filters.',
  },
  {
    name: 'get-skill-by-uuid',
    description: 'Retrieve a skill by UUID.',
  },
  {
    name: 'create-skill',
    description: 'Create a new skill.',
  },
  {
    name: 'update-skill',
    description: 'Update an existing skill by UUID.',
  },
  {
    name: 'delete-skill',
    description: 'Delete a skill by UUID.',
  },

  //Sharing Experience Action
  {
    name: 'get-sharing-exp-by-uuid',
    description: 'Retrieve a sharing experience by UUID.',
  },
  {
    name: 'get-sharing-exp-list',
    description:
      'Retrieve a list of sharing experiences with optional filters.',
  },
  {
    name: 'create-sharing-exp',
    description: 'Create a new sharing experience.',
  },
  {
    name: 'update-sharing-exp',
    description: 'Update an existing sharing experience by UUID.',
  },
  {
    name: 'delete-sharing-exp',
    description: 'Delete a sharing experience by UUID.',
  },
  {
    name: 'approve-reject-sharing-exp',
    description: 'Approve or reject a sharing experience by UUID.',
  },

  //Slider Action
  {
    name: 'get-slider-by-uuid',
    description: 'Retrieve a specific slider by UUID.',
  },
  {
    name: 'get-slider',
    description:
      'Retrieve a list of sliders with optional filtering and pagination.',
  },
  {
    name: 'create-slider',
    description: 'Create a new slider with image upload.',
  },
  {
    name: 'update-slider',
    description: 'Update an existing slider by UUID with image replacement.',
  },
  {
    name: 'delete-slider',
    description: 'Delete an existing slider by UUID.',
  },

  //User List Action
  {
    name: 'create-follower',
    description: 'Create a follower relationship between users.',
  },
  {
    name: 'delete-follower',
    description: 'Delete a follower relationship between users.',
  },
  {
    name: 'create-following',
    description: 'Create a following relationship between users.',
  },
  {
    name: 'delete-following',
    description: 'Delete a following relationship between users.',
  },
  {
    name: 'get-user-list-by-personal-number',
    description: 'Retrieve user lists by personal number.',
  },
  {
    name: 'get-user-list',
    description: 'Retrieve a list of user lists with optional filters.',
  },
  {
    name: 'create-user-list',
    description: 'Create a new user list.',
  },
  {
    name: 'update-user-list',
    description: 'Update an existing user list by personal number.',
  },
  {
    name: 'delete-user-list',
    description: 'Delete a user list by UUID.',
  },
  {
    name: 'get-user-skill',
    description: 'Retrieve user skills by personal number.',
  },
  {
    name: 'create-user-skill',
    description: 'Create a new user skill.',
  },
  {
    name: 'update-user-skill',
    description: 'Update an existing user skill by UUID.',
  },
  {
    name: 'delete-user-skill',
    description: 'Delete a user skill by UUID.',
  },
  {
    name: 'get-user-interest',
    description: 'Retrieve user interests by personal number.',
  },
  {
    name: 'create-user-interest',
    description: 'Create a new user interest.',
  },
  {
    name: 'update-user-interest',
    description: 'Update an existing user interest by UUID.',
  },
  {
    name: 'delete-user-interest',
    description: 'Delete a user interest by UUID.',
  },

  //Nex Learning

  // Article Category Action
  {
    name: 'get-article-category',
    description: 'Retrieve a list of article categories.',
  },
  {
    name: 'create-article-category',
    description: 'Create a new article category.',
  },
  {
    name: 'update-article-category',
    description: 'Update an existing article category.',
  },
  {
    name: 'delete-article-category',
    description: 'Delete an article category.',
  },
  {
    name: 'active-deactivate-article-category',
    description: 'Activate or deactivate an article category.',
  },

  // Article Action
  {
    name: 'get-article',
    description: 'Retrieve detailed information about an article.',
  },
  {
    name: 'create-article',
    description: 'Create a new article.',
  },
  {
    name: 'update-article',
    description: 'Update an existing article.',
  },
  {
    name: 'delete-article',
    description: 'Delete an article.',
  },
  {
    name: 'approval-rejection-article',
    description: 'Approve or reject an article for publication.',
  },
  {
    name: 'editor-choice-article',
    description: "Mark an article as an editor's choice.",
  },
  {
    name: 'active-deactivate-article',
    description: 'Activate or deactivate an article.',
  },

  // Comment Actions on Articles
  {
    name: 'get-comment-article',
    description: 'Retrieve comments associated with an article.',
  },
  {
    name: 'create-comment-article',
    description: 'Add a new comment to an article.',
  },
  {
    name: 'update-comment-article',
    description: 'Edit an existing comment on an article.',
  },
  {
    name: 'delete-comment-article',
    description: 'Delete a comment on an article.',
  },
  {
    name: 'create-update-like-comment-article',
    description: 'Like or update your like status on a comment of an article.',
  },

  //Story Action
  {
    name: 'get-story-statistic',
    description: 'Retrieve statistics for stories in a specific category.',
  },
  {
    name: 'get-story-list',
    description: 'Retrieve a list of stories with optional filters.',
  },
  {
    name: 'get-story-by-id',
    description:
      'Retrieve detailed information about a specific story by its UUID.',
  },
  {
    name: 'create-story',
    description: 'Create a new story, including video upload.',
  },
  {
    name: 'update-story',
    description: 'Update an existing story, including video upload.',
  },
  {
    name: 'delete-story',
    description: 'Delete a story (Not implemented).',
  },
  {
    name: 'approve-reject-story',
    description: 'Approve or reject a story for publication.',
  },
  {
    name: 'mark-as-editor-choice-story',
    description: "Mark a story as an editor's choice.",
  },
  {
    name: 'activate-deactivate-story',
    description: 'Activate or deactivate a story.',
  },
  {
    name: 'watch-story',
    description: 'Check and create watch records for a story.',
  },

  //Best Practice Action
  {
    name: 'get-best-practice-statistic',
    description: 'Retrieve statistics for best practices.',
  },
  {
    name: 'get-reply-comment-best-practice',
    description: 'Retrieve reply comments for a given parent comment.',
  },
  {
    name: 'get-comment-best-practice',
    description: 'Retrieve comments for a specific best practice.',
  },
  {
    name: 'get-best-practice-list',
    description: 'Retrieve a list of best practices with optional filters.',
  },
  {
    name: 'get-best-practice-by-id',
    description:
      'Retrieve detailed information about a specific best practice by its UUID.',
  },
  {
    name: 'create-best-practice',
    description: 'Create a new best practice, including image upload.',
  },
  {
    name: 'update-best-practice',
    description: 'Update an existing best practice, including image upload.',
  },
  {
    name: 'delete-best-practice',
    description: 'Delete a best practice.',
  },
  {
    name: 'approve-reject-best-practice',
    description: 'Approve or reject a best practice for publication.',
  },
  {
    name: 'mark-as-editor-choice-best-practice',
    description: "Mark a best practice as an editor's choice.",
  },
  {
    name: 'activate-deactivate-best-practice',
    description: 'Activate or deactivate a best practice.',
  },
  {
    name: 'create-comment-best-practice',
    description: 'Create a comment for a best practice.',
  },
  {
    name: 'update-comment-best-practice',
    description: 'Update a comment for a best practice.',
  },
  {
    name: 'delete-comment-best-practice',
    description: 'Delete a comment for a best practice.',
  },
  {
    name: 'like-dislike-comment-best-practice',
    description: 'Like or dislike a comment for a best practice.',
  },

  //Nex Community
  // Community Action
  {
    name: 'get-community',
    description: 'Retrieve Community Data by providing relevant filters.',
  },
  {
    name: 'get-community-by-id',
    description: 'Retrieve a specific Community by its unique ID.',
  },
  {
    name: 'create-community',
    description:
      'Create a new Community with specified details and attributes.',
  },
  {
    name: 'update-community',
    description: 'Update an existing Community with new data and attributes.',
  },
  {
    name: 'delete-community',
    description:
      'Delete a Community, including all associated data and members.',
  },
  {
    name: 'publish-private-community',
    description:
      'Change the status of a Community to make it publicly accessible.',
  },
  {
    name: 'ban-community',
    description:
      'Ban a Community, preventing access and interactions from its members.',
  },

  // Community Activity Action
  {
    name: 'get-community-activity-by-community',
    description:
      'Retrieve Community Activities associated with a specific Community.',
  },
  {
    name: 'get-activity-by-id',
    description: 'Retrieve a specific Community Activity by its unique ID.',
  },
  {
    name: 'get-community-activity',
    description:
      'Retrieve a list of all Community Activities across different Communities.',
  },
  {
    name: 'create-community-activity',
    description:
      'Create a new Community Activity and associate it with a Community.',
  },
  {
    name: 'update-community-activity',
    description: 'Update the details and attributes of a Community Activity.',
  },
  {
    name: 'delete-community-activity',
    description:
      'Delete a Community Activity, removing it from the associated Community.',
  },

  // Community Member Action
  {
    name: 'get-community-member',
    description: 'Retrieve information about a specific Community Member.',
  },
  {
    name: 'create-community-member',
    description: 'Add a new member to a Community with specified details.',
  },
  {
    name: 'update-community-member',
    description: 'Update the information and role of a Community Member.',
  },
  {
    name: 'delete-community-member',
    description:
      'Remove a member from a Community, revoking their access and privileges.',
  },

  // Community Role Member Action
  {
    name: 'get-community-role',
    description: 'Retrieve information about a specific Community Role.',
  },
  {
    name: 'create-community-role',
    description:
      'Create a new Community Role with specific permissions and attributes.',
  },
  {
    name: 'update-community-role',
    description:
      'Update the permissions and attributes of an existing Community Role.',
  },
  {
    name: 'delete-community-role',
    description:
      'Delete a Community Role, including its associated permissions.',
  },

  // Next Level

  // Merchandise Action
  {
    name: 'filter-merchandise',
    description: 'Filter Merchandise based on specified criteria or filters.',
  },
  {
    name: 'get-merchandise',
    description: 'Retrieve information about available Merchandise.',
  },
  {
    name: 'get-merchandise-by-uuid',
    description: 'Retrieve specific Merchandise by its unique UUID.',
  },
  {
    name: 'create-merchandise',
    description:
      'Create a new Merchandise item with specified details and attributes.',
  },
  {
    name: 'update-merchandise',
    description:
      'Update the details and attributes of an existing Merchandise item.',
  },
  {
    name: 'pin-unpin',
    description:
      'Pin or Unpin Merchandise to highlight or remove from prominence.',
  },
  {
    name: 'delete-merchandise',
    description: 'Delete a Merchandise item from the inventory.',
  },
  {
    name: 'create-image-merchandise',
    description:
      'Add images or photos to a Merchandise item for visual representation.',
  },
  {
    name: 'update-image-merchandise',
    description:
      'Update the images or photos associated with a Merchandise item.',
  },
  {
    name: 'delete-image-merchandise',
    description: 'Remove images or photos from a Merchandise item.',
  },

  // Mile Action
  {
    name: 'get-all-miles',
    description: 'Retrieve information about all available Mile options.',
  },
  {
    name: 'get-miles-by-uuid',
    description: 'Retrieve specific Mile options by their unique UUIDs.',
  },
  {
    name: 'get-miles',
    description: 'Retrieve information about Mile options available for users.',
  },
  {
    name: 'create-miles',
    description: 'Create new Mile options with specific rewards and criteria.',
  },
  {
    name: 'update-miles',
    description: 'Update the details and rewards associated with Mile options.',
  },
  {
    name: 'delete-miles',
    description:
      'Delete Mile options, including their associated rewards and criteria.',
  },

  // Point Config Action
  {
    name: 'get-point-config-by-uuid',
    description: 'Retrieve Point Configuration settings by their unique UUID.',
  },
  {
    name: 'get-point-config',
    description: 'Retrieve general Point Configuration settings.',
  },
  {
    name: 'create-point-config',
    description:
      'Create new Point Configuration settings with specific parameters.',
  },
  {
    name: 'update-point-config',
    description: 'Update the parameters and settings of Point Configuration.',
  },
  {
    name: 'delete-point-config',
    description:
      'Delete Point Configuration settings, including associated parameters.',
  },

  // Redeem Action
  {
    name: 'get-redeem-by-uuid',
    description: 'Retrieve Redeem options by their unique UUIDs.',
  },
  {
    name: 'get-redeem',
    description: 'Retrieve information about available Redeem options.',
  },
  {
    name: 'create-redeem',
    description:
      'Create new Redeem options with specific rewards and redemption criteria.',
  },
  {
    name: 'update-redeem',
    description:
      'Update the details and rewards associated with Redeem options.',
  },
  {
    name: 'delete-redeem',
    description:
      'Delete Redeem options, including their associated rewards and criteria.',
  },

  //Nex Library
  //Album Gallery Action
  {
    name: 'get-album-gallery',
    description:
      'Retrieve a list of album gallery items with optional pagination.',
  },
  {
    name: 'get-album-gallery-paginate-by-album-id',
    description:
      'Retrieve a list of album gallery items by album ID with optional pagination.',
  },
  {
    name: 'create-album-gallery',
    description: 'Create a new album gallery item with images.',
  },
  {
    name: 'update-album-gallery',
    description: 'Update existing album gallery items with images.',
  },
  {
    name: 'delete-album-gallery',
    description: 'Delete one or more album gallery items by UUID.',
  },

  //Album Category Action
  {
    name: 'get-album-category',
    description:
      'Retrieve a list of album categories with optional pagination and filtering.',
  },
  {
    name: 'create-album-category',
    description: 'Create a new album category.',
  },
  {
    name: 'update-album-category',
    description: 'Update an existing album category (general information).',
  },
  {
    name: 'update-album-category-status',
    description: 'Update the status of an existing album category.',
  },
  {
    name: 'delete-album-category',
    description: 'Delete an existing album category by UUID.',
  },

  //Album Action
  {
    name: 'get-album',
    description:
      'Retrieve a list of albums with optional pagination and filtering.',
  },
  {
    name: 'get-album-by-id',
    description: 'Retrieve an album by its UUID.',
  },
  {
    name: 'get-album-by-personal-number',
    description:
      'Retrieve a list of albums by personal number with optional pagination and filtering.',
  },
  {
    name: 'create-album',
    description: 'Create a new album with an album cover image.',
  },
  {
    name: 'update-album',
    description:
      'Update an existing album (general information) with an album cover image.',
  },
  {
    name: 'update-album-status',
    description: 'Update the status of an existing album.',
  },
  {
    name: 'update-album-status-approval',
    description: 'Update the approval status of an existing album.',
  },
  {
    name: 'delete-album',
    description:
      'Delete an existing album by UUID, including associated album gallery items.',
  },
  //Ebook Category
  {
    name: 'get-ebook-category',
    description:
      'Retrieve a list of ebook categories with optional pagination and filtering.',
  },
  {
    name: 'create-ebook-category',
    description: 'Create a new ebook category.',
  },
  {
    name: 'update-ebook-category',
    description: 'Update an existing ebook category (general information).',
  },
  {
    name: 'update-ebook-category-status',
    description: 'Update the status of an existing ebook category.',
  },
  {
    name: 'delete-ebook-category',
    description: 'Delete an existing ebook category by UUID.',
  },

  //Ebook Action
  {
    name: 'get-ebook',
    description:
      'Retrieve a list of ebooks with optional pagination and filtering.',
  },
  {
    name: 'get-ebook-by-id',
    description: 'Retrieve an ebook by its UUID.',
  },
  {
    name: 'create-ebook',
    description: 'Create a new ebook with ebook file and cover image.',
  },
  {
    name: 'update-ebook',
    description:
      'Update an existing ebook (general information) with ebook file and cover image.',
  },
  {
    name: 'update-ebook-status-approval',
    description: 'Update the approval status of an existing ebook.',
  },
  {
    name: 'update-ebook-status',
    description: 'Update the status of an existing ebook.',
  },
  {
    name: 'update-ebook-editor-choice',
    description: 'Update the editor choice status of an existing ebook.',
  },
  {
    name: 'delete-ebook',
    description:
      'Delete an existing ebook by UUID, including associated ebook files and cover images.',
  },
  {
    name: 'update-view-ebook',
    description: 'Update the view count of an existing ebook.',
  },

  //Ebook Collection Action
  {
    name: 'get-ebook-collection',
    description:
      'Retrieve a list of ebook collections with optional pagination and filtering.',
  },
  {
    name: 'create-ebook-collection',
    description: 'Create a new ebook collection.',
  },
  {
    name: 'check-ebook-collection-exist',
    description:
      'Check if an ebook collection exists (for validation purposes).',
  },
  {
    name: 'delete-ebook-collection',
    description: 'Delete an existing ebook collection by UUID.',
  },
  {
    name: 'get-ebook-read',
    description:
      'Retrieve a list of ebook reads with optional pagination and filtering.',
  },
  {
    name: 'create-ebook-read',
    description: 'Create a new ebook read.',
  },
  {
    name: 'delete-ebook-read',
    description: 'Delete an existing ebook read by UUID.',
  },

  //Ebook Review Action
  {
    name: 'get-ebook-reviews',
    description:
      'Retrieve a list of ebook reviews with optional pagination and filtering.',
  },
  {
    name: 'create-ebook-review',
    description: 'Create a new ebook review.',
  },
  {
    name: 'update-ebook-review',
    description: 'Update an existing ebook review by UUID.',
  },
  {
    name: 'delete-ebook-review',
    description: 'Delete an existing ebook review by UUID.',
  },

  //Unit Dinas Action
  {
    name: 'get-all-unit-dinas',
    description: 'Retrieve a list of all unit dinas.',
  },
  {
    name: 'get-unit-dinas',
    description: 'Retrieve a list of unit dinas with optional pagination.',
  },
  {
    name: 'create-unit-dinas',
    description: 'Create a new unit dinas.',
  },
  {
    name: 'update-unit-dinas',
    description: 'Update an existing unit dinas by UUID.',
  },
  {
    name: 'delete-unit-dinas',
    description: 'Delete an existing unit dinas by UUID.',
  },

  //Web Directory Action
  {
    name: 'get-web-directory',
    description:
      'Retrieve a list of web directories with optional filtering and pagination.',
  },
  {
    name: 'get-web-directory-by-id',
    description: 'Retrieve a specific web directory by UUID.',
  },
  {
    name: 'create-web-directory',
    description: 'Create a new web directory with cover image upload.',
  },
  {
    name: 'update-web-directory',
    description:
      'Update an existing web directory by UUID with cover image replacement.',
  },
  {
    name: 'update-web-directory-status',
    description: 'Update the status of a web directory by UUID.',
  },
  {
    name: 'delete-web-directory',
    description: 'Delete an existing web directory by UUID.',
  },

  //Forum Action
  {
    name: 'get-forum',
    description:
      'Retrieve a list of forums with optional filtering and pagination.',
  },
  {
    name: 'get-forum-statistic',
    description: 'Retrieve statistics about forums.',
  },
  {
    name: 'get-forum-by-id',
    description: 'Retrieve a specific forum by UUID.',
  },
  {
    name: 'create-forum',
    description: 'Create a new forum with media upload.',
  },
  {
    name: 'update-forum',
    description: 'Update an existing forum by UUID with media replacement.',
  },
  {
    name: 'delete-forum',
    description: 'Delete an existing forum by UUID.',
  },
  {
    name: 'update-forum-status',
    description: 'Update the status of a forum by UUID.',
  },
  {
    name: 'update-forum-status-approval',
    description: 'Update the approval status of a forum by UUID.',
  },
  {
    name: 'update-forum-editor-choice',
    description: 'Update the editor choice status of a forum by UUID.',
  },
  {
    name: 'update-forum-vote',
    description: 'Update the vote status of a forum by UUID.',
  },

  //Comment Forum Action
  {
    name: 'get-comment-forum',
    description:
      'Retrieve a list of comments with optional filtering and pagination.',
  },
  {
    name: 'create-comment-action',
    description: 'Create a new comment.',
  },
  {
    name: 'update-comment-action',
    description: 'Update an existing comment by UUID.',
  },
  {
    name: 'delete-comment-action',
    description: 'Delete an existing comment by UUID.',
  },
  {
    name: 'update-forum-comment-child-show',
    description: 'Update the child comment show status of a comment by UUID.',
  },

  //Podcast
  //Creator Controller
  {
    name: 'get-creators',
    description: 'retrieve a list of creators.',
  },
  {
    name: 'get-creator-statistic',
    description: 'retrieve creator statistics.',
  },
  {
    name: 'get-creator-by-uuid',
    description: 'retrieve a specific creator by UUID.',
  },
  {
    name: 'create-creator',
    description: 'create a new creator.',
  },
  {
    name: 'update-creator',
    description: 'update an existing creator.',
  },
  {
    name: 'delete-creator',
    description: 'delete a creator.',
  },
  {
    name: 'update-creator-status',
    description: 'update the status of a creator.',
  },
  {
    name: 'update-creator-status-approval',
    description: 'update the approval status of a creator.',
  },
  {
    name: 'update-creator-editor-choice',
    description: "update the editor's choice status of a creator.",
  },

  //Podcast Action
  {
    name: 'get-podcast',
    description: 'retrieve a list of podcasts.',
  },
  {
    name: 'get-podcast-statistic',
    description: 'retrieve podcast statistics.',
  },
  {
    name: 'get-podcast-by-uuid',
    description: 'retrieve a specific podcast by UUID.',
  },
  {
    name: 'create-podcast',
    description: 'create a new podcast.',
  },
  {
    name: 'update-podcast',
    description: 'update an existing podcast.',
  },
  {
    name: 'delete-podcast',
    description: 'delete a podcast.',
  },
  {
    name: 'update-podcast-status',
    description: 'update the status of a podcast.',
  },
  {
    name: 'update-podcast-status-approval',
    description: 'update the approval status of a podcast.',
  },
  {
    name: 'update-podcast-editor-choice',
    description: "update the editor's choice status of a podcast.",
  },
  {
    name: 'play-podcast',
    description: 'mark a podcast as played.',
  },

  //Series Action
  {
    name: 'get-series',
    description: 'retrieve a list of series.',
  },
  {
    name: 'get-series-statistic',
    description: 'retrieve series statistics.',
  },
  {
    name: 'get-series-by-uuid',
    description: 'retrieve a specific series by UUID.',
  },
  {
    name: 'create-series',
    description: 'create a new series.',
  },
  {
    name: 'update-series',
    description: 'update an existing series.',
  },
  {
    name: 'delete-series',
    description: 'delete a series.',
  },
  {
    name: 'update-series-status',
    description: 'update the status of a series.',
  },
  {
    name: 'update-series-status-approval',
    description: 'update the approval status of a series.',
  },
  {
    name: 'update-series-editor-choice',
    description: "update the editor's choice status of a series.",
  },

  //Talk Action
  {
    name: 'get-talk-category',
    description: 'retrieve a list of talk categories.',
  },
  {
    name: 'get-talk-category-by-id',
    description: 'retrieve a specific talk category by UUID.',
  },
  {
    name: 'create-talk-category',
    description: 'create a new talk category.',
  },
  {
    name: 'update-talk-category',
    description: 'update an existing talk category.',
  },
  {
    name: 'delete-talk-category',
    description: 'delete a talk category.',
  },
  {
    name: 'update-talk-category-status',
    description: 'update the status of a talk category.',
  },

  //Stream Action
  {
    name: 'get-stream',
    description: 'retrieve a list of streams.',
  },
  {
    name: 'get-stream-statistic',
    description: 'retrieve statistics about streams.',
  },
  {
    name: 'get-stream-by-uuid',
    description: 'retrieve a specific stream by UUID.',
  },
  {
    name: 'create-stream',
    description: 'create a new stream.',
  },
  {
    name: 'update-stream',
    description: 'update an existing stream.',
  },
  {
    name: 'delete-stream',
    description: 'delete a stream.',
  },
  {
    name: 'add-favorite',
    description: 'add a stream to favorites.',
  },
  {
    name: 'delete-favorite',
    description: 'remove a stream from favorites by personal number.',
  },
  {
    name: 'add-watch-stream',
    description: 'mark a stream as watched.',
  },
  {
    name: 'update-stream-status',
    description: 'update the status of a stream.',
  },
  {
    name: 'update-stream-status-approval',
    description: 'update the approval status of a stream.',
  },
  {
    name: 'update-stream-editor-choice',
    description: 'update the editor choice status of a stream.',
  },
  {
    name: 'get-role-permission',
    description:
      'Retrieve role permissions for a specific page, with options to filter and sort the results.',
  },
  {
    name: 'create-role-permission',
    description: 'Create a new role permission using the provided data.',
  },

  {
    name: 'update-role-permission',
    description:
      'Update an existing role permission identified by its unique identifier using the provided data.',
  },

  {
    name: 'delete-role-permission',
    description: 'Delete a role permission by its unique identifier.',
  },
  {
    name: 'get-user-in-role',
    description:
      'Retrieve users in a specific role for a given page, with options to filter and limit the results.',
  },
  {
    name: 'create-user-in-role',
    description: 'Create a new user role using the provided data.',
  },
  {
    name: 'delete-user-in-role',
    description: 'Delete a user role by its unique identifier.',
  },
  {
    name: 'get-permission-in-role',
    description:
      'Retrieve permissions associated with a specific role identified by its unique identifier.',
  },
  {
    name: 'get-permission',
    description:
      'Retrieve master permissions for a specific page, with options to filter and sort the results.',
  },
];
