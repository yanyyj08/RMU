var viewWidth = document.documentElement.clientWidth;
var viewHeight = document.documentElement.clientHeight;

//绘图
var drawChart = function(element, data) {
    var innerTData = data.map(function(item) {
        return item.InnerTemp;
    });
    var innerHData = data.map(function(item) {
        return item.InnerHumidity;
    });
    var outterTData = data.map(function(item) {
        return item.OutterTemp;
    });
    var outterHData = data.map(function(item) {
        return item.OutterHumidity;
    });

    var innerTDataCalc = calcData(innerTData);
    var innerHDataCalc = calcData(innerHData);
    var outterTDataCalc = calcData(outterTData);
    var outterHDataCalc = calcData(outterHData);

    var option1 = {
        grid: {
            bottom: 80
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                return params[0].name + '<br/>' + params[0].seriesName + ' : ' + params[0].value + ' (℃)<br/>' + params[1].seriesName + ' : ' + params[1].value + ' (℃)</br>' + params[2].seriesName + ' : ' + params[2].value + ' (％)<br/>' + params[3].seriesName + ' : ' + params[3].value + ' (％)';
            },
            axisPointer: {
                animation: false
            }
        },
        legend: {
            show: true,
            data: ['内部温度', '外部温度', '内部湿度', '外部湿度'],
            x: 'left'
        },
        dataZoom: [{
            show: true,
            handleSize: 40,
            realtime: true,
            start: 0,
            end: 100
        }, {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
        }],
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                onZero: false
            },
            data: data.map(function(item) {
                return item.UpdateTime.slice(5).replace('T', '\n')
            })
        }],
        yAxis: [{
            name: '温度(℃)',
            type: 'value',
            min: -20,
            max: 50
        }, {
            name: '湿度(％)',
            type: 'value'
        }],
        series: [{
            name: '内部温度',
            type: 'line',
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
                normal: {}
            },
            showSymbol: false,
            data: innerTData
        }, {
            name: '外部温度',
            type: 'line',
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
                normal: {}
            },
            showSymbol: false,
            data: outterTData
        }, {
            name: '内部湿度',
            type: 'line',
            yAxisIndex: 1,
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
                normal: {}
            },
            showSymbol: false,
            data: innerHData
        }, {
            name: '外部湿度',
            type: 'line',
            yAxisIndex: 1,
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
                normal: {}
            },
            showSymbol: false,
            data: outterHData
        }],
        color: ['#f6ac49', '#eb5606', '#83ccd2', '#2892c4']
    };
    var option2 = {
        grid: {
            bottom: 80
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                return params[0].name + '<br/>' + params[0].seriesName + ' : ' + params[0].value + ' (℃)<br/>' + params[1].seriesName + ' : ' + params[1].value + ' (℃)</br>' + params[2].seriesName + ' : ' + params[2].value + ' (％)<br/>' + params[3].seriesName + ' : ' + params[3].value + ' (％)';
            },
            axisPointer: {
                animation: false
            }
        },
        legend: {
            show: true,
            data: ['内部温度', '外部温度', '内部湿度', '外部湿度'],
            x: 'left'
        },
        dataZoom: [{
            show: true,
            handleSize: 40,
            realtime: true,
            start: 0,
            end: 100
        }, {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
        }],
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                onZero: false
            },
            data: data.map(function(item) {
                return item.UpdateTime.slice(5).replace('T', '\n')
            })
        }],
        yAxis: {
            type: 'value',
            min: 0,
            max: 100
        },
        series: [{
            name: '内部温度',
            type: 'line',
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
                normal: {}
            },
            showSymbol: false,
            data: innerTDataCalc
        }, {
            name: '外部温度',
            type: 'line',
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
                normal: {}
            },
            showSymbol: false,
            data: outterTDataCalc
        }, {
            name: '内部湿度',
            type: 'line',
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
                normal: {}
            },
            showSymbol: false,
            data: innerHDataCalc
        }, {
            name: '外部湿度',
            type: 'line',
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
                normal: {}
            },
            showSymbol: false,
            data: outterHDataCalc
        }],
        color: ['#f6ac49', '#eb5606', '#83ccd2', '#2892c4']
    };
    element.setOption(option1);
    // $('#chartNum').change(function() {
    //     if ($(this).val() == 'chart2') {
    //         element.setOption(option2);
    //     } else {
    //         element.setOption(option1);
    //     }
    // });
    $('.change-chart-btn').on('click', 'button', function(){
    	$(this).addClass('active');
    	$(this).siblings().removeClass('active');
    	if($(this).attr('id') === 'drawChart1') {
    		element.setOption(option1);
    	} else {
    		element.setOption(option2);
    	}
    });
};

