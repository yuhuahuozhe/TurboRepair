/**
 * Notes: 资讯后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const util = require('../../../../framework/utils/util.js');
const md5Lib = require('../../../../framework/lib/md5_lib.js');

const MemberModel = require('../../model/member_model.js');

class AdminMemberService extends BaseProjectAdminService {

	// 取得可派工人员列表
	async getApptMember(cateId = null) {

		let memberWhere = {
			MEMBER_STATUS: MemberModel.STATUS.COMM
		}
		if (cateId) memberWhere.MEMBER_CATE_ID = cateId;

		let memberFields = 'MEMBER_CATE_ID,MEMBER_CATE_NAME,MEMBER_TITLE';
		let memberOrderBy = {
			'MEMBER_ADD_TIME': 'desc'
		}
		return await MemberModel.getAll(memberWhere, memberFields, memberOrderBy, 200);
	}


	async getMemberList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'MEMBER_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {};
		if (util.isDefined(search) && search) {
			where.MEMBER_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status': {
					// 按类型
					where.MEMBER_STATUS = Number(sortVal);
					break;
				}
				case 'cateId': {
					// 按类型
					where.MEMBER_CATE_ID = sortVal;
					break;
				}
			}
		}

		return await MemberModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}


	async statusMember(id, status) {
		this.AppError('[校园报修]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	// 更新forms信息
	async updateMemberForms({
		id,
		hasImageForms
	}) {
		this.AppError('[校园报修]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	async delMember(id) {
		let where = {
			_id: id
		}

		this.AppError('[校园报修]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	async getMemberDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		return await MemberModel.getOne(where, fields);
	}


	async insertMember({
		title,
		cateId,
		cateName,
		phone,
		password,
		forms
	}) {

		this.AppError('[校园报修]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	async editMember({
		id,
		title,
		cateId,
		cateName,
		phone,
		password,
		forms
	}) {

		this.AppError('[校园报修]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}
}

module.exports = AdminMemberService;