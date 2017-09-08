$(function () {
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
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
        var svg = $(document.createElementNS('http://www.w3.org/2000/svg', 'svg')).addClass('svg_info').attr("height", sh + 50).append($('<g/>').append($('<line y1="0" y2="' + sh + '" class="solid"/>').attr("x1", left).attr("x2", left)).append($('<line y1="' + sh + '" x2="100%" y2="' + sh + '" class="solid"/>').attr("x1", left)));
        var g = $('<g/>').appendTo(svg);
        var xGz = $('<g/>').appendTo(svg);
        var xGText = $('<g/>').appendTo(svg);
        for (var k = 0, m = yh / data.y.length; k < data.y.length; k++) {
            var h = (yh - (m * (k + 1))) + yhh;
            svg.data(data.y[k] + "_y", h);
            $('<line x1="' + left + '" y1="' + h + '" x2="100%" y2="' + h + '" class="mind"/>').appendTo(g);
            $('<line y1="' + h + '" y2="' + h + '" class="solid"/>').attr("x1", (parseInt(left.split("%")) - 0.3) + "%").attr("x2", left).appendTo(xGz);
            $('<text y="' + (h + 5) + '" class="text"/>').attr("x", (parseInt(left.split("%")) - 1) + "%").append(data.y[k]).appendTo(xGText);
        }
        var yGz = $('<g/>').appendTo(svg);
        var yGText = $('<g/>').appendTo(svg);
        var len = 25;
        var xg = (100 - parseInt(left.split("%"))) / len;
        for (var m = 0; m < len; m++) {
            var xgg = ((xg * m) + parseInt(left.split("%"))) + "%";
            var xggt = ((xg * m) + parseInt(left.split("%")) + 0.8) + "%";
            $('<line y1="' + sh + '" y2="' + (sh + 3) + '" class="solid"/>').attr("x1", xgg).attr("x2", xgg).appendTo(yGz);
            $('<text y="' + (sh + 20) + '" class="text"/>').attr("x", (parseInt(left.split("%")) - 1) + "%").attr("x", xggt).append(m >= 24 ? m - 24 < 10 ? "0" + (m - 24) : (m - 24) : m < 10 ? "0" + m : m).appendTo(yGText);
        }
        if (data) {
            var yGTimeG = $('<g/>').appendTo(svg);
            var zxg = (100 - parseInt(left.split("%"))) / (1000 * 60 * 60 * 25);
            var startDate = new Date($('.date>.btn-success').data('data').getTime());
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            var endDate = new Date($('.date>.btn-success').data('data').getTime());
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);
            for (var z = 0; z < data.data.length; z++) {
                console.log(data.data[z])
                var yGTime = $('<g class="time_line"/>').data('data', data.data[z]).appendTo(yGTimeG);
                var y = svg.data(data.data[z].room + "_y");
                var sd = new Date(Date.parse(data.data[z].startDate.replace(/-/g, "/")));
                var x1 = sd.getTime() < startDate.getTime() ? left : ((Math.abs(startDate.getTime() - sd.getTime()) * zxg) + parseInt(left.split("%"))) + "%";
                $('<circle r="2.5" class="circle"/>').attr("cx", x1).attr("cy", y).appendTo(yGTime);
                var ed = new Date(Date.parse(data.data[z].endDate.replace(/-/g, "/")));
                var x2 = (ed.getTime() > endDate.getTime() ? ((xg * (len - 1)) + parseInt(left.split("%"))) : ((Math.abs(startDate.getTime() - ed.getTime()) * zxg) + parseInt(left.split("%")))) + "%";
                $('<line class="line"/>').attr("x1", x1).attr("x2", x2).attr("y1", y).attr("y2", y).appendTo(yGTime);
                $('<circle r="2.5" class="circle"/>').attr("cx", x2).attr("cy", y).appendTo(yGTime);
            }
        }
        $(".info").html(svg.prop("outerHTML")).find(".time_line").hover(function () {
            // $(this).children().css({'stroke': 'red'});
        }, function () {
            // $(this).children().removeAttr('style');
        }).on('click', function () {
            console.log($(this).prop("outerHTML"))
            $('.svg_info').data('select', $(this).data('data'));
            $(this).children().css({'stroke': 'red'});
        });

        $('body').keydown(function (e) {
            if (e.which === 8) {
                var select = $('.svg_info').data('select');
                console.log(select)
                // $.post('', {}, function () {
                //
                // });
            }
        });
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
            query($('.menu>.citys>.btn-success').data('data').name, $('.menu>.floors>.btn-success').data('data').name, startDate, endDate, $('.menu>.floors>.btn-success').data('data').rooms);
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
                        var startDate = new Date($('.date>.btn-success').data('data').getTime());
                        startDate.setHours(0);
                        startDate.setMinutes(0);
                        startDate.setSeconds(0);
                        var endDate = new Date($('.date>.btn-success').data('data').getTime());
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
        var menuCitySelects = $(".menu>.floors>.btn-success").data("data");
        var menuFloorsSelect = $(".menu>.floors>.btn-success").data("data");
        if (addCitySelects && addFloorsSelect && menuCitySelects && menuFloorsSelect && menuCitySelects.name === addCitySelects.name && menuFloorsSelect.name === addFloorsSelect.name) {
            return;
        }
        var addCitys = $('.mrr_add .add_citys').empty();
        $('.menu>.citys').data('data').forEach(function (city) {
            $('<buttom type="buttom" class="btn btn-sm red_border"></buttom>').append(city.name).addClass($(".menu>.citys>.btn-success").data("data") && city.name === $(".menu>.citys>.btn-success").data("data").name ? 'btn-success' : 'btn-outline-success').data("data", city).on("click", function () {
                $(this).removeClass('red_border').removeClass("btn-outline-success").addClass("btn-success").siblings().removeClass('red_border').removeClass("btn-success").addClass('btn-outline-success');
                var addFloors = $('.mrr_add .add_floors').empty();
                $(this).data('data').floors.forEach(function (floor) {
                    $('<buttom type="buttom" class="btn btn-sm red_border"></buttom>').append(floor.name).addClass($(".menu>.floors>.btn-success").data("data") && floor.name === $(".menu>.floors>.btn-success").data("data").name ? 'btn-success' : 'btn-outline-success').data("data", floor).on("click", function () {
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
    });

    $('.mrr_add .add_save').on('click', function () {
        var addCitySelects = $('.mrr_add .add_citys>.btn-success').data('data');
        var addFloorsSelect = $('.mrr_add .add_floors>.btn-success').data('data');
        var addRoomsSelect = $('.mrr_add .add_rooms>.btn-success').data('data');
        if (!($(".mrr_add form").valid() && addCitySelects && addFloorsSelect && addRoomsSelect)) {
            return;
        }
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
            data = $.parseJSON(data);
            if (data && data.status) {
                $('.mrr_add').modal('hide');
                return;
            }
            $('.mrr_add .modal-body .alert').alert('close');
            $('<div class="alert alert-danger" role="alert"/>').append(data.msg).append('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>').appendTo($('.mrr_add .modal-body'));
        });
    });
});