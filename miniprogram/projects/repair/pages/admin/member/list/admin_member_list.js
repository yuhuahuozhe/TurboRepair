const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const MemberBiz = require('../../../../biz/member_biz.js');
const AdminMemberBiz = require('../../../../biz/admin_member_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		wx.setNavigationBarTitle({
			title: projectSetting.MEMBER_NAME + '-管理',
		});
		this.setData({
			MEMBER_NAME: projectSetting.MEMBER_NAME
		});

		//设置搜索菜单
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



	bindStatusSelectTap: async function (e) {
		let itemList = ['启用', '停止使用'];
		let memberId = pageHelper.dataset(e, 'id');
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //启用
						await this._setStatus(this, memberId, 1);
						break;
					}
					case 1: { //停止 
						await this._setStatus(this, memberId, 9);
						break;
					}

				}


			},
			fail: function (res) { }
		})
	},


	bindDelTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;

		let memberId = pageHelper.dataset(e, 'id');
		if (!memberId) return;

		let params = {
			memberId
		}

		let callback = async () => {
			try {
				let opts = {
					title: '删除中'
				}
				await cloudHelper.callCloudSumbit('admin/member_del', params, opts).then(res => {
					pageHelper.delListNode(memberId, this.data.dataList.list, '_id');
					this.data.dataList.total--;
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		pageHelper.showConfirm('确认删除？删除不可恢复', callback);

	},

	_setStatus: async function (that, memberId, status) {
		if (!AdminBiz.isAdmin(this)) return;
		if (!memberId) return;

		let params = {
			memberId,
			status
		}
		try {
			await cloudHelper.callCloudSumbit('admin/member_status', params).then(res => {
				pageHelper.modifyListNode(memberId, that.data.dataList.list, 'MEMBER_STATUS', status, '_id');
				that.setData({
					dataList: that.data.dataList
				});
				pageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: async function () {
		let cateIdOptions = MemberBiz.getCateList();

		let sortItem1 = [{ label: '分类', type: '', value: '' }];
		sortItem1 = sortItem1.concat(MemberBiz.getCateList());

		let sortItems = [sortItem1];

		if (sortItem1.length <= 2) sortItems = [];

		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '使用中', type: 'status', value: 1 },
			{ label: '已停用', type: 'status', value: 9 },
		];

		this.setData({
			search: '',
			cateIdOptions,
			sortItems,
			sortMenus,
			isLoad: true
		})


	}

})