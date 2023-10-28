/**
 * Notes: 服务者实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wx)
 * Date: 2022-01-17 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class MemberModel extends BaseProjectModel {

}

// 集合名
MemberModel.CL = BaseProjectModel.C('member');

MemberModel.DB_STRUCTURE = {
	_pid: 'string|true',
	MEMBER_ID: 'string|true',

	MEMBER_TITLE: 'string|true|comment=姓名',

	MEMBER_PHONE: 'string|false|comment=登录手机',
	MEMBER_PASSWORD: 'string|false|comment=登录密码',
	MEMBER_TOKEN: 'string|false|comment=当前登录token',
	MEMBER_TOKEN_TIME: 'int|true|default=0|comment=当前登录token time',
	MEMBER_MINI_OPENID: 'string|false|comment=小程序openid',
	MEMBER_LOGIN_CNT: 'int|true|default=0|comment=登陆次数',
	MEMBER_LOGIN_TIME: 'int|false|comment=最近登录时间',


	MEMBER_CATE_ID: 'string|true|comment=分类编号',
	MEMBER_CATE_NAME: 'string|true|comment=分类冗余',

	MEMBER_FORMS: 'array|true|default=[]',
	MEMBER_OBJ: 'object|true|default={}',

	MEMBER_STATUS: 'int|true|default=1|comment=状态',


	MEMBER_ADD_TIME: 'int|true',
	MEMBER_EDIT_TIME: 'int|true',
	MEMBER_ADD_IP: 'string|false',
	MEMBER_EDIT_IP: 'string|false',
};

// 字段前缀
MemberModel.FIELD_PREFIX = "MEMBER_";


MemberModel.STATUS = {
	UNUSE: 0,
	COMM: 1,
};

MemberModel.STATUS_DESC = {
	UNUSE: '停用',
	COMM: '正常',
};


module.exports = MemberModel;