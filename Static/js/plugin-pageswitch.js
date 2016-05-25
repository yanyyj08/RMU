(function($) {
    var _prefix = (function(temp) {
        var aPrefix = ['webkit', 'moz', 'o', 'ms'],
            props = '';
        for (var i in aPrefix) {
            props = aPrefix[i] + 'Transition';
            if (temp.style[props] !== undefined) {
                return '-' + aPrefix[i].toLowerCase() + '-';
            }
        }
    })(document.createElement(PageSwitch));
    var PageSwitch = (function() {
        function PageSwitch(element, options) {
            this.settings = $.extend(true, $.fn.PageSwitch.defaults, options || {});
            this.element = element;
        }
        PageSwitch.prototype = {
            //说明: 初始化插件
            //实现: 初始化dom结构，布局，分页及绑定事件
            init: function() {
                var me = this; //为了防止this混淆，有可能会指向window
                me.selectors = me.settings.selectors;
                me.sections = me.element.find(me.selectors.sections);
                me.section = me.sections.find(me.selectors.section);

                me.refresh = me.settings.refresh.callback ? true : false;
                me.settings.loop = me.refresh ? false : me.settings.loop;

                me.direction = me.settings.direction == 'vertical' ? true : false;
                me.pagesCount = me.pagescount();
                me.index = (me.settings.index >= 0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;
                me.slideDis = document.documentElement.clientHeight / 3;

                me.canScroll = true;
                if (!me.direction) {
                    me._initLayout();
                }

                if (me.settings.pagination) {
                    me._initPaging();
                }

                me._initEvent();
            },
            //说明: 获取滑动页面数量
            pagescount: function() {
                var me = this;
                return me.section.length;
            },
            //说明: 获取滑动的宽度(横屏滑动)，或高度(竖屏滑动)
            switchLength: function() {
                var me = this;
                return me.direction ? me.element.height() : me.element.width();
            },
            prev: function() {
                var me = this;
                if (me.index > 0) {
                    me.index--;
                } else if (me.settings.loop) {
                    me.index = me.pagesCount - 1;
                }
                me._scrollPage();
            },
            next: function() {
                var me = this;
                if (me.index < me.pagesCount - 1) {
                    me.index++;
                } else if (me.settings.loop) {
                    me.index = 0;
                }
                me._scrollPage();
            },
            _scrollAnimate: function(moveDis) {
                var me = this;
                var dest = me.section.eq(me.index).position();
                if (!dest) {
                    return;
                }
                var destDis = me.direction ? dest.top : dest.left,
                    duration = arguments.length > 0 ? 100 : me.settings.duration;
                moveDis = -(arguments.length > 0 ? (destDis - moveDis) : destDis);
                me.canScroll = false;
                if (_prefix) {
                    me.sections.css(_prefix + 'transition', 'all ' + duration + 'ms ' + me.settings.easing);
                    var translate = me.direction ? 'transLateY(' + moveDis + 'px)' : 'translateX(' + moveDis + 'px)';
                    me.sections.css(_prefix + 'transform', translate);
                } else {
                    var animateCss = me.direction ? { top: -moveDis } : { left: -moveDis };
                    me.sections.animate(animateCss, me.settings.duration, function() {
                        me.canScroll = true;
                        if (me.settings.callback && $.type(me.settings.callback) == 'function') {
                            me.settings.callback();
                        }
                    });
                }
            },
            _scrollPage: function() {
                var me = this;
                me._scrollAnimate();
                if (me.settings.pagination) {
                    me.pageItem.eq(me.index).addClass(me.activeClass).siblings('li').removeClass(me.activeClass);
                }
            },
            _getTouchPos: function(e) {
                var touches = e.touches;
                if (touches && touches[0]) {
                    return {
                        x: touches[0].clientX,
                        y: touches[0].clientY
                    };
                }
                return {
                    x: e.clientX,
                    y: e.clientY
                };
            },
            _touchScroll: function() {
                var me = this;
                me.canScroll = false;
                if (me.touchmovePos) {
                    moveDis = me.direction ? (me.touchmovePos.y - me.touchStartPos.y) : (me.touchmovePos.x - me.touchStartPos.x);
                    //moveDis>0, 向下拉向前翻页
                    if (moveDis > 0 && (me.index && !me.settings.loop || me.settings.loop)) {
                        //如果touch结束且滑动距离大
                        if (moveDis > me.slideDis && me.touchState == 'TE') {
                            me.prev();
                            me.touchmovePos = null;
                            me.touchstartPos = null;
                        } else if (moveDis < me.slideDis && me.touchState == 'TE') {
                            me._scrollAnimate();
                        }
                        //如果还在touchmove
                        else if (me.touchState == 'TM') {
                            me._scrollAnimate(moveDis);
                        }
                    }
                    //TODO:下拉刷新
                    //index=0时下拉刷新
                    else if (moveDis > me.slideDis && (!me.index && me.refresh)) {
                        $('#refresh').css({ '-webkit-animation': 'refreshOut 300ms 1 linear', 'animation-fill-mode': 'forwards' });
                        me.refreshFinish = false;
                        me.settings.refresh.callback();
                        var result = $('#refresh');
                        var refreshFun = function() {
                            if (result.attr('data-state') == 'true' && me.refreshFinish === false) {
                                clearInterval(refreshFun);
                                me.refreshFinish = true;
                                $('#refresh').css({ '-webkit-animation': 'refreshIn 300ms 1 linear', 'animation-fill-mode': 'forwards' });
                                me.touchstartPos = null;
                                me.touchmovePos = null;
                            }
                        };
                        setInterval(refreshFun, 200);
                    }
                    //moveDis<0,向上拉向后翻页
                    else if (moveDis < 0 && (me.index < (me.pagesCount - 1) && !me.settings.loop || me.settings.loop)) {
                        //如果touch结束且滑动距离大
                        if (!me.index && me.refreshFinish === false && (me.touchState == 'TE' || me.touchState == 'TM')) {
                            me.refreshFinish = true;
                            $('#refresh').css({ '-webkit-animation': 'refreshIn 300ms 1 linear', 'animation-fill-mode': 'forwards' }).on('webkitAnimationEnd', function() {
                                me._scrollAnimate();
                            })
                        } else if (Math.abs(moveDis) > me.slideDis && me.touchState == 'TE') {
                            me.next();
                            me.touchmovePos = null;
                            me.touchstartPos = null;
                        } else if (Math.abs(moveDis) < me.slideDis && me.touchState == 'TE') {
                            me._scrollAnimate();

                        }
                        //如果还在touchmove
                        else if (me.touchState == 'TM') {
                            me._scrollAnimate(moveDis);
                        }
                    }
                }

            },
            //说明: 主要针对横屏情况进行页面布局
            _initLayout: function() {
                var me = this;
                var width = (me.pagesCount * 100) + '%',
                    cellWidth = (100 / me.pagesCount).toFixed(2) + '%';
                me.sections.width(width);
                me.section.width(cellWidth).css('float', 'left');
            },
            //说明: 实现分页的dom结构及css样式
            _initPaging: function() {
                var me = this;
                var pagesClass = me.selectors.page.substring(1);
                me.activeClass = me.selectors.active.substring(1);
                var pageHtml = '<ul class=' + pagesClass + '>';
                for (var i = 0; i < me.pagesCount; i++) {
                    pageHtml += '<li></li>';
                }
                pageHtml += '</ul>';
                me.element.append(pageHtml);

                var pages = me.element.find(me.selectors.page);
                me.pageItem = pages.find('li');
                me.pageItem.eq(me.index).addClass(me.activeClass);

                if (me.direction) {
                    pages.addClass('vertical');
                } else {
                    pages.addClass('horizontal');
                }
            },
            //初始化插件事件
            _initEvent: function() {
                var me = this;
                me.element.on('click', me.selectors.page + ' li', function() {
                    me.index = $(this).index();
                    me._scrollPage();
                });

                me.element.on('mousewheel DOMMouseScroll', function(e) {
                    if (me.canScroll) {
                        e.preventDefault();
                        var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                        if (delta > 0 && (me.index && !me.settings.loop || me.settings.loop)) {
                            me.prev();
                        } else if (delta < 0 && (me.index < (me.pagesCount - 1) && !me.settings.loop || me.settings.loop)) {
                            me.next();
                        }
                    }
                });

                if (me.settings.keyboard) {
                    $(document).on('keydown', function(e) {
                        var keyCode = e.keyCode;
                        if (keyCode == 37 || keyCode == 38) {
                            me.prev();
                        } else if (keyCode == 39 || keyCode == 40) {
                            me.next();
                        }
                    });
                }
                //important!
                $(window).resize(function() {
                    var currentLength = me.switchLength(),
                        offset = me.settings.direction ? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;
                    if (Math.abs(offset) > currentLength / 2 && me.index < (me.pagesCount - 1)) {
                        me.index++;
                    }
                    if (me.index) {
                        me._scrollPage();
                    }
                });

                me.sections.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {
                    me.canScroll = true;
                    if (me.settings.callback && $.type(me.settings.callback) == 'function') {
                        me.settings.callback();
                    }
                });

                var touchstart, touchmove, touchend;
                if ('ontouchstart' in window) {
                    touchstart = 'touchstart';
                    touchmove = 'touchmove';
                    touchend = 'touchend';
                } else {
                    touchstart = 'mousedown';
                    touchmove = 'mousemove';
                    touchend = 'mouseup';
                }

                var touchHandler = function(e) {
                    var type = e.type;
                    switch (type) {
                        case 'touchstart':
                            me.touchState = 'TS';
                            me.touchStartPos = me._getTouchPos(e);
                            break;
                        case 'touchmove':
                            e.preventDefault();
                            me.touchState = 'TM';
                            me.touchmovePos = me._getTouchPos(e);
                            me._touchScroll();
                            break;
                        case 'touchend':
                            me.touchState = 'TE';
                            me._touchScroll();
                            break;
                    }
                }

                document.getElementById(me.element.attr('id')).addEventListener('touchstart', touchHandler);
                document.getElementById(me.element.attr('id')).addEventListener('touchmove', touchHandler);
                document.getElementById(me.element.attr('id')).addEventListener('touchend', touchHandler);

            }
        };
        return PageSwitch;
    });

    $.fn.PageSwitch = function(options) {
        return this.each(function() {
            var me = $(this),
                instance = me.data('PageSwitch');

            if (!instance) {
                Instance = PageSwitch();
                instance = new Instance(me, options);
                me.data('PageSwitch', instance);
            }
            if ($.type(options) === 'object') {
                return instance.init();
            }
        });
    }

    //默认的配置参数
    $.fn.PageSwitch.defaults = {
        selectors: {
            sections: '.sections',
            section: '.section',
            page: '.pages',
            active: '.active'
        },
        index: 0, //默认页码
        easing: 'ease', //动画模式
        duration: 500, //播放间隔时间
        loop: false, //是否可循环播放
        pagination: true, //是否进行分页处理
        keyboard: true, //是否触发键盘事件
        direction: 'vertical', //滑动方向 vertiacl/herizontal
        refresh: { //是否支持顶部刷新
            value: false,
            callback: ''
        },
        callback: ''
    }

    $(function() {
        $('[data-PageSwitch]').PageSwitch();
    });






    // /*侧边栏插件
    //  *
    //  *
    //  *
    //  *
    //  *
    //  */

    // var SidebarMenu = (function() {
    //     function SidebarMenu(element, options) {
    //         this.settings = $.extend(true, $.fn.PageSwitch.defaults, options || {});
    //         this.element = element;
    //     }
    //     SidebarMenu.prototype = {
    //         //说明: 初始化插件
    //         //实现: 初始化dom结构，布局，分页及绑定事件
    //         init: function() {
    //             var me = this;
    //             //TODO
    //             me._initEvent();
    //         },
    //         //初始化插件事件
    //         _initEvent: function() {
    //             var me = this;
    //             me.element.on('click', me.selectors.page + ' li', function() {
    //                 me.index = $(this).index();
    //                 me._scrollPage();
    //             });
    //         }
    //     };
    //     return SidebarMenu;
    // });

    // $.fn.SidebarMenu = function(options) {
    //     return this.each(function() {
    //         var me = $(this),
    //             instance = me.data('SidebarMenu');

    //         if (!instance) {
    //             Instance = SidebarMenu();
    //             instance = new Instance(me, options);
    //             me.data('SidebarMenu', instance);
    //         }
    //         if ($.type(options) === 'object') {
    //             return instance.init();
    //         }
    //     });
    // }

    // //默认的配置参数
    // $.fn.SidebarMenu.defaults = {
    //     selectors: {
    //         sections: '.sections',
    //         section: '.section',
    //         page: '.pages',
    //         active: '.active'
    //     },
    //     index: 0, //默认页码
    //     easing: 'ease', //动画模式
    //     duration: 500, //播放间隔时间
    //     loop: false, //是否可循环播放
    //     pagination: true, //是否进行分页处理
    //     keyboard: true, //是否触发键盘事件
    //     direction: 'vertical', //滑动方向 vertiacl/herizontal
    //     refresh: { //是否支持顶部刷新
    //         value: false,
    //         callback: ''
    //     },
    //     callback: ''
    // }

    // $(function() {
    //     $('[data-SidebarMenu]').SidebarMenu();
    // });

})(jQuery);
