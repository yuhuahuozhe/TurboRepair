/**
 * Notes:工作人员后台管理模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2020-11-14 07:48:00 
 */

const BaseBiz = require('../../../comm/biz/base_biz.js'); 
const projectSetting = require('../public/project_setting.js');
const MemberBiz = require('../biz/member_biz.js'); 


class AdminMemberBiz extends BaseBiz {


	static getCateName(cateId) {
		let cateList = projectSetting.MEMBER_CATE;

		for (let k = 0; k < cateList.length; k++) {
			if (cateList[k].id == cateId) return cateList[k].title;
		}
		return '';
	} 


	/** 表单初始化相关数据 */
	static async initFormData() {
		let cateIdOptions = MemberBiz.getCateList();
		return {

			// 选项数据  
			cateIdOptions,

			fields: projectSetting.MEMBER_FIELDS,


			// 表单数据  
			formTitle: '',
			formCateId: (cateIdOptions.length == 1) ? cateIdOptions[0].val : '', 

			formForms: [],
 

			formPhone: '',
			formPassword: '',
 
		}

	}

 

}


/** 表单校验  */
AdminMemberBiz.CHECK_FORM = {
	title: 'formTitle|must|string|min:2|max:50|name=姓名',
	cateId: 'formCateId|must|id|name=分类', 
	phone: 'formPhone|must|string|len:11|name=登陆手机',
	password: 'formPassword|string|min:6|max:30|name=登陆密码',
	forms: 'formForms|array', 
};


module.exports = AdminMemberBiz;