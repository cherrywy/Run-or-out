var Modal = require('../modules/modal.js');

var app = new Vue({
	el: '#so-v-date',
	data: {
		closeTime: 150, //选择后保持时间
		dayList: [],
		monthList: [],
		minMonth: "", //最早到多少月
		maxMonth: "",
		runDayList: [],
		runDayListDistance: [],
		choosedMonth: "",
		weekList: ["日", "一", "二", "三", "四", "五", "六"],
		userInfo: null,
		userStatistics: null,
		today: "",
		notFillNumber: 0,
		signIns: null,
		nextParticipation: null,
		monitorTeam: null,
		participation: null,
		progress: null, //跑步进度
		progressTags: [],
		jsSdK: null
	},
	methods: {
		changeMonth: function(value) {
			//alert(value)
			this.choosedMonth = value;
			app.monthList = [];
			getMonthDayNumber();
			app.monthList.push(app.choosedMonth);
			app.monthList.unshift(getPreMonth(app.choosedMonth));
			app.monthList.push(getNextMonth(app.choosedMonth));

			getCalender(app.choosedMonth, getNextMonth(app.choosedMonth));
		},
	}
});

$(function() {
	//getInfo();
	getToday();

	var date = new Date;
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" + month : month);
	app.choosedMonth = year.toString() + "-" + month.toString();
	app.maxMonth = year.toString() + "-" + month.toString();
	app.monthList.push(app.choosedMonth);
	app.monthList.unshift(getPreMonth(app.choosedMonth));

	getMonthDayNumber();
});


/*function getInfo() {
	$.ajax({
		url: urlGetUserCenter,
		type: "get",
		async: true,
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
		},
		complete: function() {
			$("#loadingToast").hide();
		},
		success: function(data) {
			if (data.status == 200) {
				app.userInfo = data.data.user;
				app.userStatistics = data.data.user_statistics;
				app.signIns = data.data.sign_ins;
				app.nextParticipation = data.data.next_participation;
				app.monitorTeam = data.data.monitor_team;
				app.participation = data.data.participation;
				if (data.data.progress_sign_ins.length != 0) {
					app.progress = data.data.progress_sign_ins;
					app.progress.duration = data.data.required_duration;
				}

				if (app.participation && app.progress) {
					for (var i = 0; i < 7; i++) {
						var info = {};
						for (var j = 0; j < app.progress.length; j++) {
							if (addByTransDate(app.participation.start_date, i) == app.progress[j].date) {
								info.type = "active";
								info.distance = parseInt(app.progress[j].distance).toFixed(0);
								break;
							}
							info.type = "";
							info.distance = "";
						}
						app.progressTags.push(info);
					}
				}

				checkUnfillInfo();
				getDayAndDistance();
			}
		},
		error: function() {
			Alert.show({
				content: "用户信息加载失败，请重试或联系Run妹",
				type: "alert",
				sure: function() {
					window.location.reload();
				}
			})
		}
	})
}*/

/*function getDayAndDistance() {
	app.runDayList = [];
	app.runDayListDistance = [];
	for (var i = 0; i < app.signIns.length; i++) {
		app.runDayList.push(parseInt(app.signIns[i].date.split("-")[2]));
		app.runDayListDistance.push(parseInt(app.signIns[i].distance).toFixed(0));
	}
}*/

function getPreMonth(date) {
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	var days = new Date(year, month, 0);
	days = days.getDate(); //获取当前日期中月的天数
	var year2 = year;
	var month2 = parseInt(month) - 1;
	if (month2 == 0) { //如果是1月份，则取上一年的12月份
		year2 = parseInt(year2) - 1;
		month2 = 12;
	}
	var days2 = new Date(year2, month2, 0);
	days2 = days2.getDate();
	if (month2 < 10) {
		month2 = '0' + month2; //月份填补成2位。
	}
	var t2 = year2 + '-' + month2;

	return t2;
}

function getNextMonth(date) {
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	var days = new Date(year, month, 0);
	days = days.getDate(); //获取当前日期中的月的天数
	var year2 = year;
	var month2 = parseInt(month) + 1;
	if (month2 == 13) {
		year2 = parseInt(year2) + 1;
		month2 = 1;
	}
	var days2 = new Date(year2, month2, 0);
	days2 = days2.getDate();
	if (month2 < 10) {
		month2 = '0' + month2;
	}
	var t2 = year2 + '-' + month2;

	return t2;
}

function getMonthDayNumber() {
	app.dayList = [];
	var arr = app.choosedMonth.split("-");
	var day = new Date(arr[0], arr[1], 0); //本月天数
	var lastDay = new Date(arr[0], ((arr[1] - 1) < 0 ? 11 : (arr[1] - 1)), 0); //上月天数
	var daycount = day.getDate();
	var lastdaycount = lastDay.getDate();
	for (var i = 0; i < daycount; i++) {
		var nowDay = {
			month: parseInt(arr[1]),
			day: i + 1
		}
		app.dayList.push(nowDay);
	}
	//获取当月第一天的星期数
	day.setDate(1);
	var firstWeekDay = day.getDay();
	for (var i = 0; i < firstWeekDay; i++) {
		var nowDay = {
			month: ((arr[1] - 1) < 0 ? 11 : (arr[1] - 1)),
			day: lastdaycount - i
		}

		app.dayList.unshift(nowDay);
	}
}

function getCalender(start_date, finish_date) {
	var startArr = start_date.split("-");
	var startDate = {
		year: parseInt(startArr[0]),
		month: parseInt(startArr[1]),
		day: 1
	}

	var finishArr = finish_date.split("-");
	var finishDate = {
		year: parseInt(finishArr[0]),
		month: parseInt(finishArr[1]),
		day: 1
	}
	$.ajax({
		url: urlGetSignInRecord,
		type: "get",
		async: true,
		data: {
			start_date: startDate,
			finish_date: finishDate
		},
		dataType: "json",
		beforeSend: function() {
			$("#loadingToast").show();
			app.signIns = [];
			getDayAndDistance();
		},
		complete: function() {
			$("#loadingToast").hide();
		},
		success: function(data) {
			if (data.status == 200) {
				app.signIns = data.data.sign_ins;
				getDayAndDistance();
			}
		},
		error: function() {
			Alert.show({
				content: "日历加载失败",
				type: "alert"
			})
		}
	})
}

Vue.filter('backgroundColor', function(value) {
	var color = "";
	if (value < 5 && value > 0) {
		color = "#59ba3a";
	} else if (value >= 5 && value < 10) {
		color = "#3d9fe6";
	} else if (value >= 10 && value < 21) {
		color = "#ea8c2e";
	} else if (value >= 21 && value < 41) {
		color = "#f14246";
	} else if (value >= 41 && value < 99) {
		color = "#8d4bbb";
	} else if (value >= 99) {
		color = "#b8a027";
	} else {
		color = "#c8c8c8";
	}
	return color;
});

Vue.filter('finishDate', function(value) {
	if (value != null && value != '') {
		return addByTransDate(value, 6);
	} else {
		return '--';
	}
});