var calcData = function(arr) {
    var max = getArrayMax(arr);
    var min = getArrayMin(arr);
    if (min == max) {
        return getEqualData(arr);
    } else {
        return getCalcData(min, max, arr);
    }
};

var getArrayMax = function(arr) {
    return Math.max.apply(Math, arr);
};

var getArrayMin = function(arr) {
    return Math.min.apply(Math, arr);
};

var getEqualData = function(arr) {
    var equalArr = [];
    $.each(arr, function(e) {
        equalArr.push(50);
    });
    return equalArr;
};

var getCalcData = function(min, max, arr) {
    var calcArr = [];
    $.each(arr, function(k, value) {
        calcArr.push((value - min) / (max - min) * 100 * 0.8 + 0.1)
    });
    return calcArr;
};

//时间格式化
var timeFormat = function(date, complete) {
    var year = date.getFullYear();
    var month = unitsDigit(date.getMonth() + 1);
    var day = unitsDigit(date.getDate());
    var hour = unitsDigit(date.getHours());
    var min = unitsDigit(date.getMinutes());
    var sec = unitsDigit(date.getSeconds());
    if (complete) {
        return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    } else {
        return year + '-' + month + '-' + day;
    }
};

var unitsDigit = function(date) {
    date = date < 10 ? ('0' + date) : date;
    return date;
};

var getListIndex = function() {
	 var settings = {
        url: 'http://boxapi.losta.net/apiv1/basis/substation',
        type: 'GET',
        dataType: 'json',
        beforeSend: function(xmlHttp) {
            xmlHttp.setRequestHeader('If-Modified-Since', '0');
            xmlHttp.setRequestHeader('Cache-Control', 'no-cache');
        }
    };
    $.ajax(settings).done(function(data) {
        var str1 = '';
        $.each(data, function(index, value) {
            str1 += '<a class="mdl-list__item swipeBtn" href="javascript:;" data-href="#panel' + index + '">'
                  + '    <span class="material-icons" style="margin-right:20px;color:#54536f">devices</span>'
                  + '    <span class="mdl-list__item-primary-content">' + value.SubStationName + '</span>'
                  + '    <span class="mdl-list__item-secondary-content arrow-color"> <i class="material-icons">navigate_next</i></span>'
                  + '</a>';
            var settingsPanel = {
                url: 'http://boxapi.losta.net/apiv1/basis/nodes/' + value.SubStationId,
                type: 'GET',
                dataType: 'json'
            };
            $.ajax(settingsPanel).done(function(data) {
                var str2 = '<div class="equipment-panel section-2" id="panel' + index + '"><div class="mdl-list box-line">';
                $.each(data, function(index, value) {
                    str2 += '<a class="mdl-list__item" href="NodeStatus.html?id=' + value.NodeId + '">'
                          + '    <span class="material-icons" style="margin-right:20px;color:#54536f">star</span>'
                          + '    <span class="mdl-list__item-primary-content">' + value.NodeName + '</span>'
                          + '    <span class="mdl-list__item-secondary-content arrow-color"><i class="material-icons" >navigate_next</i></span>'
                          + '</a>';
                });
                str2 += '</div></div>';
                $('.mdl-layout__content').append(str2);
            }).done(function() {
                $('.wrapper').PageSwipe({});
            });
        });
        $('#list').html(str1);
    });
};

//获取时间区间
var getTimeStr = function(startTime, period) {
    if (startTime) {
        var endTime = new Date(startTime.replace(/-/g, "/"));
        startTime = new Date(startTime.replace(/-/g, "/"));

        return 'begin=' + timeFormat(startTime, false) + '&end=' + timeFormat(getEndTime(endTime, period), false);
    }
}

var getEndTime = function(endTime, period) {
    switch (period) {
        case 'day':
            break;
        case 'week':
            endTime.setDate(endTime.getDate() + 7);
            break;
        case 'month':
            endTime.setMonth(endTime.getMonth() + 1);
            // endTime.setDate(endTime.getDate() - 1);
            break;
    }
    return endTime;
}

var pageNo;
var startTime;
var period;
var timeStr;

var loadMoreFun = function(data) {
    $('#loadMore').hide();
    $('.search-result').show();
    $('main').unbind('scroll', scrollEvent);
    if (data.length) {
        $('#showChart').show();
        pageNo++;
        var str = '';
        $.each(data, function(index, value) {
            updateTime = new Date(value.UpdateTime);
            updateTime = timeFormat(updateTime, true).slice(5);
            str += ''
                 + '<tr>'
                 + '    <td class="mdl-data-table__cell--non-numeric">' + updateTime + '</td>'
                 + '    <td class="mdl-data-table__cell--non-numeric">' + value.InnerTemp + '℃</td>'
                 + '    <td class="mdl-data-table__cell--non-numeric">' + value.InnerHumidity + '％</td>'
                 + '    <td class="mdl-data-table__cell--non-numeric">' + value.OutterTemp + '℃</td>'
                 + '    <td class="mdl-data-table__cell--non-numeric">' + value.OutterHumidity + '％</td>'
                 + '</tr>'
        });
        $('#searchTbody').append(str);
        $('main').scroll(scrollEvent);

    } else {
        $('#noMore').show();
        $('main').unbind('scroll', scrollEvent);
    }
};

