const TASK_TYPE = ['桌椅维修', '灯管维修', '门锁维修', '水电维修', '设备维修', '家具维修', '室外维修', '室内维修', '其他'];

module.exports = { //报修 repair
	PROJECT_COLOR: '#0055BE',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#0055BE',

	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' },
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [

	],

	NEWS_NAME: '通知公告',
	NEWS_CATE: [
		{ id: 1, title: '通知公告', style: 'leftbig1' },
	],
	NEWS_FIELDS: [],


	TASK_NAME: '报修',
	TASK_TYPE: TASK_TYPE,
	TASK_FIELDS: [
		{ mark: 'type', title: '报修类型', type: 'select', selectOptions: TASK_TYPE, must: true },
		{ mark: 'person', title: '联系人', type: 'text', must: true },
		{ mark: 'phone', title: '联系电话', type: 'text', must: true },
		{ mark: 'address', title: '报修地点', type: 'textarea', must: true },
		{ mark: 'desc', title: '报修详情', type: 'textarea', must: true },
		{ mark: 'img', type: 'image', title: '相关图片', max: 8 },
	],

	TASK_RUN_FIELDS: [
		{ mark: 'content', title: '情况说明', type: 'textarea', must: false },
		{ mark: 'img', type: 'image', title: '相关图片', max: 8 },
	],

	TASK_OVER_FIELDS: [
		{ mark: 'content', title: '完成情况说明', type: 'textarea', must: true },
		{ mark: 'img', type: 'image', title: '相关图片', max: 8, must: true },
	],

	TASK_COMMENT_FIELDS: [
		{ mark: 'content', title: '评价内容', type: 'textarea', must: true },
		{ mark: 'img', type: 'image', title: '相关图片', max: 8 },
	],


	MEMBER_NAME: '工作人员',
	MEMBER_CATE: [
		{ id: 1, title: '客服部' },
		{ id: 2, title: '安保部' },
		{ id: 3, title: '保洁部' },
		{ id: 4, title: '维修部' },
		{ id: 5, title: '工程部' },
	],
	MEMBER_FIELDS: [
		{ mark: 'phone', title: '服务电话', type: 'text', ext: { hint: '用于展示给报修用户' }, must: false },
		{ mark: 'img', type: 'image', title: '头像', max: 1 },
	],


}