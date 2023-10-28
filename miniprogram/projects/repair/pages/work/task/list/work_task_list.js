const WorkBiz = require('../../../../biz/work_biz.js');
const helper = require('../../../../../../helper/helper.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const timeHelper = require('../../../../../../helper/time_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
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
		if (!WorkBiz.isWork(this)) return;

		if (options && helper.isDefined(options.status)) {
			this.setData({
				isLoad: true,
				_params: {
					sortType: 'status',
					sortVal: options.status,
				}
			});
		}

		await this._getSearchMenu();
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

	url: async function (e) {
		pageHelper.url(e, this);
	},


	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	}, 
 

	bindStatusTap: async function (e) {
		if (!WorkBiz.isWork(this)) return;
		let id = pageHelper.dataset(e, 'id');
		let status = Number(pageHelper.dataset(e, 'status'));
		let params = {
			id,
			status
		}

		let cb = async () => {
			try {
				await cloudHelper.callCloudSumbit('admin/task_status', params).then(res => {
					pageHelper.modifyListNode(id, this.data.dataList.list, 'TASK_STATUS', status, '_id'); 
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('设置成功');
				});
			} catch (e) {
				console.log(e);
			}
		}

		pageHelper.showConfirm('确认执行此操作?', cb);

	},

	_getSearchMenu: async function () {

		let sortItems1 = [
			{ label: '排序', type: 'status', value: '99' },
			{ label: '时间正序', type: 'sort', value: 'TASK_ADD_TIME|asc' },
			{ label: '时间倒序', type: 'sort', value: 'TASK_ADD_TIME|desc' }
		];

		let sortItems2 = [
			{ label: '分类', type: 'status', value: '99' },
		];
		for (let k = 0; k < projectSetting.TASK_TYPE.length; k++) {
			sortItems2.push({ label: projectSetting.TASK_TYPE[k], type: 'type', value: projectSetting.TASK_TYPE[k] });
		} 

		let sortMenus = [
			{ label: '全部', type: 'status', value: '99' }, 
			{ label: '待处理', type: 'status', value: '1' },
			{ label: '处理中', type: 'status', value: '2' },
			{ label: '已完成', type: 'status', value: '9' },
		];


		this.setData({
			search: '',
			sortItems: [sortItems1, sortItems2],
			sortMenus,
			isLoad: true
		})


	}

})