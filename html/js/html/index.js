$(function () {

    $.ajaxSetup({
        beforeSend: function () {
            NProgress.start();
        },
        complete: function () {
            NProgress.done();
        }
    });

    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    function chart(data) {
        var yh = ((data.y.length ) * 40);
        var yhh = 40;
        var sh = yh + yhh;
        var left = "5%";
        var ns = 'http://www.w3.org/2000/svg';
        var len = 25;
        var xg = (100 - parseInt(left.split("%"))) / len;
        var info = $(".info").empty();
        info.append($(document.createElementNS(ns, 'svg')).addClass('svg_info').attr("height", sh + 50).append($(document.createElementNS(ns, 'g')).append($(document.createElementNS(ns, 'line')).attr("x1", left).attr('y1', '0').attr("x2", left).attr('y2', sh).addClass('solid')).append($(document.createElementNS(ns, 'line')).attr("x1", left).attr('y1', sh).attr("x2", '100%').attr('y2', sh).addClass('solid'))).append(function () {
            var g = $(document.createElementNS(ns, 'g'));
            var m = yh / data.y.length;
            data.y.forEach(function (y, i) {
                var h = (yh - (m * (i + 1))) + yhh;
                info.data(y, h);
                g.append($(document.createElementNS(ns, 'line')).attr('x1', left).attr('y1', h).attr('x2', '100%').attr('y2', h).addClass('mind')).append($(document.createElementNS(ns, 'line')).attr("x1", (parseInt(left.split("%")) - 0.3) + "%").attr('y1', h).attr("x2", left).attr('y2', h).addClass('solid')).append($(document.createElementNS(ns, 'text')).attr("x", (parseInt(left.split("%")) - 1) + "%").attr('y', h + 5).addClass('text').append(y));
            });
            return g;
        }()).append(function () {
            var g = $(document.createElementNS(ns, 'g'));
            var xg = (100 - parseInt(left.split("%"))) / len;
            for (var i = 0; i < len; i++) {
                var xgg = ((xg * i) + parseInt(left.split("%"))) + "%";
                var xggt = ((xg * i) + parseInt(left.split("%")) + 0.8) + "%";
                g.append($(document.createElementNS(ns, 'line')).attr("x1", xgg).attr('y1', sh).attr("x2", xgg).attr('y2', sh + 3).addClass('solid')).append($(document.createElementNS(ns, 'text')).attr("x", xggt).attr('y', sh + 20).addClass('text').append(i >= 24 ? i - 24 < 10 ? "0" + (i - 24) : (i - 24) : i < 10 ? "0" + i : i));
            }
            return g;
        }()).append(function () {
            var g = $(document.createElementNS(ns, 'g'));
            if (data) {
                var zxg = (100 - parseInt(left.split("%"))) / (1000 * 60 * 60 * 25);
                var time = $('.date>.btn-success').data('data').getTime();
                var startDate = new Date(time);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);
                var endDate = new Date(time);
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);
                data.data.forEach(function (line) {
                    var sd = new Date(Date.parse(line.startDate.replace(/-/g, "/")));
                    var x1 = sd.getTime() < startDate.getTime() ? left : ((Math.abs(startDate.getTime() - sd.getTime()) * zxg) + parseInt(left.split("%"))) + "%";
                    var ed = new Date(Date.parse(line.endDate.replace(/-/g, "/")));
                    var x2 = (ed.getTime() > endDate.getTime() ? ((xg * (len - 1)) + parseInt(left.split("%"))) : ((Math.abs(startDate.getTime() - ed.getTime()) * zxg) + parseInt(left.split("%")))) + "%";
                    var y = info.data(line.room);
                    g.append($(document.createElementNS(ns, 'g')).data('data', line).addClass('time_line').append($(document.createElementNS(ns, 'circle')).attr('r', 2.5).attr("cx", x1).attr("cy", y).addClass('circle')).append($(document.createElementNS(ns, 'line')).attr("x1", x1).attr("x2", x2).attr("y1", y).attr("y2", y).addClass('line')).append($(document.createElementNS(ns, 'circle')).attr('r', 2.5).attr("cx", x2).attr("cy", y).addClass('circle')).on('click', function () {
                        var data = $(this).data('data');
                        var info = $('.svg_info');
                        if (data === info.data('select')) {
                            info.removeData('select');
                            $(this).removeClass('line_select');
                            return;
                        }
                        info.data('select', $(this).data('data'));
                        $(this).addClass('line_select').siblings('g').removeClass('line_select');
                    }).popover({
                        trigger: 'hover',
                        placement: 'auto',
                        html: true,
                        title: function () {
                            return $(this).data('data').conferenceName;
                        },
                        delay: {show: 100, hide: 100},
                        content: function () {
                            var timeLine = $(this).data('data');
                            return '<ul class="time_line_alt"><li>' + timeLine.city + '</li><li>' + timeLine.floor + '</li><li>' + timeLine.room + '</li><li>' + timeLine.startDate + '</li><li>' + timeLine.endDate + '</li><li>' + timeLine.people + '</li><li>' + timeLine.phone + '</li><li>' + timeLine.createDate + '</li></ul>';
                        }
                    }));
                });
            }
            return g;
        }));
    }

    function query(city, floor, startDate, endDate, rooms) {
        $.post("mrr/query", {
            city: city,
            floor: floor,
            startDate: startDate.format("yyyy-MM-dd HH:mm:ss"),
            endDate: endDate.format("yyyy-MM-dd HH:mm:ss")
        }, function (list) {
            list = $.parseJSON(list);
            if (list && list.status) {
                var data = {
                    x: [],
                    y: rooms,
                    data: list.data
                };
                chart(data);
            }
        });
    }

    var nowDate = new Date();
    nowDate.setDate(nowDate.getDate() - 3);
    for (var i = 0; i < 30; i++) {
        nowDate.setDate(nowDate.getDate() + 1);
        $('<buttom type="buttom" class="btn btn-sm"/>').append(nowDate.format("dd")).data("data", new Date(nowDate.getTime())).addClass((new Date().format("yyyy-MM-dd")) === nowDate.format("yyyy-MM-dd") ? "btn-success" : "btn-outline-success").addClass((new Date().format("yyyy-MM-dd")) === nowDate.format("yyyy-MM-dd") ? "now" : "").on("click", function () {
            !($(this).parent().find('.now').data('data').getTime() === $(this).data('data').getTime()) ? $(this).parent().find('.now').removeClass('btn-outline-success').addClass('btn-outline-info') : $(this).removeClass('btn-outline-info');
            $(this).removeClass("btn-outline-success").addClass("btn-success").siblings().removeClass("btn-success").addClass('btn-outline-success');
            var startDate = new Date($(this).data('data').getTime());
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            var endDate = new Date($(this).data('data').getTime());
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            var floor = $('.menu>.floors>.btn-success').data('data');
            floor ? query($('.menu>.citys>.btn-success').data('data').name, floor.name, startDate, endDate, floor.rooms) : null;
        }).appendTo($('.date'));
    }

    $.get("conf/citys.json", function (data) {
        var citys = $("<div class='citys'/>").data('data', data).appendTo($(".menu"));
        for (var i = 0; i < data.length; i++) {
            $('<buttom type="buttom" class="btn">' + data[i].name + '</buttom>').addClass(localStorage ? (data[i].name === localStorage.getItem("city") ? 'btn-success' : 'btn-outline-success') : 'btn-outline-success').data("data", data[i]).on("click", function () {
                $(this).removeClass("btn-outline-success").addClass("btn-success").siblings().removeClass("btn-success").addClass('btn-outline-success');
                var city = $(this).data("data");
                localStorage ? localStorage.setItem("city", city.name) : null;
                var floorsData = city.floors;
                $(".menu>.floors").remove();
                var floors = $("<div class='floors'/>").appendTo($(".menu"));
                for (var j = 0; j < floorsData.length; j++) {
                    $('<buttom type="buttom" class="btn">' + floorsData[j].name + '</buttom>').addClass(localStorage ? (floorsData[j].name === localStorage.getItem("floor") ? 'btn-success' : 'btn-outline-success') : 'btn-outline-success').data("data", floorsData[j]).on("click", function () {
                        $(this).removeClass("btn-outline-success").addClass("btn-success").siblings().removeClass("btn-success").addClass('btn-outline-success');
                        var floor = $(this).data("data");
                        localStorage ? localStorage.setItem("floor", floor.name) : null;
                        var time = $('.date>.btn-success').data('data').getTime();
                        var startDate = new Date(time);
                        startDate.setHours(0);
                        startDate.setMinutes(0);
                        startDate.setSeconds(0);
                        var endDate = new Date(time);
                        endDate.setHours(23);
                        endDate.setMinutes(59);
                        endDate.setSeconds(59);
                        query(city.name, floor.name, startDate, endDate, floor.rooms);
                    }).appendTo(floors);
                }
            }).appendTo(citys);
        }
        citys.find(".btn-success").click().parent().parent().find(".floors>.btn-success").click();
    });

    $('.mrr_add').on('show.bs.modal', function () {
        $('.mrr_add .add_rooms').empty();
        $('.mrr_add .add_floors').empty();
        var addCitySelects = $('.mrr_add .add_citys>.btn-success').data('data');
        var addFloorsSelect = $('.mrr_add .add_floors>.btn-success').data('data');
        var menuCitySelects = $(".menu>.citys>.btn-success").data("data");
        var menuFloorsSelect = $(".menu>.floors>.btn-success").data("data");
        if (addCitySelects && addFloorsSelect && menuCitySelects && menuFloorsSelect && menuCitySelects.name === addCitySelects.name && menuFloorsSelect.name === addFloorsSelect.name) {
            return;
        }
        var addCitys = $('.mrr_add .add_citys').empty();
        $('.menu>.citys').data('data').forEach(function (city) {
            var data = $(".menu>.citys>.btn-success").data("data");
            $('<buttom type="buttom" class="btn btn-sm red_border"></buttom>').append(city.name).addClass(data && city.name === data.name ? 'btn-success' : 'btn-outline-success').data("data", city).on("click", function () {
                $(this).removeClass('red_border').removeClass("btn-outline-success").addClass("btn-success").siblings().removeClass('red_border').removeClass("btn-success").addClass('btn-outline-success');
                var addFloors = $('.mrr_add .add_floors').empty();
                $(this).data('data').floors.forEach(function (floor) {
                    var data = $(".menu>.floors>.btn-success").data("data");
                    $('<buttom type="buttom" class="btn btn-sm red_border"></buttom>').append(floor.name).addClass(data && floor.name === data.name ? 'btn-success' : 'btn-outline-success').data("data", floor).on("click", function () {
                        $(this).removeClass('red_border').removeClass("btn-outline-success").addClass("btn-success").siblings().removeClass('red_border').removeClass("btn-success").addClass('btn-outline-success');
                        var addRooms = $('.mrr_add .add_rooms').empty();
                        $(this).data('data').rooms.forEach(function (room) {
                            $('<buttom type="buttom" class="btn btn-sm btn-outline-success red_border"></buttom>').append(room).data('data', room).on('click', function () {
                                $(this).removeClass('red_border').removeClass("btn-outline-success").addClass("btn-success").siblings().removeClass('red_border').removeClass("btn-success").addClass('btn-outline-success');
                            }).appendTo(addRooms);
                        });
                    }).appendTo(addFloors);
                });
                addCitys.parent().parent().find(".add_floors>.btn-success").click();
            }).appendTo(addCitys);
        });
        addCitys.find(".btn-success").click().parent().parent().parent().find(".add_floors>.btn-success").click();
    }).on('shown.bs.modal', function () {
        $(".mrr_add form").valid();
    }).on('hide.bs.modal', function () {
        $('.mrr_add .modal-body .alert').alert('close');
    }).keydown(function (e) {
        if (e.which === 13 || e.which === 108) {
            $(this).find('.add_save').click();
        }
    }).on('click', function () {
        $('.svg_datatime_div').remove();
    });

    $('.mrr_add .add_save').on('click', function () {
        var addCitySelects = $('.mrr_add .add_citys>.btn-success').data('data');
        var addFloorsSelect = $('.mrr_add .add_floors>.btn-success').data('data');
        var addRoomsSelect = $('.mrr_add .add_rooms>.btn-success').data('data');
        if (!($(".mrr_add form").valid() && addCitySelects && addFloorsSelect && addRoomsSelect)) {
            return;
        }
        $(this).attr('disabled', 'disabled');
        $.post('mrr/reserve', {
            city: addCitySelects.name,
            floor: addFloorsSelect.name,
            room: addRoomsSelect,
            startDate: $('.mrr_add input[name=startDate]').val(),
            endDate: $('.mrr_add input[name=endDate]').val(),
            password: $('.mrr_add input[name=password]').val(),
            conferenceName: $('.mrr_add input[name=conferenceName]').val(),
            people: $('.mrr_add input[name=people]').val(),
            phone: $('.mrr_add input[name=phone]').val()
        }, function (data) {
            $('.mrr_add .add_save').removeAttr('disabled');
            data = $.parseJSON(data);
            if (data && data.status) {
                $('.mrr_add').modal('hide');
                $('.date>.btn-success').click();
                return;
            }
            $('.mrr_add .modal-body .alert').alert('close');
            $('<div class="alert alert-danger" role="alert"/>').append(data.msg).append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>').appendTo($('.mrr_add .modal-body'));
        });
    });

    $('.reserve .btn_mrr_del').on('click', function () {
        var data = $('.svg_info').data('select');
        var model = $('.mrr_del');
        if (data && model.is(":hidden")) {
            model.find('input[name=id]').val(data.id);
            model.find('input[name=city]').val(data.city);
            model.find('input[name=floor]').val(data.floor);
            model.find('input[name=room]').val(data.room);
            model.find('input[name=startDate]').val(data.startDate);
            model.find('input[name=endDate]').val(data.endDate);
            model.find('input[name=conferenceName]').val(data.conferenceName);
            model.find('input[name=people]').val(data.people);
            model.find('input[name=phone]').val(data.phone);
            model.find('input[name=createDate]').val(data.createDate);
            model.modal('show');
        }
    });

    $('body').keydown(function (e) {
        if (e.which === 8 || e.which === 127) {
            if ($('.mrr_add').is(":hidden")) {
                $('.reserve .btn_mrr_del').click();
            }
        }
    }).find('.del_save').on('click', function () {
        if (!($(".mrr_del form").valid())) {
            return;
        }
        $(this).attr('disabled', 'disabled');
        $.post('mrr/cancel', {
            id: $('.svg_info').data('select').id,
            password: $('.mrr_del input[name=password]').val()
        }, function (data) {
            $('.mrr_del .del_save').removeAttr('disabled');
            data = $.parseJSON(data);
            if (data && data.status) {
                $('.mrr_del').modal('hide');
                $('.date>.btn-success').click();
                return;
            }
            $('.mrr_del .modal-body .alert').alert('close');
            $('<div class="alert alert-danger" role="alert"/>').append(data.msg).append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>').appendTo($('.mrr_del .modal-body'));
        });
    });

    $('.mrr_del').on('shown.bs.modal', function () {
        $(".mrr_del form").valid();
    }).keydown(function (e) {
        if (e.which === 13 || e.which === 108) {
            $(this).find('.del_save').click();
        }
    });

    $('.datetime').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
    }).datetime({
        ss: false,
        close: function () {
            $(".mrr_add form").valid();
        }
    });
});