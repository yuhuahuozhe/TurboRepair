/**
 * Notes: 服务者首页管理模块 
 * Date: 2023-01-15 07:48:00 
 * Ver : CCMiniCloud Framework 2.0.8 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectWorkService = require('./base_project_work_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const md5Lib = require('../../../../framework/lib/md5_lib.js');

const MemberModel = require('../../model/member_model.js');
const TaskModel = require('../../model/task_model.js'); 

class WorkHomeService extends BaseProjectWorkService {


	/**
	 * 首页数据归集
	 */
	async workHome(memberId) {
		let member = await MemberModel.getOne(memberId);
		if (!member) this.AppError('工作人员不存在');

		let where = {
			TASK_MEMBER_ID: memberId
		}

		where.TASK_STATUS = TaskModel.STATUS.APPT;
		let apptTaskCnt = await TaskModel.count(where);

		where.TASK_STATUS = TaskModel.STATUS.RUN;
		let runTaskCnt = await TaskModel.count(where);

		where.TASK_STATUS = TaskModel.STATUS.OVER;
		let overTaskCnt = await TaskModel.count(where); 
	 

		return {
			taskStat: { apptTaskCnt, runTaskCnt, overTaskCnt },
			pic: member.MEMBER_OBJ.img[0],
		};

	}


	// 登录  
	async workLogin(phone, password, openId) {


		// 判断是否存在
		let where = {
			MEMBER_PHONE: phone,
			MEMBER_PASSWORD: md5Lib.md5(password),
			MEMBER_STATUS: MemberModel.STATUS.COMM
		}
		let fields = '*';
		let member = await MemberModel.getOne(where, fields);
		if (!member)
			this.AppError('该账号不存在或者密码错误');

		let cnt = member.MEMBER_LOGIN_CNT;

		// 生成token
		let token = dataUtil.genRandomString(32);
		let tokenTime = timeUtil.time();
		let data = {
			MEMBER_MINI_OPENID: openId,
			MEMBER_TOKEN: token,
			MEMBER_TOKEN_TIME: tokenTime,
			MEMBER_LOGIN_TIME: timeUtil.time(),
			MEMBER_LOGIN_CNT: cnt + 1
		}
		await MemberModel.edit(where, data);

		let name = member.MEMBER_TITLE;
		let id = member._id;
		let last = (!member.MEMBER_LOGIN_TIME) ? '尚未登录' : timeUtil.timestamp2Time(member.MEMBER_LOGIN_TIME);
		let cateId = member.MEMBER_CATE_ID;
		let cateName = member.MEMBER_CATE_NAME;

		return {
			id,
			token,
			name,
			last,
			cateId,
			cateName,
			cnt
		}

	}

	/** 修改自身密码 */
	async pwdWork(workId, oldPassword, password) {
		this.AppError('[校园报修]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

}

module.exports = WorkHomeService;