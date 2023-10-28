const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const AdminMonitorBiz = require('../../../../biz/admin_monitor_biz.js');
const MonitorBiz = require('../../../../biz/monitor_biz.js');
const validate = require('../../../../../../helper/validate.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		wx.setNavigationBarTitle({
			title: projectSetting.MONITOR_NAME + '-添加',
		});

		this.setData(AdminMonitorBiz.initFormData());
		this.setData({
			isLoad: true
		});
	},


	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () { },

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () { },

	url: function (e) {
		pageHelper.url(e, this);
	},
	switchModel: function (e) {
		pageHelper.switchModel(this, e);
	},

	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let data = this.data;
		data = validate.check(data, AdminMonitorBiz.CHECK_FORM, this);
		if (!data) return;


		let forms = this.selectComponent("#cmpt-form").getForms(true);
		if (!forms) return;
		data.forms = forms;

		data.cateName = MonitorBiz.getCateName(data.cateId);

		try {

			// 创建
			let result = await cloudHelper.callCloudSumbit('admin/monitor_insert', data);
			let monitorId = result.data.id;

			// 图片
			await cloudHelper.transFormsTempPics(forms, 'monitor/', monitorId, 'admin/monitor_update_forms');

			let callback = async function () {
				PublicBiz.removeCacheList('admin-monitor-list');
				PublicBiz.removeCacheList('monitor-list');
				wx.navigateBack();

			}
			pageHelper.showSuccToast('添加成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}
	},
})