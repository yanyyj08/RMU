(function($) {
    var _prefix = (function(temp) {
        var aPrefix = ['webkit', 'moz', 'o', 'ms'];
        var props = '';
        var len = aPrefix.length;
        for (var i = 0; i < len; i++) {
            props = aPrefix[i] + 'Transition';
            if (temp.style[props] !== undefined) {
                return '-' + aPrefix[i].toLowerCase() + '-';
            }
        }
    })(document.createElement(PageSwipe));

    var PageSwipe = (function() {
        function PageSwipe(element, options) {
            this.settings = $.extend(true, $.fn.PageSwipe.defaults, options || {});
            this.element = element;
        }
        PageSwipe.prototype = {
            init: function() {
                var me = this;
                me.selectors = me.settings.selectors;
                me.sections = me.element.find(me.selectors.sections);
                me.section1 = me.element.find(me.selectors.section1);
                me.section2 = me.element.find(me.selectors.section2);
                me.className = me.selectors.className;
                me.backIcon = me.element.find(me.selectors.backIcon);
                me.level = me.settings.level;
                me.duration = me.settings.duration;
                me.easing = me.settings.easing;

                me._initEvent();
            },
            _animation: function() {
                var me = this;
                var options = {};
                options.viewWidth = document.documentElement.clientWidth;
                options.transition = _prefix + 'transition';
                options.transform = _prefix + 'transform';
                options.transitionText = 'all ' + me.duration + 'ms ' + me.easing;
                options.translateShow = 'translateX(-' + options.viewWidth + 'px)';
                options.translateShowSec = 'translateX(-' + options.viewWidth * 2 + 'px)';
                options.translateHide = 'translateX(0)';
                return options;
            },
            //show
            _swipeLeft: function() {
                var me = this;
                if (me.backIcon.attr('data-state') == '0') {
                    me._swipeLeftFirst(me._animation());
                } else if (me.settings.level == 2 && me.backIcon.attr('data-state') == '1') {
                    me._swipeLeftSec(me._animation());
                }
            },
            //hide
            _swipeRight: function() {
                var me = this;
                if (me.backIcon.attr('data-state') == '1') {
                    me._swipeRightFirst(me._animation());
                } else if (me.settings.level == 2 && me.backIcon.attr('data-state') == '2') {
                    me._swipeRightSec(me._animation());
                }
            },
            _swipeLeftFirst: function(options) {
                var me = this;
                me.section1
                    .css(options.transition, options.transitionText)
                    .css(options.transform, options.translateShow);
                me.targetEle
                    .css(options.transition, options.transitionText)
                    .css(options.transform, options.translateShow);
                me.backIcon.css('visibility', 'visible').attr('data-state', 1);
            },
            _swipeLeftSec: function(options) {
                var me = this;
                me.targetEle
                    .css(options.transition, options.transitionText)
                    .css(options.transform, options.translateShowSec);
                me.targetEleSec
                    .css(options.transition, options.transitionText)
                    .css(options.transform, options.translateShow);
                me.backIcon.attr('data-state', 2);
            },
            _swipeRightFirst: function(options) {
                var me = this;
                me.section1
                    .css(options.transition, options.transitionText)
                    .css(options.transform, options.translateHide);
                me.targetEle
                    .css(options.transition, options.transitionText)
                    .css(options.transform, options.translateHide);
                me.backIcon.css('visibility', 'hidden').attr('data-state', 0);
            },
            _swipeRightSec: function(options) {
                var me = this;
                me.targetEle
                    .css(options.transition, options.transitionText)
                    .css(options.transform, options.translateShow);
                me.targetEleSec
                    .css(options.transition, options.transitionText)
                    .css(options.transform, options.translateHide);
                me.backIcon.attr('data-state', 1);
            },
            _initEvent: function() {
                var me = this;
                me.section2.css('left', me._animation().viewWidth + 'px').show();
                me.section1.on('click', me.className, function(e) {
                    e.preventDefault();
                    var target = $(this).attr('data-href');
                    if (target) {
                        me.targetEle = $(target);
                        me._swipeLeft();
                    }
                });
                me.section2.on('click', me.className, function(e) {
                    e.preventDefault();
                    var target = $(this).attr('data-href');
                    if (target) {
                        me.targetEleSec = $(target);
                        me._swipeLeft();
                    }
                });
                me.backIcon.on('click', function() {
                    me._swipeRight();
                });
            }
        };
        return PageSwipe;
    });

    $.fn.PageSwipe = function(options) {
        return this.each(function() {
            var me = $(this),
                instance = me.data('PageSwipe');

            if (!instance) {
                Instance = PageSwipe();
                instance = new Instance(me, options);
                me.data('PageSwipe', instance);
            }
            if ($.type(options) === 'object') {
                return instance.init();
            }
        });
    };

    $.fn.PageSwipe.defaults = {
        selectors: {
            sections: '.sections',
            section1: '.section-1',
            section2: '.section-2',
            className: '.swipeBtn',
            active: '.active',
            backIcon: '.back-icon'
        },
        level: 1, //滑动等级，最高支持2级，即三个页面滑动
        easing: 'ease', //动画模式
        duration: 300, //切换屏幕的时间
        callback: ''
    };
})(jQuery);
