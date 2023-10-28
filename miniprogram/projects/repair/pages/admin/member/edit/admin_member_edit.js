const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const dataHelper = require('../../../../../../helper/data_helper.js');
const validate = require('../../../../../../helper/validate.js');
const AdminMemberBiz = require('../../../../biz/admin_member_biz.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		isEdit: true,

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;
		if (!pageHelper.getOptions(this, options)) return;

		wx.setNavigationBarTitle({
			title: projectSetting.MEMBER_NAME + '-设置'
		});


		this.setData(await AdminMemberBiz.initFormData()); // 初始化表单数据   

		await this._loadDetail();

	},

	_loadDetail: async function () {
		let id = this.data.id;
		if (!id) return;

		let params = {
			id
		};
		let opt = {
			title: 'bar'
		};
		let member = await cloudHelper.callCloudData('admin/member_detail', params, opt);

		if (!member) {
			this.setData({
				isLoad: null
			})
			return;
		}

		this.setData({
			isLoad: true,


			// 表单数据   
			formTitle: member.MEMBER_TITLE,
			formCateId: member.MEMBER_CATE_ID,

			formPhone: member.MEMBER_PHONE,

			formForms: member.MEMBER_FORMS,
		});
	},


	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},



	bindFormEditSubmit: async function () {
		pageHelper.formClearFocus(this);

		if (!AdminBiz.isAdmin(this)) return;

		let data = this.data;

		data = validate.check(data, AdminMemberBiz.CHECK_FORM, this);
		if (!data) return;


		let forms = this.selectComponent("#cmpt-form").getForms(true);
		if (!forms) return;
		data.forms = forms;

		data.cateName = AdminMemberBiz.getCateName(data.cateId);

		try {
			let memberId = this.data.id;
			data.id = memberId;

			// 先修改，再上传 
			await cloudHelper.callCloudSumbit('admin/member_edit', data);

			// 图片
			await cloudHelper.transFormsTempPics(forms, 'member/', memberId, 'admin/member_update_forms');

			let callback = async function () {
				// 更新列表页面数据
				let node = {
					'MEMBER_PHONE': data.phone,
					'MEMBER_TITLE': data.title,
					'MEMBER_CATE_NAME': data.cateName,
				}
				pageHelper.modifyPrevPageListNodeObject(memberId, node);
				wx.navigateBack();

			}
			pageHelper.showSuccToast('编辑成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}

	},



	url: function (e) {
		pageHelper.url(e, this);
	},

})