$('#search').on('click', function() {
    $('#showTable').hide();
    $('#historyChart').hide();
    $('.change-chart-btn').hide();
    $('#historyList').show();
    $('#historyTable').show();
    $('#searchTbody').html('');
    $('#loadMore').show();
    $('#noMore').hide();

    startTime = $('#beginTime').val();
    period = $('#period').val();
    pageNo = 1;
    timeStr = getTimeStr(startTime, period);

    var settings = {
        url: 'http://boxapi.losta.net/apiv1/datum/history/' + r + '?' + timeStr + '&pageNo=' + pageNo + '&pageSize=50',
        type: 'GET',
        dataType: 'json'
    };
    $.ajax(settings).done(loadMoreFun);
    var historyChart = echarts.init(document.getElementById('historyChart'));
    historyChart.showLoading();

    var settingsPic = {
        url: 'http://boxapi.losta.net/apiv1/datum/history/' + r + '?' + timeStr + '&pagesize=5000',
        type: 'GET',
        dataType: 'json'
    };
    $.ajax(settingsPic).done(function(data) {
        historyChart.hideLoading();
        drawChart(historyChart, data);
    });
});

//防止没加载完就继续加一个ajax请求，会出现跳页的情况
var canLoad = true;

var scrollEvent = function() {
    if ($(this).scrollTop() + $(this).get(0).clientHeight
        >= ($(this).get(0).scrollHeight - $('#loadmore').height()) / 4 * 3 && canLoad) {
        var settings = {
            url: 'http://boxapi.losta.net/apiv1/datum/history/' + r + '?' + timeStr + '&pageNo=' + pageNo + '&pageSize=5',
            type: 'GET',
            dataType: 'json'
        }
        canLoad = false;
        $.ajax(settings).done(loadMoreFun).done(function(){
            canLoad = true;
        });
    }
};

var getStatus = function(data) {
    if (data.length) {
        $('#warning').attr('href', 'WarnInfo.html?id=' + r);
        $('#i-temp').html(data[0].InnerTemp + '℃');
        $('#i-humidity').html(data[0].InnerHumidity + '％');
        $('#o-temp').html(data[0].OutterTemp + '℃');
        $('#o-humidity').html(data[0].OutterHumidity + '％');
        $('#updateTime').html(data[0].UpdateTime.replace('T', ' ').replace('Z', ''))
        var str = '';
        var state;
        for (var i = 0, arr = data[0].FanSpeedList, len = arr.length; i < len; i++) {
            switch (arr[i]) {
                case 0:
                    state = 'red';
                    break;
                case 1:
                    state = 'orange';
                    break;
                case 2:
                    state = 'green';
                    break;
            }
            str += '<div class="mdl-list__item">'
                 + '    <span class="mdl-list__item-primary-content">风扇' + (i + 1) + '号</span>'
                 + '    <span class="mdl-list__item-secondary-content"><i class="material-icons ' + state + '">toys</i></span>'
                 + '</div>';
    }
        $('#fanState').html(str);
        $('#ip').html(data[0].NodeEndPoint);
        $('#scrollable').attr('data-state', 'true')
    }
};



// //touch的兼容性问题
// //TODO: 添加zepto.js
// var touchstart, touchmove, touchend;
// if ('ontouchstart' in window) {
//     touchstart = 'touchstart';
//     touchmove = 'touchmove';
//     touchend = 'touchend';
// } else {
//     touchstart = 'mousedown';
//     touchmove = 'mousemove';
//     touchend = 'mouseup';
// }

// var touchState, touchStartPos, touchmovePos;

// var touchHandler = function(e) {
//     var type = e.type;
//     switch (type) {
//         case 'touchstart':
//             touchState = 'TS';
//             touchStartPos = getTouchPos(e);
//             break;
//         case 'touchmove':
//             touchState = 'TM';
//             touchmovePos = getTouchPos(e);
//             touchScroll();
//             break;
//         case 'touchend':
//             touchState = 'TE';
//             touchScroll();
//             break;
//     }
// };

// var getTouchPos = function(e) {
//     var touches = e.touches;
//     if (touches && touches[0]) {
//         return {
//             x: touches[0].clientX,
//             y: touches[0].clientY
//         };
//     }
//     return {
//         x: e.clientX,
//         y: e.clientY
//     };
// };


