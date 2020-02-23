(function ($) {
    $.fn.extend({
        totalPage: 0,
        currentPage: 1,
        target: null,
        pageInit: function (queryFunction) {
            this.target = $(this);
            this.setCss();
            let _this = this;
            queryFunction(this.currentPage, function (res) {
                console.log(res);
                _this.totalPage = res.totalPage;
                _this.setPage();
                _this.listen(queryFunction);
            });
        },
        setCss: function () {
            let css = ".list-page .page-warp{\n" +
                "\tfloat: right;\n" +
                "\theight:32px;\n" +
                "}\n" +
                "\n" +
                ".list-page .page-num{\n" +
                "\theight: 100%;\n" +
                "\tfloat: left;\n" +
                "}\n" +
                "\n" +
                ".list-page .page-num a{\n" +
                "\tdisplay: block;\n" +
                "\tfloat: left;\n" +
                "\twidth: 30px;\n" +
                "\theight: 30px;\n" +
                "\tline-height: 30px;\n" +
                "\ttext-align: center;\n" +
                "\tmargin-left: 5px;\n" +
                "}\n" +
                "\n" +
                ".list-page .page-num .page-up{\n" +
                "\twidth: 72px;\n" +
                "\tbackground-color: #f2f2f2;\n" +
                "\tborder: solid 1px #e6e6e6;\n" +
                "\tpadding-left: 5px;\n" +
                "}\n" +
                "\n" +
                ".list-page .page-num .no-current{\n" +
                "\tbackground-color: #f2f2f2;\n" +
                "\tborder: solid 1px #e6e6e6;\n" +
                "}\n" +
                ".list-page .page-num .current{\n" +
                "\tcolor:#ff896b;\n" +
                "}\n" +
                "\n" +
                ".list-page .page-num .page-next{\n" +
                "\twidth: 72px;\n" +
                "\tbackground-color: #f2f2f2;\n" +
                "\tborder: solid 1px #e6e6e6;\n" +
                "\tpadding-left: 5px;\n" +
                "\tmargin-left: 5px;\n" +
                "}\n" +
                "\n" +
                ".list-page .page-num .disabled{\n" +
                "\tbackground-color: #ffffff;\n" +
                "}\n" +
                "\n" +
                "\n" +
                "\n" +
                ".list-page .page-skip{\n" +
                "\theight: 100%;\n" +
                "\tfloat: left;\n" +
                "\tmargin-left: 29px;\n" +
                "}\n" +
                "\n" +
                ".list-page .page-skip em{\n" +
                "\theight: 30px;\n" +
                "\tfont-family: PingFang-SC-Bold;\n" +
                "\tfont-size: 14px;\n" +
                "\tfont-weight: normal;\n" +
                "\tfont-stretch: normal;\n" +
                "\tline-height: 30px;\n" +
                "\tletter-spacing: 0px;\n" +
                "\tcolor: #434343;\n" +
                "}\n" +
                "\n" +
                ".list-page .page-skip input{\n" +
                "\twidth: 48px;\n" +
                "\theight: 30px;\n" +
                "\tbackground-color: #ffffff;\n" +
                "\tborder: solid 1px #e6e6e6;\n" +
                "}\n" +
                "\n" +
                ".list-page .page-skip a{\n" +
                "\tdisplay: inline-block;\n" +
                "\twidth: 48px;\n" +
                "\theight: 30px;\n" +
                "\tline-height: 30px;\n" +
                "\ttext-align: center;\n" +
                "\tbackground-color: #f2f2f2;\n" +
                "\tborder: solid 1px #e6e6e6;\n" +
                "\tmargin-left: 18px;\n" +
                "}";

            $('head').append("<style>" + css + "</style>");
        },
        setPage: function () {
            let currentPage = this.currentPage;
            let totalPage = this.totalPage;
            let target = this.target;
            let html = '<div class="list-page">\n' +
                '                <div class="page-warp">\n' +
                '                    <span class="page-num">';
            if (currentPage == 1) {
                html +=
                    '<a href="javascript:;" class="page-up disabled"><i> < </i> <em>上一页</em></a>';
            } else {
                html += '<a href="javascript:;" class="page-up"><i> < </i> <em>上一页</em></a>';
            }
            if (totalPage <= 10) {
                for (let i = 1; i <= totalPage; i++) {
                    if (currentPage == i) {
                        html += '<a href="javascript:;" class="page-item">' + i + '</a>';
                    } else {
                        html += '<a href="javascript:;" class="page-item no-current">' + i + '</a>';
                    }
                }
            } else {
                let pageData = [];

                let front = currentPage - 1;

                if (front <= 4) {
                    for (let i = 1; i <= currentPage; i++) {
                        pageData.push({
                            index: i,
                            value: i
                        })
                    }
                } else {
                    pageData = [{
                        index: 1,
                        value: 1
                    }, {
                        index: 2,
                        value: '...'
                    }]
                    let index = 3;
                    for (let i = currentPage - 3; i <= currentPage; i++) {
                        pageData.push({
                            index: index++,
                            value: i
                        });
                    }
                }

                let after = totalPage - currentPage;
                if (after <= 3) {
                    for (let i = currentPage + 1; i <= totalPage; i++) {
                        pageData.push({
                            index: i,
                            value: i
                        })
                    }
                } else {
                    let index = pageData.length;
                    for (let m = currentPage + 1; m <= currentPage + 2; m++) {
                        pageData.push({
                            index: index++,
                            value: m
                        });
                    }
                    pageData.push({
                        index: 9,
                        value: '...'
                    });
                    pageData.push({
                        index: 10,
                        value: totalPage
                    });
                }
                pageData.map(function (item, idx) {
                    if (item.value == currentPage) {
                        html += '<a href="javascript:;" class="page-item current">' + item
                            .value +
                            '</a>';
                    } else {
                        if (item.value != '...') {
                            html += '<a href="javascript:;" class="page-item no-current">' +
                                item.value +
                                '</a>';
                        } else {
                            html += '<a href="javascript:;" class="">' + item.value +
                                '</a>';
                        }
                    }
                });
            }
            if (currentPage == totalPage) {
                html += '<a href="javascript:;" class="page-next disabled"><em>下一页</em><i>></i></a>';
            } else {
                html += '<a href="javascript:;" class="page-next"><em>下一页</em><i>></i></a>';
            }

            let showBefore = target.attr('data-show-before');
            if(parseInt(showBefore) == 2){
                html = '<div class="list-page">\n' +
                '                <div class="page-warp">\n' +
                '                    <span class="page-num">';
            }

            let showAfter = target.attr('data-show-after');

            if(parseInt(showAfter) !== 2){
                html += '</span>\n' +
                '                    <span class="page-skip">\n' +
                '                        <em>共<b>' + totalPage + '</b>页 到第</em>\n' +
                '                        <input type="number" class="page-number" min="1" max="'+totalPage+'">\n' +
                '                        <em>页</em>\n' +
                '                        <a href="javascript:;" class="page-submit">确定</a>\n' +
                '                    </span>\n' +
                '                </div>\n' +
                '            </div>';
            } else {
                html += '</span>\n' +
                '                    <span class="page-skip">\n' +
                '                    </span>\n' +
                '                </div>\n' +
                '            </div>';
            }
            target.html(html);
        },
        listen: function (queryFunction) {
            let _this = this;
            let target = this.target;
            target.on('click', '.page-item', function () {
                let page = $(this).text();
                _this.currentPage = parseInt(page);
                _this.setPage();
                queryFunction(_this.currentPage);
            }).on('click', '.page-up', function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                _this.currentPage -= 1;
                _this.setPage();
                queryFunction(_this.currentPage);
            }).on('click', '.page-next', function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                _this.currentPage += 1;
                _this.setPage();
                queryFunction(_this.currentPage);
            }).on('click', '.page-submit', function () {
                let page = target.find('.page-number').val();

                page = parseInt(page);

                if (page > 0 && page <= _this.totalPage) {
                    _this.currentPage = page;
                    _this.setPage();
                    queryFunction(_this.currentPage)
                }
            })
        }
    });
})(jQuery);