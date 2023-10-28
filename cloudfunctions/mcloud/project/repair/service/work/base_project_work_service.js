/**
 * Notes: 服务者管理模块业务基类
 * Date: 2023-01-15 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.8 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseService = require('../../../../framework/platform/service/base_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');
const appCode = require('../../../../framework/core/app_code.js');
const util = require('../../../../framework/utils/util.js');
const config = require('../../../../config/config.js');
const MemberModel = require('../../model/member_model.js');

class BaseProjectWorkService extends BaseService {

	getProjectId() {
		return util.getProjectId();
	}

	/** 是否登陆 */
	async isWork(token) {

		let where = {
			MEMBER_TOKEN: token,
			MEMBER_TOKEN_TIME: ['>', timeUtil.time() - config.WORK_LOGIN_EXPIRE * 1000], // token有效时间
			MEMBER_STATUS: MemberModel.STATUS.COMM,
		}
		let member = await MemberModel.getOne(where, '_id, MEMBER_TITLE'); 
		if (!member)
			this.AppError('登录已过期，请重新登录', appCode.WORK_ERROR);

		return member;
	}

}

module.exports = BaseProjectWorkService;