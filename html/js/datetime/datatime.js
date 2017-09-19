$(function () {
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    $.fn.datetime = function (op) {
        $(this).on('focus', function () {
            var input = $(this);
            var ns = 'http://www.w3.org/2000/svg';
            $('.svg_datatime_div').remove();
            var nowDate = input.val() === "" ? new Date() : new Date(Date.parse(input.val().replace(/-/g, "/")));
            if (!op.ss) {
                nowDate.setSeconds(0);
            }
            var yyyyNumber = 100;
            $(this).after($('<div class="svg_datatime_div"/>').css({
                'margin-left': $(this).css('margin-left')
            }).append($(document.createElementNS(ns, 'svg')).addClass('svg_datatime').append($(document.createElementNS(ns, 'circle')).addClass('svg_yyyy')).append($(document.createElementNS(ns, 'circle')).addClass('svg_MM')).append($(document.createElementNS(ns, 'circle')).addClass('svg_dd')).append($(document.createElementNS(ns, 'circle')).addClass('svg_HH')).append($(document.createElementNS(ns, 'circle')).addClass('svg_mm')).append($(document.createElementNS(ns, 'circle')).addClass('svg_ss')).append($(document.createElementNS(ns, 'text')).addClass('text').append(nowDate.format('yyyy-MM-dd HH:mm:ss'))).append($(document.createElementNS(ns, 'circle')).data('data', nowDate).addClass('svg_yyyy_btn').on('mousedown', function () {
                $('.svg_datatime').data('drag_select', this).find('.text').addClass('no_select');
            })).append($(document.createElementNS(ns, 'circle')).addClass('svg_MM_btn').on('mousedown', function () {
                $('.svg_datatime').data('drag_select', this).find('.text').addClass('no_select');
            })).append($(document.createElementNS(ns, 'circle')).addClass('svg_dd_btn').on('mousedown', function () {
                $('.svg_datatime').data('drag_select', this).find('.text').addClass('no_select');
            })).append($(document.createElementNS(ns, 'circle')).addClass('svg_HH_btn').on('mousedown', function () {
                $('.svg_datatime').data('drag_select', this).find('.text').addClass('no_select');
            })).append($(document.createElementNS(ns, 'circle')).addClass('svg_mm_btn').on('mousedown', function () {
                $('.svg_datatime').data('drag_select', this).find('.text').addClass('no_select');
            })).append($(document.createElementNS(ns, 'circle')).addClass('svg_ss_btn').on('mousedown', function () {
                $('.svg_datatime').data('drag_select', this).find('.text').addClass('no_select');
            })).on('mouseup', function () {
                $('.svg_datatime').removeData('drag_select').find('.text').removeClass('no_select');
            }).on('mousemove', function (e) {
                var svg = $(this);
                var o = svg.data('drag_select');
                if (o) {
                    var svg_offset = svg.offset();
                    var obj = svg.find('.' + $(o).attr('class').replace('_btn', ''));
                    var r = parseInt(obj.css('r'));
                    var cx = parseInt(obj.css('cx'));
                    var cy = parseInt(obj.css('cy'));
                    var radian = Math.atan2((e.pageY - svg_offset.top - cy), (e.pageX - svg_offset.left - cx));
                    $(o).css({
                        cx: (Math.cos(radian) * r) + cx,
                        cy: (Math.sin(radian) * r) + cy
                    });
                    var dm = (radian * (180 / Math.PI)) + 90;
                    var d = (dm < 0 ? 360 + dm : dm);
                    var eDate = $('.svg_datatime .text');
                    var date = new Date(Date.parse(eDate.text().replace(/-/g, "/")));
                    switch ($(o).attr('class').replace('svg_', '').replace('_btn', '')) {
                        case 'yyyy':
                            var lastDegree = $(o).data('lastDegree');
                            var circleNumber = $(o).data('circleNumber');
                            if (d >= 0 && d <= 90 && lastDegree >= 270) {
                                $(o).data('circleNumber', ++circleNumber);
                            } else if (d >= 270 && lastDegree >= 0 && lastDegree <= 90) {
                                $(o).data('circleNumber', --circleNumber);
                            }
                            date.setFullYear((circleNumber * yyyyNumber) + Math.floor(d / (360 / yyyyNumber)));
                            $(o).data('lastDegree', d);
                            break;
                        case 'MM':
                            date.setMonth(Math.floor(d * 12 / 360));
                            break;
                        case 'dd':
                            date.setDate(Math.floor(d * (new Date(date.getYear(), date.getMonth() + 1, 0).getDate()) / 360) + 1);
                            break;
                        case 'HH':
                            date.setHours(Math.floor(d * 24 / 360));
                            break;
                        case 'mm':
                            date.setMinutes(Math.floor(d * 60 / 360));
                            break;
                        case 'ss':
                            date.setSeconds(Math.floor(d * 60 / 360));
                            break;
                    }
                    eDate.text(date.format('yyyy-MM-dd HH:mm:ss'));
                }
            }).on('click', function (e) {
                e.stopPropagation();
            }).on('dblclick', function () {
                input.val($(this).find('.text').text());
                $('.svg_datatime_div').remove();
                op.close();
            })));

            var svg = $(".svg_datatime");
            var pi180 = Math.PI / 180;

            var yyyyObj = svg.find('.svg_yyyy');
            var yyyyR = parseInt(yyyyObj.css('r'));
            var yyyyCx = parseInt(yyyyObj.css('cx'));
            var yyyyCy = parseInt(yyyyObj.css('cy'));
            svg.find('.text').attr("x", yyyyCx).attr("y", yyyyCy + 5.5);
            var yyyyD = (360 / yyyyNumber * nowDate.getFullYear()) - 90;
            var yyyyX = (Math.cos(yyyyD * pi180) * yyyyR) + yyyyCx;
            var yyyyY = (Math.sin(yyyyD * pi180) * yyyyR) + yyyyCy;
            svg.find('.svg_yyyy_btn').css({
                cx: yyyyX,
                cy: yyyyY
            }).data('circleNumber', Math.floor(nowDate.getFullYear() / yyyyNumber)).data('lastDegree', nowDate.getFullYear() % yyyyNumber * 360 / 100);

            var MMObj = svg.find('.svg_MM');
            var MMR = parseInt(MMObj.css('r'));
            var MMCx = parseInt(MMObj.css('cx'));
            var MMCy = parseInt(MMObj.css('cy'));
            var MMD = (360 / 12 * (nowDate.getMonth() + 1 )) - 90;
            var MMY = (Math.sin(MMD * pi180) * MMR) + MMCy;
            var MMX = (Math.cos(MMD * pi180) * MMR) + MMCx;
            svg.find('.svg_MM_btn').css({
                cx: MMX,
                cy: MMY
            });

            var ddObj = svg.find('.svg_dd');
            var ddR = parseInt(ddObj.css('r'));
            var ddCx = parseInt(ddObj.css('cx'));
            var ddCy = parseInt(ddObj.css('cy'));
            var ddD = (360 / (new Date(nowDate.getYear(), nowDate.getMonth() + 1, 0).getDate()) * nowDate.getDate()) - 90;
            var ddX = (Math.cos(ddD * pi180) * ddR) + ddCx;
            var ddY = (Math.sin(ddD * pi180) * ddR) + ddCy;
            svg.find('.svg_dd_btn').css({
                cx: ddX,
                cy: ddY
            });

            var hhObj = svg.find('.svg_HH');
            var hhR = parseInt(hhObj.css('r'));
            var hhCx = parseInt(hhObj.css('cx'));
            var hhCy = parseInt(hhObj.css('cy'));
            var hhD = (360 / 24 * nowDate.getHours()) - 90;
            var hhX = (Math.cos(hhD * pi180) * hhR) + hhCx;
            var hhY = (Math.sin(hhD * pi180) * hhR) + hhCy;
            svg.find('.svg_HH_btn').css({
                cx: hhX,
                cy: hhY
            });

            var mmObj = svg.find('.svg_mm');
            var mmR = parseInt(mmObj.css('r'));
            var mmCx = parseInt(mmObj.css('cx'));
            var mmCy = parseInt(mmObj.css('cy'));
            var mmD = (360 / 60 * nowDate.getMinutes()) - 90;
            var mmX = (Math.cos(mmD * pi180) * mmR) + mmCx;
            var mmY = (Math.sin(mmD * pi180) * mmR) + mmCy;
            svg.find('.svg_mm_btn').css({
                cx: mmX,
                cy: mmY
            });

            var ssObj = svg.find('.svg_ss');
            var ssR = parseInt(ssObj.css('r'));
            var ssCx = parseInt(ssObj.css('cx'));
            var ssCy = parseInt(ssObj.css('cy'));
            var ssD = (360 / 60 * nowDate.getSeconds()) - 90;
            var ssX = (Math.cos(ssD * pi180) * ssR) + ssCy;
            var ssY = (Math.sin(ssD * pi180) * ssR) + ssCx;
            svg.find('.svg_ss_btn').css({
                cx: ssX,
                cy: ssY
            });
        });
    };
});