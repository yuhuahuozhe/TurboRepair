const TaskBiz = require('../../../biz/task_biz.js'); 
const pageHelper = require('../../../../../helper/page_helper.js'); 
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
		fields: projectSetting.TASK_COMMENT_FIELDS,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {   
		if (!pageHelper.getOptions(this, options)) return;

		TaskBiz.loadDetail(this);
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
		await TaskBiz.loadDetail(this);
		wx.stopPullDownRefresh();
	},

	url: async function (e) {
		pageHelper.url(e, this);
	},



	bindCheckTap: async function (e) {
		this.selectComponent("#task-form-show").checkForms();
	},

	bindSubmitCmpt: async function (e) { 
		let forms = e.detail;

		try {
			let id = this.data.id;
			let params = {
				id,
				forms
			}
			await cloudHelper.callCloudSumbit('task/comment', params);
			await cloudHelper.transFormsTempPics(forms, 'task/', id, 'task/comment_update_forms');

			let cb = () => {
				let node = {
					'TASK_COMMENT_STATUS': 1
				}
				pageHelper.modifyPrevPageListNodeObject(id, node);

				wx.navigateBack();
			};
			pageHelper.showNoneToast('评价成功', 2000, cb);
		} catch (err) {
			console.log(err);
		}

	},

})