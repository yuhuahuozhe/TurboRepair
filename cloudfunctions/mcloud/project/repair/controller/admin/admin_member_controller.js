/**
 * Notes: 预约模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-12-08 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');
const AdminMemberService = require('../../service/admin/admin_member_service.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const MemberModel = require('../../model/member_model.js');
const contentCheck = require('../../../../framework/validate/content_check.js');

class AdminMemberController extends BaseProjectAdminController {

	async statusMember() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			memberId: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let title = await MemberModel.getOneField(input.memberId, 'MEMBER_TITLE');

		let service = new AdminMemberService();
		await service.statusMember(input.memberId, input.status);

		if (title)
			this.logOther('修改了工作人员《' + title + '》的状态为：' + MemberModel.getDesc('STATUS', input.status));
	}



	/** 预约项目列表 */
	async getMemberList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int|default=10',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMemberService();
		let result = await service.getMemberList(input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].MEMBER_ADD_TIME = timeUtil.timestamp2Time(list[k].MEMBER_ADD_TIME);
		}
		result.list = list;

		return result;

	}

	/** 发布 */
	async insertMember() {
		await this.isAdmin();

		let rules = {
			title: 'must|string|min:2|max:50|name=姓名',
			cateId: 'must|id|name=分类',
			cateName: 'must|string|name=分类',
			phone: 'string|len:11|name=登陆手机',
			password: 'string|min:6|max:30|name=登陆密码',
			forms: 'array|name=表单'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminMemberService();
		let result = await service.insertMember(input);


		this.logOther('创建了新的工作人员《' + input.title + '》');

		return result;

	}  

	async getMemberDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminMemberService();
		let detail = await service.getMemberDetail(input.id);
		return detail;
	}

	async editMember() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			title: 'must|string|min:2|max:50|name=姓名',
			cateId: 'must|id|name=分类',
			cateName: 'must|string|name=分类',
			phone: 'string|len:11|name=登陆手机',
			password: 'string|min:6|max:30|name=登陆密码',
			forms: 'array|name=表单'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminMemberService();
		let result = service.editMember(input);


		this.logOther('修改了工作人员《' + input.title + '》');

		return result;
	}


	/** 更新图片信息 */
	async updateMemberForms() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminMemberService();
		return await service.updateMemberForms(input);
	}


	async delMember() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			memberId: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let title = await MemberModel.getOneField(input.memberId, 'MEMBER_TITLE');

		let service = new AdminMemberService();
		await service.delMember(input.memberId);


		if (title)
			this.logOther('删除了工作人员《' + title + '》');
	}
}

module.exports = AdminMemberController;