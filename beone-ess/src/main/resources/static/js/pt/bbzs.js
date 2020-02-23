$(function () {
    layui.use(['table', 'form', 'laydate', 'upload'], function () {
        window.selxmlx = function(){
            var json={};
            json.ASD=jsonASD;
            getAjax({url:getBblxUrl,data:JSON.stringify(json),callback:function (reg) {
                    var list = reg.data;
                    var list2 = reg.data2;
                    var list3 = reg.data3;
                    var divs = '';
                    if(list.length > 0){
                        XMID = list[0].id;
                    }
                    for (var i=0;i<list.length;i++){
                        var name = list[i].name;
                        var len = GetLength(name);
                        if(len > 15){
                            name = cutstr(name, 15);
                        }
                        divs += '<div class="lxCon" ywid="'+ list[i].id+'" title="'+ list[i].name +'">\n' +
                            '                <div class="lxImg">\n' +
                            '                    <img class="lxImg-img" src="'+basePath+'img/bbgl/gray/icon_01.png">\n' +
                            '                </div>\n' +
                            '                <div class="lxTitle">\n' +
                            '                    <span>'+ name +'</span>\n' +
                            '                </div>\n' +
                            '            </div>';
                    }
                    $("#lx").html(divs);
                    var options = '';
                    for (var i=0;i<list2.length;i++){
                        options += '<option value="'+ list2[i].fbnf+'">'+list2[i].fbnf+'</option>';
                    }
                    $("#chooseYear").html(options);
                    var divs2 = '';
                    $("#tops").html('');
                    $("#bottoms").html('');
                    for(var i=0;i<list3.length;i++){
                        if(i%2 == 0){
                            divs2 = '<div class="bbBlock-top">\n' +
                                '                    <div class="bbBlock-title">\n' +
                                '                        <span>'+ list3[i].ptbbwh_fbsj+'('+ list3[i].ptbbwh_bbh +')</span>\n' +
                                '                    </div>\n' +
                                '                    <div class="bbBlock-con">\n' +
                                '                        <div class="bbBlock-con-con">'+ list3[i].ptbbwh_fbnr+'</div>\n' +
                                '                    </div>\n' +
                                '                </div>';
                            $("#tops").append(divs2);
                        }else{
                            divs2 = '<div class="bbBlock-bottom">\n' +
                                '                    <div class="bbBlock-title">\n' +
                                '                        <span>'+ list3[i].ptbbwh_fbsj +'('+ list3[i].ptbbwh_bbh +')</span>\n' +
                                '                    </div>\n' +
                                '                    <div class="bbBlock-con">\n' +
                                '                        <div class="bbBlock-con-con">'+ list3[i].ptbbwh_fbnr +'</div>\n' +
                                '                    </div>\n' +
                                '                </div>';
                            $("#bottoms").append(divs2);
                        }
                    }
                    refreshJtcy();
                }
            });
        }

        window.refreshJtcy = function(){
            $("#lx .lxCon").unbind();
            $("#lx .lxCon").click(function () {
                XMID = $(this).attr('ywid');
                var nf = $("#chooseYear").val();
                detail(XMID, nf);
            });
        }

        window.detail = function(XMID, nf){
            var json={};
            json.ASD=jsonASD;
            json.xmid = XMID;
            json.fbnf = nf;
            getAjax({url:getBblxUrl2,data:JSON.stringify(json),callback:function (reg) {
                    var list3 = reg.data3;
                    var divs2 = '';
                    $("#tops").html('');
                    $("#bottoms").html('');
                    for(var i=0;i<list3.length;i++){
                        if(i%2 == 0){
                            divs2 = '<div class="bbBlock-top">\n' +
                                '                    <div class="bbBlock-title">\n' +
                                '                        <span>'+ list3[i].ptbbwh_fbsj+'('+ list3[i].ptbbwh_bbh +')</span>\n' +
                                '                    </div>\n' +
                                '                    <div class="bbBlock-con">\n' +
                                '                        <div class="bbBlock-con-con">'+ list3[i].ptbbwh_fbnr+'</div>\n' +
                                '                    </div>\n' +
                                '                </div>';
                            $("#tops").append(divs2);
                        }else{
                            divs2 = '<div class="bbBlock-bottom">\n' +
                                '                    <div class="bbBlock-title">\n' +
                                '                        <span>'+ list3[i].ptbbwh_fbsj +'('+ list3[i].ptbbwh_bbh +')</span>\n' +
                                '                    </div>\n' +
                                '                    <div class="bbBlock-con">\n' +
                                '                        <div class="bbBlock-con-con">'+ list3[i].ptbbwh_fbnr +'</div>\n' +
                                '                    </div>\n' +
                                '                </div>';
                            $("#bottoms").append(divs2);
                        }
                    }
                }
            });
        }

        window.selBbxx = function(){
            var nf = $("#chooseYear").val();
            if(XMID == ''){
                layer.msg("项目为空！", {offset: '200px'});
                return false;
            }
            detail(XMID, nf);
        }
        selxmlx();
    });
});
