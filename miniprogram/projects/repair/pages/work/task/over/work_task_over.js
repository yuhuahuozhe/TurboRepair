const WorkBiz = require('../../../../biz/work_biz.js'); 
const pageHelper = require('../../../../../../helper/page_helper.js'); 
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		fields: projectSetting.TASK_OVER_FIELDS,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!WorkBiz.isWork(this)) return;
		if (!pageHelper.getOptions(this, options)) return;

		WorkBiz.loadDetail(this);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () { },

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

	async onPullDownRefresh() {
		await WorkBiz.loadDetail(this);
		wx.stopPullDownRefresh();
	},

	url: async function (e) {
		pageHelper.url(e, this);
	},



	bindCheckTap: async function (e) {
		this.selectComponent("#task-form-show").checkForms();
	},

	bindSubmitCmpt: async function (e) {
		if (!WorkBiz.isWork(this)) return;
		let forms = e.detail;

		try {
			let id = this.data.id;
			let params = {
				id,
				forms
			}
            await cloudHelper.callCloudSumbit('work/task_over', params);
            
            let timeHelper = require('../../../../../../helper/time_helper');
			await cloudHelper.transFormsTempPics(forms,'task-day/' + timeHelper.time('Y-M-D') + '/', id, 'work/task_update_over_forms');

			let cb = () => {
				let node = {
					'TASK_STATUS': 9
				}
				pageHelper.modifyPrevPageListNodeObject(id, node);

				wx.navigateBack();
			};
			pageHelper.showNoneToast('处理完成', 2000, cb);
		} catch (err) {
			console.log(err);
		}

	},

})