
// base page html
//  <div class="AccountPage" style="bottom: 50px;">
//     <div class="pageIndex" id="pageIndex_01"></div>
//     <div class="firstPage" id="firstPage_01">首页</div>
//     <div class="prePage" id="prePage_01">上一页</div>
//     <div class="totalPage" id="totalPage_01"><div class="Pages ActivityPage">1</div></div>\
//     <div class="nextPage" id="nextPage_01">下一页</div>
//     <div class="lastPage" id="lastPage_01">尾页</div>
//     <div class="currentPage" id="currentPage_01">到第<input type="text" value="1" id="toPage_01">页</div>\
//     <div id="goPage">确定</div>
// </div>

define(function(require, exports, module) {
	require("modules/topBottom");
	require("lib/underscore");
	require("lib/bootstrap.min");

	var $ = require('lib/jquery'),
		JSON = require('lib/json2'),
		Ajax = require('manager/ajax'),
		Utils = require('manager/utils'),
		MyRewardTemp = require('manager/myRewardTemp'),
		ModelTemp = require('manager/modelTemp'),
		MYACCOUNT = require('modules/myAccount');
	User = require('modules/user');
	Validates = require("manager/validateUtils");

	var app = {
		init: function(ajaxDates) {

			var _this = this;
			_this.pageSize1 = 8;
			_this.pageNo1 = 1;
			_this.totalPage1 = 1;
			_this.filter1 = 0;
			_this.showPage1 = 4;  //分页显示的按钮的总数

			_this.pageSize2 = 8;
			_this.pageNo2 = 1;
			_this.totalPage2 = 1;
			_this.filter2 = 0;
			_this.showPage2 = 4;  //分页显示的按钮的总数


			_this.ruleMap = {};
			_this.getAmount();
			//$('#modal_JXQ_history').modal('show')  
			_this.filterClick();
		},

		getAmount: function() {
			var _this = this;
			User.activityCount({}, function(json) {
				var activityCountList = json.activityCountList;
				var data = {}
				data.hongbaoTemp01 = 0;
				data.jaxiquanTemp01 = 0;
				data.tiyanjinTemp01 = 0;
				data.hongbaoTemp02 = 0;
				data.jaxiquanTemp02 = 0;
				data.tiyanjinTemp02 = 0;
				_.forEach(activityCountList, function(activity, index) {
					if (activity.activityType == "01") {
						data.tiyanjinTemp01 = data.tiyanjinTemp01 + activity.totalAmount;
						data.tiyanjinTemp02 = data.tiyanjinTemp02 + activity.totalUsedCount;
					} else if (activity.activityType == "02") {
						data.hongbaoTemp01 = data.hongbaoTemp01 + activity.incomeAmount;
						_this.hongbaozhone = _this.hongbaozhone + activity.incomeAmount;
						data.hongbaoTemp02 = data.hongbaoTemp02 + activity.incomeUsedAmount;
					} else if (activity.activityType == "03") {
						data.jaxiquanTemp01 = data.jaxiquanTemp01 + activity.totalCount;
						data.jaxiquanTemp02 = data.jaxiquanTemp02 + activity.totalUsedCount;
					}
				});
				$(".myAccout_1").append($(Mustache.render(MyRewardTemp.myAccount_4, data)));
				_this.tiYanJin();
				_this.hongbao();
				_this.jiaxiquan();
				_this.pageButtonInit("_01");
				_this.pageButtonInit("_02");
				_this.sendCertiCode();
				_this.redTotalAmount = 0;
				User.getBankInfo({
					"payAccount": {
						"status": "1"
					}
				}, function(json) {
					_this.json = json[0];
					if (_this.json == null || _this.json == "" || _this.json.length <= 0) {
						//发送status为1，获取status是1--已生效的红包集合
						User.userActivityList({
							'userActivity': {
								"activityType": "02",
								"status": "1",
								"pageNo": 1,
								"pageSize": 100
							}
						}, function(json) {
							if (json.userActivityList && json.userActivityList.length > 0) {
								_.forEach(json.userActivityList, function(userActivity, index) {
									_this.redTotalAmount = _this.redTotalAmount + userActivity.incomeAmount;
								})
							}
							$(".hongbaozhone").html(_this.redTotalAmount);
							$("#redTotalAmount").html(_this.redTotalAmount);
						});
					} else {
						_this.json.accountNo = Utils.bankEnd4No(_this.json.accountNo);
						$("#userBankInfo").html(_this.json.accountName + "（尾号<span>" + _this.json.accountNo + "</span>）");
						User.userActivityList({
							'userActivity': {
								"activityType": "02",
								"status": "1",
								"pageNo": 1,
								"pageSize": 100
							}
						}, function(json) {
							if (json.userActivityList && json.userActivityList.length > 0) {
								_.forEach(json.userActivityList, function(userActivity, index) {
									_this.redTotalAmount = _this.redTotalAmount + userActivity.incomeAmount;
								})
							}
							$(".hongbaozhone").html(_this.redTotalAmount);
							$("#redTotalAmount").html(_this.redTotalAmount);
							_this.successBankIfor = "已将<span>" + _this.redTotalAmount + "</span>元现金划转至您" + _this.json.accountName + "（尾号<span>" + _this.json.accountNo + "</span>）的银行卡，"
						});
					}

					$("#tixian").click(function() {
						if (_this.redTotalAmount < 50) {
							$(".modal_RPGetBtn").parent().addClass("hide");
							$("#failInfo").html("金额不足50不能提取");
							$(".modal_RPGetFail").removeClass("hide");

							$("#retToRed").click(function() {
								$("#modal_redPackageGet").modal("hide");
							});
						}
						$("#modal_redPackageGet").modal();
					});
					$(".modal_RPGetBtn").on("click", function() {
						_this.tixian(this);
					});
				});
			});
		},

		tiYanJin: function() {
			var _this = this;
			User.userActivityList({
				'userActivity': {
					"activityType": "01",
					"pageNo": 1,
					"pageSize": 100
				}
			}, function(json) {
				var userActivityList = json.userActivityList;
				if (userActivityList != null && userActivityList != '' && userActivityList.length > 0) {
					var isFirst = true;
					_.forEach(userActivityList, function(userActivity, index) {
						var has = userActivity.userActivityId in _this.ruleMap;
						if (has) {
							delete _this.ruleMap[userActivity.userActivityId];
						}
						_this.ruleMap[userActivity.userActivityId] = userActivity;

						//预计收益字段使用expectedIncome,
						//计算规则：体验金*利率*时间/365
						if (userActivity.expectedIncome == null || userActivity.expectedIncome == '') {
							userActivity.expectedIncome = '--';
						} else {
							userActivity.expectedIncome = (userActivity.expectedIncome).toFixed(2);
							userActivity.expectedIncome = Utils.addComma(userActivity.expectedIncome);
							userActivity.expectedIncome += '元';
						}


						userActivity.expectDueDate = userActivity.endDate + 24 * 60 * 60 * 1000;
						userActivity.expectDueDate = Utils.date3Format(userActivity.expectDueDate);
						userActivity.beginDate = Utils.date3Format(userActivity.beginDate);
						if (userActivity.endDate == null || userActivity.endDate == '') {
							userActivity.endDate = Utils.date3Format(userActivity.endDate);
						} else {
							userActivity.endDate = Utils.date3Format(userActivity.endDate - 1 * 60 * 1000); //将计息截止日期减去1分钟
						}

						userActivity.activityDate = Utils.date3Format(userActivity.activityDate);
						userActivity.principal = Utils.addComma(userActivity.principal);
						userActivity.createDate = Utils.date3Format(userActivity.createDate);
						if (userActivity.expireDate == null || userActivity.expireDate == '') {
							userActivity.expireDate = Utils.date3Format(userActivity.expireDate);
						} else {
							userActivity.expireDate = Utils.date3Format(userActivity.expireDate - 1 * 60 * 1000); //将有效日期减去1分钟
						}

						userActivity.buttonFlag = false;

						if (userActivity.activeFlag == "1" && isFirst) {
							isFirst = false;
							userActivity.buttonFlag = true;
						}

						if (userActivity.activityType == '01') {
							if (userActivity.status == 0) { //未使用
								$(".TYJDetail ul").append($(Mustache.render(MyRewardTemp.tiyanjin_V_420.tiyanjin1, userActivity)));
								$("#toActivity-" + userActivity.userActivityId).click(function() {
									window.location.href = "/p/pages/invest.html"
								});
							} else if (userActivity.status == 3) { //已体验
								$(".TYJDetail ul").append($(Mustache.render(MyRewardTemp.tiyanjin_V_420.tiyanjin2, userActivity)));
							} else if (userActivity.status == 6) { //过期
								$(".TYJDetail ul").append($(Mustache.render(MyRewardTemp.tiyanjin_V_420.tiyanjin3, userActivity)));
							} else { //体验中
								$(".TYJDetail ul").append($(Mustache.render(MyRewardTemp.tiyanjin_V_420.tiyanjin4, userActivity)));
							}
						}

					});
					_this.style();
				}

			});
		},

		hongbao: function() {
			var _this = this;
			/*_this.ruleMap.map(function(index,domElement){
				if(domElement.activityType=="02"){
					delete _this.ruleMap[userActivity.userActivityId];
				}
			});*/
			User.userActivityListFilter({
				'userActivity': {
					"activityType": "02",
					"activityTypeFilter": _this.filter1,
					"pageNo": _this.pageNo1,
					"pageSize": _this.pageSize1
				}
			}, function(json) {
				$("#redPackageList").empty();

				var userActivityList = json.userActivityList;

				if (userActivityList != null && userActivityList != '' && userActivityList.length > 0) {

					_this.totalPage1 = Utils.totalPage(json.totalCount, _this.pageSize1);
					$("#pageIndex_01").html('第' + _this.pageNo1 + "页/共" + _this.totalPage1 + '页');
					//生成分页页码
					_this.recordPage('_01');

					if (_this.pageNo1 == 1) {
						$("#prePage_01").css("background", "url(../images/myAccount/TL.png) no-repeat center");
					}
					if (_this.pageNo1 == _this.totalPage1) {
						$("#nextPage_01").css("background", "url(../images/myAccount/TR.png) no-repeat center");
					}
					_.forEach(userActivityList, function(userActivity, index) {
						var has = userActivity.userActivityId in _this.ruleMap;
						if (has) {
							delete _this.ruleMap[userActivity.userActivityId];
						}
						_this.ruleMap[userActivity.userActivityId] = userActivity;
						userActivity.expectDueDate = userActivity.endDate + 24 * 60 * 60 * 1000;
						userActivity.expectDueDate = Utils.date3Format(userActivity.expectDueDate);
						userActivity.beginDate = Utils.date3Format(userActivity.beginDate);
						userActivity.endDate = Utils.date3Format(userActivity.endDate);
						userActivity.activityDate = Utils.date3Format(userActivity.activityDate);
						userActivity.principal = Utils.addComma(userActivity.principal);
						userActivity.incomeAmount = Utils.addComma(userActivity.incomeAmount);
						userActivity.createDate = Utils.date3Format(userActivity.createDate);
						userActivity.expireDate = Utils.date3Format(userActivity.expireDate);

						//weishengxiao--未生效
						//yishengxiao--已生效
						//yilingqu--已领取
						//yiguoqi--已过期
						if (userActivity.activityType == '02') {

							if (userActivity.status == 0) { //未激活
								userActivity.statusName = "未激活";
								$("#redPackageList").append($(Mustache.render(MyRewardTemp.hongbao_V_420.weijihuo, userActivity)));
							} else if (userActivity.status == 2 || userActivity.status == 3) { //已领取
								userActivity.statusName = "已领取";
								$("#redPackageList").append($(Mustache.render(MyRewardTemp.hongbao_V_420.yilingqu, userActivity)));
							} else if (userActivity.status == 6) { //已过期
								userActivity.statusName = "已过期";
								$("#redPackageList").append($(Mustache.render(MyRewardTemp.hongbao_V_420.yiguoqi, userActivity)));
							} else { //已激活
								userActivity.statusName = "已激活";
								$("#redPackageList").append($(Mustache.render(MyRewardTemp.hongbao_V_420.yijihuo, userActivity)));
							}
						}

					});
					_this.style();

				} else {
					_this.totalPage1 = 1;
					_this.pageNo1 = 1;
					$("#redPackageList").append('<p>暂无此奖励红包</p>');
					//生成分页页码
					_this.recordPage('_01');
				}
				_this.filterClick(); //重新绑定filter点击事件，防止多次点击

			});
		},

		jiaxiquan: function() {
			var _this = this;
			/*_this.ruleMap.map(function(index,domElement){
				if(domElement.activityType=="03"){
					delete _this.ruleMap[userActivity.userActivityId];
				}
			});*/
			User.userActivityListFilter({
				'userActivity': {
					"activityType": "03",
					"activityTypeFilter": _this.filter2,
					"pageNo": _this.pageNo2,
					"pageSize": _this.pageSize2
				}
			}, function(json) {
				$("#JXQList").empty();
				var userActivityList = json.userActivityList;
				if (userActivityList != null && userActivityList != '' && userActivityList.length > 0) {

					_this.totalPage2 = Utils.totalPage(json.totalCount, _this.pageSize2);
					$("#pageIndex_02").html('第' + _this.pageNo2 + "页/共" + _this.totalPage2 + '页');
					//生成分页页码
					_this.recordPage('_02');

					if (_this.pageNo2 == 1) {
						$("#prePage_02").css("background", "url(../images/myAccount/TL.png) no-repeat center");
					}
					if (_this.pageNo2 == _this.totalPage2) {
						$("#nextPage_02").css("background", "url(../images/myAccount/TR.png) no-repeat center");
					}
					_.forEach(userActivityList, function(userActivity, index) {
						var has = userActivity.userActivityId in _this.ruleMap;
						if (has) {
							delete _this.ruleMap[userActivity.userActivityId];
						}
						_this.ruleMap[userActivity.userActivityId] = userActivity;
						userActivity.expectDueDate = userActivity.endDate + 24 * 60 * 60 * 1000;
						userActivity.expectDueDate = Utils.date2Format(userActivity.expectDueDate);
						userActivity.beginDate = Utils.date3Format(userActivity.beginDate);
						userActivity.endDate = Utils.date3Format(userActivity.endDate);
						userActivity.activityDate = Utils.date3Format(userActivity.activityDate);
						userActivity.principal = Utils.addComma(userActivity.principal);
						userActivity.incomeAmount = Utils.addComma(userActivity.incomeAmount);
						userActivity.createDate = Utils.date3Format(userActivity.createDate);
						userActivity.expireDate = Utils.date3Format(userActivity.expireDate);
						userActivity.payTime = Utils.date3Format(userActivity.payTime);
						if (userActivity.activityType == '03') {

							switch (true) {
								case userActivity.status == 0: //未使用
									$("#JXQList").append($(Mustache.render(MyRewardTemp.JXQ_V_420.canUse, userActivity)));
									break;
								case userActivity.status == 6: //已过期
									$("#JXQList").append($(Mustache.render(MyRewardTemp.JXQ_V_420.timeout, userActivity)));
									break;
								default: //已使用
									$("#JXQList").append($(Mustache.render(MyRewardTemp.JXQ_V_420.used, userActivity)));
									break;
							}
						}
					});
					_this.style();
					_this.JXQ_history_modal(); //加息券使用记录模态框

				} else {
					_this.pageNo2 = 1;
					_this.totalPage2 = 1;
					$("#JXQList").append("<div class='account4_JXQ'><p>您暂无此加息券</p><p id='toInvest'>去投资领取加息券</p></div>");
					//生成分页页码
					_this.recordPage('_02');
					$("#toInvest").on("click", function() {
						window.location.href = "/p/pages/invest.html";
					});
					// $("#showAddInterest").append("<div class='account4_JXQ'><p>您暂无账户奖励加息券</p><p id='toInvest'>去投资领取加息券</p></div>");
					// $("#toInvest").on("click", function(){
					// 	window.location.href = "/p/pages/invest.html";
					// });
					//$(".JXQList").hide();
				}
				_this.filterClick(); //重新绑定filter点击事件，防止多次点击


			});
		},

		//start 显示详细的模态框事件 
		style: function() {
			var _this = this;
			$(".userActivity").unbind();
			$(".userActivity").on('click', function() {
				var id = $(this).attr('id');
				_this.addDetail(id);
			});
		},

		addDetail: function(key) {
			var _this = this;
			var userActivity = _this.ruleMap[key];
			userActivity.accountName = "--";
			userActivity.accountNo = "--";
			if (userActivity.activityType == "01") {
				$("#modal_body01").empty();
				User.getExperienceGold({
					"userActivity": {
						"userActivityId": userActivity.userActivityId
					}
				}, function(json) {
					if (userActivity.status == 3) {
						userActivity.accountName = json.experienceGoldActivityVo.accountName;
						userActivity.accountNo = json.experienceGoldActivityVo.accountNo;
					}
					if (userActivity.status == 0) { //未使用
						$("#modal_body01").append($(Mustache.render(ModelTemp.modal_body01, userActivity)));
						$("#modal_TYJDDiv3-" + userActivity.userActivityId).click(function() {
							window.location.href = "/p/pages/invest.html"
						});
					} else { //体验中
						$("#modal_body01").append($(Mustache.render(ModelTemp.modal_body02, userActivity)));
					}

					_.forEach(json.experienceGoldActivityVo.activityItemList, function(activityItem, index) {
						$(".modal_TYJDDiv1R").append($(Mustache.render(ModelTemp.row, activityItem)));
					});
				});

			} else if (userActivity.activityType == "02") {
				//红包详情
				$("#modal_body02").empty();
				if (userActivity.status == 6) { //已过期
					userActivity.statusName = "已过期";
					$("#modal_body02").append($(Mustache.render(ModelTemp.modal_body04_YGQ, userActivity)));
				} else if (userActivity.status == 2 || userActivity.status == 3) { //已领取
					userActivity.statusName = "已领取";
					$("#modal_body02").append($(Mustache.render(ModelTemp.modal_body04, userActivity)));
				} else if (userActivity.status == 1) { //已激活
					userActivity.statusName = "已激活";
					$("#modal_body02").append($(Mustache.render(ModelTemp.modal_body03_YjH, userActivity)));
				} else {
					userActivity.statusName = "未激活";
					$("#modal_body02").append($(Mustache.render(ModelTemp.modal_body03, userActivity)));
				}
			} else if (userActivity.activityType == "03") {
				$("#modal_body03").empty();
				$("#modal_body03").append($(Mustache.render(ModelTemp.modal_body05, userActivity)));

			}
		},
		//end 显示详细的模态框事件 

		//start filterBtn 事件
		filterClick: function() {
			var _this = this;
			$(".filterBtnGroup span").on('click', function() {
				$(".filterBtnGroup span").unbind(); //span防止多次点击,在ajax请求结束之后再绑上
				var
					filterType = $(this).attr('data-status'),
					activityType = $(this).attr('data-type');
				$(this).addClass('active').siblings().removeClass('active');
				_this.filterDetail(filterType, activityType);
			});
		},

		/**
		 * @param activityType 属于红包还是加息券
		 * @param filterType 筛选条件
		 * tips: 在筛选按钮点击的时候，全局对象_this.filter变了，所以不用点击分页的时候去取这个值,同时分页的配置都是全局变量，不需要再次取数据
		 */
		filterDetail: function(filterType, activityType) {
			var _this = this;

			if (activityType == "01") {
				_this.filter1 = filterType;
				_this.hongbao();
				_this.pageNo1 = 1;
				$('#toPage_01').val(_this.pageNo1);
				_this.pageButtonInit("_01");
			} else if (activityType == "03") {
				_this.filter2 = filterType;
				_this.jiaxiquan();
				_this.pageNo2 = 1;
				$('#toPage_02').val(_this.pageNo2);
				_this.pageButtonInit("_02");
			}
		},

		//end filterBtn 事件
		pageButtonInit: function(sign) {
			var _this = this;
			var flag = true;



			$("#prePage" + sign).on("click", function() {
				if (sign == "_01") {
					_this.pageNo1 = _this.pageNo1 - 1;
					if (_this.pageNo1 < 1) {
						_this.pageNo1 = 1;
					}
				} else {
					flag = false;
					_this.pageNo2 = _this.pageNo2 - 1;
					if (_this.pageNo2 < 1) {
						_this.pageNo2 = 1;
					}
				}
				_this.getPageInfor(flag);
			});
			$("#nextPage" + sign).on("click", function() {
				if (sign == "_01") {
					_this.pageNo1 = _this.pageNo1 + 1;
					if (_this.pageNo1 > _this.totalPage1) {
						_this.pageNo1 = _this.totalPage1;
					}
				} else {
					flag = false;
					_this.pageNo2 = _this.pageNo2 + 1;
					if (_this.pageNo2 > _this.totalPage2) {
						_this.pageNo2 = _this.totalPage2;
					}
				}
				_this.getPageInfor(flag);
			});
			//首页
			$("#firstPage" + sign).on("click", function() {
				if (sign == "_01") {
					_this.pageNo1 = 1;
				} else {
					flag = false;
					_this.pageNo2 = 1;
				}
				_this.getPageInfor(flag);
			});
			//尾页
			$("#lastPage" + sign).on("click", function() {
				if (sign == "_01") {
					_this.pageNo1 = _this.totalPage1;
				} else {
					flag = false;
					_this.pageNo2 = _this.totalPage1;
				}
				_this.getPageInfor(flag);
			});
			//页码点击
			$("#totalPage" + sign).on("click", ".Pages", function() {
				if ($(this).text() != "...") {
					if (sign == "_01") {
						_this.pageNo1 = parseInt($(this).text());
					} else {
						flag = false;
						_this.pageNo2 = parseInt($(this).text());
					}
					_this.getPageInfor(flag);
				}
			});

			$('#goPage').on("click", function() {
				var $toPageNum = $('#toPage_01').val();
				if (/^\d+$/.test($toPageNum)) {
					$toPageNum = parseInt($toPageNum);
					if ((1 <= $toPageNum) && ($toPageNum <= _this.totalPage1) && (_this.pageNo1 !== $toPageNum)) {
						_this.pageNo1 = $toPageNum;
						_this.hongbao();
					}
				} else {
					$('#toPage_01').val(_this.pageNo1);
				}
			}); //end topageBtn

			$('#goPage2').on("click", function() {
				var $toPageNum = $('#toPage_02').val();
				if (/^\d+$/.test($toPageNum)) {
					$toPageNum = parseInt($toPageNum);
					if ((1 <= $toPageNum) && ($toPageNum <= _this.totalPage2) && (_this.pageNo2 !== $toPageNum)) {
						_this.pageNo2 = $toPageNum;
						_this.jiaxiquan();
					}
				} else {
					$('#toPage_02').val(_this.pageNo2);
				}
			}); //end topageBtn

		},

		//生成分页页码
		recordPage: function(sign) {

			var _this = this;
			var start = 1,
			end = 1,
			recordPageNo = 1, //当前第几页
			recordTotalPage = 1; //分页总数
			
			if (sign == "_01") {
				recordPageNo = _this.pageNo1;
				recordTotalPage = _this.totalPage1;
				showPageNumber = _this.showPage1 || 3; //显示的分页按钮数量
			} else {
				recordPageNo = _this.pageNo2;
				recordTotalPage = _this.totalPage2;
				showPageNumber = _this.showPage2 || 3;
			}

			var pageMathIndex = Math.floor(showPageNumber / 2);

			if (recordTotalPage < showPageNumber) {
				start = 1;
				end = recordTotalPage;
			} else {
				if (recordTotalPage - pageMathIndex < recordPageNo) {
					start = recordTotalPage - showPageNumber + 1;
					end = recordTotalPage;
				} else {
					if (recordPageNo - pageMathIndex <= 1) {
						start = 1;
						end = showPageNumber;
					} else {
						start = recordPageNo - pageMathIndex;
						end = recordPageNo + pageMathIndex;
					}
				}

			}
			
			// if (recordPageNo - 1 <= 0) {
			// 	start = 1;
			// } else {
			// 	start = recordPageNo - 1;
			// }
			// if (recordPageNo + 1 >= recordTotalPage) {
			// 	end = recordTotalPage;
			// } else {
			// 	end = recordPageNo + 1;
			// }


			$("#totalPage" + sign).html('');
			if (start > 1) {
				$("#totalPage" + sign).append("<div class='Pages'>...</div>");
			}
			for (var i = start; i <= end; i++) {
				if (i == recordPageNo) {
					$("#totalPage" + sign).append("<div class='Pages ActivityPage'>" + i + "</div>");
				} else {
					$("#totalPage" + sign).append("<div class='Pages'>" + i + "</div>");
				}
			}
			if (end < recordTotalPage) {
				$("#totalPage" + sign).append("<div class='Pages'>...</div>");
			}

		},

		getPageInfor: function(flag) {

			var _this = this;
			if (flag) {
				$("#toPage_01").val(_this.pageNo1);
				_this.hongbao();
			} else {
				$("#toPage_02").val(_this.pageNo2);
				_this.jiaxiquan();
			}
		},

		//加息券使用记录模态框
		JXQ_history_modal: function() {
			$('.JXQList').on('click', '.usedHistory', function() {
				$('#modal_JXQ_history .investName').text('');
				$('#modal_JXQ_history .investMoney').text('');
				$('#modal_JXQ_history .investDate').text('');
				var parent = $(this).parent();
				var investName = parent.find('.modal_cont .investName').text(),
					investMoney = parent.find('.modal_cont .investMoney').text(),
					investDate = parent.find('.modal_cont .investDate').text();
				$('#modal_JXQ_history .investName').text(investName);
				$('#modal_JXQ_history .investMoney').text(Utils.addComma(investMoney) + '元');
				$('#modal_JXQ_history .investDate').text(investDate);

				$('#modal_JXQ_history').modal('show');
			})
		},

		tixian: function(obj) {
			var _this = this;
			if (!$(obj).attr("disabled") || $(obj).attr("disabled") == false) {
				if (Validates.isNotEmpty($("#verificationCode").val(), "短信验证码", true)) {
					$(obj).attr("disabled", true);
					User.redEnvelopeReflected({
						"userActivity": {
							"verificationCode": $("#verificationCode").val()
						}
					}, function(json) {
						$(obj).removeAttr("disabled");
						$(obj).parent().addClass("hide");
						if (json.success) {
							$("#successInfo").html(_this.successBankIfor);
							$(".modal_RPGetSucc").removeClass("hide");
						} else {
							$("#failInfo").html(json.responseTrans.msg);
							$(".modal_RPGetFail").removeClass("hide");
						}

						$("#retToRed").click(function() {
							$(".modal_RPGetBtn").parent().removeClass("hide");
							$(".modal_RPGetFail").addClass("hide");
						});
					});
				}
			}
		},

		loadCaptchaImg: function() {
			var _this = this;
			_this.captchaImg = $("#captchaImg");
			_this.loadImg();
			_this.captchaImg.on("click", function() {
				_this.loadImg();
			});
		},

		returnSrc: function() {
			return Ajax.urlAddress + "zxjcaptcha.svl?d=" + Math.random();
		},

		loadImg: function() {
			var _this = this;
			_this.captchaImg.attr("src", _this.returnSrc());
		},

		/**
		 * 发送验证码
		 */
		sendCertiCode: function() {
			var _this = this;
			_this.loadCaptchaImg();
			_this.captcha = $("#captcha");
			$("#sendMsg").on('click', function() {
				if (!$(this).attr("disabled") || $(this).attr("disabled") == false) {
					if (Validates.isNotEmpty(_this.captcha.val(), "图形验证码", true)) {
						$(this).attr("disabled", true);
						Utils.timer($(this), $(this));
						User.smsSendByUserId({
							"smsVo": {
								"captcha": _this.captcha.val()
							}
						}, Ajax.transType.redEnvelopeReflected);
					}
				}
			});
		}
	}

	module.exports = app;
});