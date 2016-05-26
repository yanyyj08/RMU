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
    $('#chartNum').change(function() {
        if ($(this).val() == 'chart2') {
            element.setOption(option2);
        } else {
            element.setOption(option1);
        }
    })
}

var calcData = function(arr) {
    var max = getArrayMax(arr);
    var min = getArrayMin(arr);
    if (min == max) {
        return getEqualData(arr);
    } else {
        return getCalcData(min, max, arr);
    }
}

var getArrayMax = function(arr) {
    return Math.max.apply(Math, arr);
}

var getArrayMin = function(arr) {
    return Math.min.apply(Math, arr);
}

var getEqualData = function(arr) {
    var equalArr = [];
    $.each(arr, function(e) {
        equalArr.push(50);
    });
    return equalArr;
}

var getCalcData = function(min, max, arr) {
    var calcArr = [];
    $.each(arr, function(k, value) {
        calcArr.push((value - min) / (max - min) * 100 * 0.8 + 0.1)
    });
    return calcArr;
}

//时间格式化
var timeFormat = function(date, complete) {
    var year = date.getFullYear(),
        month = unitsDigit(date.getMonth() + 1),
        day = unitsDigit(date.getDate()),
        hour = unitsDigit(date.getHours()),
        min = unitsDigit(date.getMinutes()),
        sec = unitsDigit(date.getSeconds());
    if (complete) {
        return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    } else {
        return year + '-' + month + '-' + day;
    }
}

var unitsDigit = function(date) {
    date = date < 10 ? ('0' + date) : date;
    return date;
}


