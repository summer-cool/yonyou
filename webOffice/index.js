window.onload = function () {
    var getUrlParams = function (name) { //��ȡurl��������
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.href.substr(window.location.href.indexOf("\?") + 1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };
    var WebOffice = new WebOffice2015(), //�������
        SignatureAPI,
        ajaxHost = "", //url--host
        readOnly = false, //ֻ��
        docFileName = getUrlParams("docFileName") || "", //��ǰ�ĵ���
        isNewCreated = getUrlParams("isNewCreated") || false, //�Ƿ�Ϊ�½��ĵ�
        vid = getUrlParams('vid'), //�汾id
        fid = getUrlParams('fid'),//�ĵ�id
        member_id = getUrlParams('member_id'), //��Աid
        filePath = window.location.origin+"/file/ndown/stream/fid/"+fid+"/vid/"+vid+"/qzid/"+qzid+"/member_id/" + member_id + "", //�ĵ���ַ
        qzid = getUrlParams("qzid") || "",
        isEditing = false, //�Ƿ��������ڱ༭
        showHistory = getUrlParams("showHistory") != null ? getUrlParams("showHistory") : true, //�Ƿ���ʾ��ʷ�汾��ť
        fileType = getUrlParams("fileType"), //�ĵ�����
        userName = getUrlParams("userName"), //�����ĵ���
        historyPath = "", //��ʷ�ļ�·��
        hisVid,//��ʷ�汾id
        StatusMsg,
        isOpenHistroy = false;//������ʷ�汾�б�İ汾
    var obj = {
        init: function () {
            this.setHost();
            this.bindEvent();
        },
        setHost: function () { //��������Host
            switch (window.location.host) {
                case "web.chaoke.com:91": //���Ի�����
                    ajaxHost = "http://web.api.chaoke.com:6062";
                    break;
                case "pub.esn.ren": //Ԥ����������
                    ajaxHost = "web-api.esn.ren";
                    break;
                case "ec.yonyoucloud.com": //����������
                    ajaxHost = "https://web-api.yonyoucloud.com";
                    break;
                default:
                    ajaxHost = "http://web.api.chaoke.com:6062";
                    break;
            };
            if (showHistory) {
                this.getHistroy();
            };
            this.lockDoc();
        },
        lockDoc: function () { //���� 
            var _this = this;
            this.ajaxFun({
                ajaxUrl: "/doc/editorLock",
                params: {
                    fid: fid,
                    v: 1.0,
                    lock:1
                }
            }, function (res) {
                if (res.code == 0) {
                    isEditing = false;
                }else{//�������ɹ���ʾ�������ڱ༭
                    isEditing = true;
                    alert(res.data.nickname + "���ڴ���ǰ�ļ������ݲ����޸ġ�");
                };
                _this.initTopMenu();
            });
        },
        unLock:function(){//����
            this.ajaxFun({
                ajaxUrl: "/doc/editorLock",
                params: {
                    fid: fid,
                    v: 1.0,
                    lock: 2
                }
            }, function (res) {

            });
        },
        getHistroy: function () { //��ȡ��ʷ�汾
            var _this = this;
            this.ajaxFun({
                ajaxUrl:"/rest/doc/getEditorRecord",
                params: {
                    qzid: qzid,
                    fid: fid,
                    vid: vid,
                    v:1.0
                }
            }, function (res) {
                if (res.code == 0) {
                    _this.initHistroyList(res.data);
                } else {
                    alert(res.error_description);
                };
            });
        },
        initHistroyList: function (data) {//��Ӱ汾��ʷ�б���dom
            var _this = this;
            var WordHistoryBox = $('#WordHistoryBox');
            WordHistoryBox.html('');
            var str = '';
            str += '<span class="document-history-title">��ʷ�ĸ�</span>';
            if (data.length > 0) {
                str += '<div class="document-history-main">';
                for (var i = 0; i < data.length; i++) {
                    str += '<span vid=' + data[i].vid + ' member_id=' + data[i].member_id + ' class="document-history-item">' + data[i].name + '</span>';
                }
                str += '</div>';
            } else {
                str += '<span class="document-no-history">������ʷ��¼</span>';
            };
            WordHistoryBox.html(str);
            $(".document-history-item").on("click", function () {
                $(this).addClass("active");
                hisVid = $(this).attr('vid');
                historyPath = window.location.origin + "/file/ndown/stream/fid/" + fid + "/vid/" + hisVid + "/qzid/" + qzid + "/member_id/" + $(this).attr("member_id") + ""; //-----------------------todo
                isOpenHistroy = true;
                $(".doc-history-title").html('��������');
                $('.document-history-item').removeClass('active');
                WebOffice.WebUrl = historyPath;
                WebOffice.WebOpen(); //����ѡ��ʷ�汾
                WebOffice.SetEditType("0");
            })
        },
        ajaxFun: function (para, call) { //ajax
            $.ajax({
                url: ajaxHost + para.ajaxUrl,
                type: para.type || "GET",
                data: para.params || {},
                dataType: "json",
                async :false,
                success: function (res) {
                    call && call(res);
                },
                fail: function (res) {
                    call && call(res);
                }
            });
        },
        initWeboffice: function () { //��ʼ��weboffice���
            //ƴ��Html
            var str = '';
            var copyright = '�ѿռ�[ר��];V5.0S0xGAAEAAAAAAAAAEAAAADgBAABAAQAALAAAAFQrGnSwm4qFu6rkNBXhTP69K4MP281M2xmioOYpSsf7FRvtIEBTLogvd4YXZpl3TamYF6ACBtQz1j7wa3KoL8WpvLo7xU8sPHaABsjcC0zDgJiNUPvKF034gUMs2wzBlJcOT7RCAv9XmMUpN8duKw7Ne5GBulAtkjXYyD/QCRk1rMJVkdCk6f6xBhiktkvHu2n07lhxOVh/gqMQwsNum+1/noqmCfMRmMaaZFF7OjmdQ5FF2fRvKIX8HSxu31K+h6ImJLCO91SWeX23RbUOKL6PB4/GIZ3hqV9j/WONbUvDlRY0Tha/pWrb2eMcYanDFYGvCWyQDbD47A1FC7c0pspr4h+13EPOy9/KbynS1M3HCG+RwX7iRNPwOGHKUDvNIEGnluT7YVUzDU6auNzeKPbjaq+39M/NPMSOBZka/YU2cWZiTjTmyZUc4asXw9ExlA==';
            str += '<object id="SignatureAPI" width="0" height="0" classid="clsid:857F9703-BE32-4BD4-92A4-D8079C10BD41"></object>';
            str += '<object id="WebOffice2015" ';
            str += ' width="100%"';
            str += ' height="100%"';
            if ((window.ActiveXObject != undefined) || (window.ActiveXObject != null) || "ActiveXObject" in window) {
                if (window.navigator.platform == "Win32") {
                    str += ' CLASSID="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D025"  codebase="iWebOffice2015.cab#version=12,4,0,500"';
                }
                if (window.navigator.platform == "Win64") {
                    str += ' CLASSID="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D024"  codebase="iWebOffice2015.cab#version=0,0,0,0"';
                }
                str += ' CLASSID="CLSID:D89F482C-5045-4DB5-8C53-D2C9EE71D025"  codebase="iWebOffice2015.cab#version="';
                str += '>';
                str += '<param name="Copyright" value="' + copyright + '">';
            } else {
                str += ' progid="Kinggrid.iWebOffice"';
                str += ' type="application/iwebplugin"';
                str += ' OnCommand="OnCommand"';
                str += ' OnReady="OnReady"';
                str += ' OnOLECommand="OnOLECommand"';
                str += ' OnExecuteScripted="OnExecuteScripted"';
                str += ' OnQuit="OnQuit"';
                str += ' OnSendStart="OnSendStart"';
                str += ' OnSending="OnSending"';
                str += ' OnSendEnd="OnSendEnd"';
                str += ' OnRecvStart="OnRecvStart"';
                str += ' OnRecving="OnRecving"';
                str += ' OnRecvEnd="OnRecvEnd"';
                str += ' OnRightClickedWhenAnnotate="OnRightClickedWhenAnnotate"';
                str += ' OnFullSizeBefore="OnFullSizeBefore"';
                str += ' OnFullSizeAfter="OnFullSizeAfter"';
                str += ' Copyright="' + copyright + '"';
                str += '>';
            }
            str += '</object>';

            var WebOfficeBox = document.getElementById('WebOfficeBox');
            WebOfficeBox.innerHTML = str;
            WebOffice.setObj(document.getElementById('WebOffice2015')); //��2015����ֵ
            SignatureAPI = document.getElementById("SignatureAPI");
            this.setWebofficeOpp();
        },
        setWebofficeOpp: function () { //����weboffice����
            WebOffice.FileType = fileType; //FileType:�ĵ�����  .doc  .xls
            WebOffice.UserName = userName; //�༭������
            WebOffice.RecordID = !!docFileName ? docFileName : "���߱༭";
            WebOffice.Skin('purple');
            WebOffice.ShowMenuBar(false);
            WebOffice.ShowToolBars(true);
            WebOffice.WebEnableCopy(true);
            WebOffice.ShowTitleBar(false); //����Ƥ��
            WebOffice.ShowStatusBar(true);
            WebOffice.HookEnabled();
            WebOffice.SetCaption();
            WebOffice.SetUser(userName);
            this.loadDoc();
        },
        loadDoc: function () { //�����ĵ�
            if (isNewCreated) { //�½��ĵ�
                WebOffice.CreateFile();
            } else if (!isNewCreated && readOnly) { //ֻ��
                WebOffice.WebUrl = filePath;
                WebOffice.WebOpen();
                WebOffice.SetEditType("0");
            } else {
                WebOffice.WebUrl = filePath;
                WebOffice.WebOpen();
            };
            WebOffice.VBASetUserName(userName); //�����û���
            WebOffice.WebObject.ActiveDocument.Application.UserInitials = userName; //�����û���д��
            StatusMsg = WebOffice.StatusMsg;
        },
        initTopMenu: function () { //��ʼ��ͷ����ťȺ
            $('.doc-print').show();
            $('.doc-download').show();
            if (isEditing) {
                readOnly = true;
            };
            if (showHistory) {
                $('.doc-history').show();
            };
            if (readOnly == false) {
                $('.doc-save').show();
                $('.document-menu-file').show();
                $('.item-writing').show();
                if (showHistory) {
                    $('.doc-history').show();
                }
            };
            this.initWeboffice();
        },
        closeWeboffice: function () { //�رղ��
            this.unLock();
            setTimeout("window.location.reload();", 1000);
            setTimeout("window.close();", 1000);
        },
        bindEvent: function () { //�󶨰�ť�¼���
            var _this = this;
            $(".doc-save").click(function () {
                _this.SaveDocument($(this));
            });
            $(".doc-download").click(function () {
                _this.SaveLocalDocument($(this));
            });
            $(".doc-print").click(function () {
                _this.PrintDocument($(this));
            });
            $(".word-pz").click(function () {
                _this.ReviewAnnotation($(this));
            });
            $(".word-clear").click(function () {
                _this.CleanCopyDocument($(this));
            });
            $(".show-orbit").click(function () {
                _this.ShowHideRevision(true, $(this));
            });
            $(".hide-orbit").click(function () {
                _this.ShowHideRevision(false, $(this));
            });
            $(".doc-history").click(function () {
                _this.ShowHistoryWord($(this));
            })
        },
        SaveDocument: function (obj) { //�����ļ�
            this.SelectMenuHandle(obj);
            WebOffice.ShowMenuBar(false);
            WebOffice.WebUrl = ajaxHost + "/doc/upload?v=1.0&qzid="+qzid+"";
            WebOffice.WebSave();
            this.closeWeboffice();
        },
        SaveLocalDocument: function (obj) { //�����ļ�
            this.SelectMenuHandle(obj);
            WebOffice.ShowMenuBar(false);
            if (!(typeof SignatureAPI.SetActiveDocument === 'undefined')) {
                SignatureAPI.SetActiveDocument(WebOffice.obj.ActiveDocument); //����word����
            }
            var signCount = SignatureAPI.AllSignatureCount;
            if (signCount > 0) {
                SignatureAPI.Action_Do(5);
            }
            var pdlg = WebOffice.WebObject.ActiveDocument.Application.FileDialog(2); //1.���ĵ�2.���Ϊ
            pdlg.InitialFileName = docFileName; //�Զ����ļ���
            pdlg.Show();
            pdlg.Execute();
        },
        PrintDocument: function (obj) { //��ӡ�ĸ�
            this.SelectMenuHandle(obj);
            WebOffice.ShowMenuBar(false);
            WebOffice.WebOpenPrint();
        },
        ReviewAnnotation: function (obj) { //������ע
            try {
                var range = WebOffice.WebObject.ActiveDocument.Application.Selection.Range;
                var comments = WebOffice.WebObject.ActiveDocument.Comments;
                comments.Add(range);
            } catch (e) {
                alert(e.description);
            }
        },
        CleanCopyDocument: function (obj) { //�ĵ����
            this.SelectMenuHandle(obj);
            WebOffice.ShowMenuBar(false);
            this.SaveHistoryWord(); //����word��ʷ�汾
            //WebOffice.WebObject.ActiveDocument.ActiveWindow.View.ShowRevisionsAndComments =false;   //������ע
            WebOffice.WebObject.ActiveDocument.Application.ActiveDocument.AcceptAllRevisions();
            WebOffice.WebObject.ActiveDocument.Application.ActiveDocument.Revisions.AcceptAll();
            //var mCount = WebOffice.WebObject.ActiveDocument.Application.ActiveDocument.Revisions.Count;
            var cCount = WebOffice.WebObject.ActiveDocument.Comments.Count;
            if (cCount > 0) {
                if (typeof WebOffice.WebObject.Application.WordBasic === 'undefined') {
                    if (typeof WebOffice.WebObject.Application.ActiveDocument.Comments(1) === 'undefined') {
                        if (!(typeof WebOffice.WebObject.Application.ActiveDocument.Selection === 'undefined')) {
                            WebOffice.WebObject.Application.ActiveDocument.Selection.Comments(1).Delete; //office2016
                        }
                    } else {
                        WebOffice.WebObject.Application.ActiveDocument.Comments(1).Delete; //wps2016
                    }
                } else {
                    if (typeof WebOffice.WebObject.Application.WordBasic.DeleteAllCommentsInDoc === 'undefined') {
                        if (typeof WebOffice.WebObject.Application.ActiveDocument.Comments(1) === 'undefined') {
                            if (typeof WebOffice.WebObject.Application.ActiveDocument.Selection === 'undefined') {} else {
                                WebOffice.WebObject.Application.ActiveDocument.Selection.Comments(1).Delete; //office2016
                            }
                        } else {
                            WebOffice.WebObject.Application.ActiveDocument.Comments(1).Delete; //wps2016
                        }
                    } else {
                        WebOffice.WebObject.Application.WordBasic.DeleteAllCommentsInDoc; //�����עoffice2007,2010
                    }
                }
            }
        },
        SaveHistoryWord: function () { //����word��ʷ�汾
            WebOffice.WebUrl = ajaxHost + "/doc/upload?v=1.0&qzid=" + qzid + "&mark=1&vid=" + hisVid + "" //-----------------------------todo
            WebOffice.WebSave();
        },
        ShowHideRevision: function (mValue, obj) { //��ʾ�����غۼ�[���غۼ�ʱ�޸��ĵ�û�кۼ�����]  true��ʾ���غۼ�  false��ʾ��ʾ�ۼ�
            WebOffice.ShowMenuBar(false);
            this.SelectMenuHandle(obj);
            if (mValue) {
                WebOffice.WebShow(true);
                StatusMsg("��ʾ�ۼ�...");
            } else {
                WebOffice.WebShow(false);
                StatusMsg("���غۼ�...");
            }
        },
        ShowHistoryWord: function (obj) { //��ʾ��ʷ�汾
            var _this = this;
            if (obj.hasClass('active-item')) {
                obj.removeClass('active-item');
                var WordHistoryBox = $('#WordHistoryBox');
                WordHistoryBox.innerHTML = '';
                $("#WebOfficeBox").css("right", "0");
                $(".word-history-content").hide();
                if (isOpenHistroy) {
                    isOpenHistroy = false;
                    $(".doc-history-title").html('��ʷ�ĸ�');
                    $(".document-history-item").removeClass("active");
                    if (readOnly) {
                        WebOffice.WebUrl = filePath;
                        WebOffice.WebOpen();
                        WebOffice.SetEditType("0");
                    } else {
                        WebOffice.WebUrl = filePath;
                        WebOffice.WebOpen();
                    };
                };
                this.initTopMenu();
            } else {
                $("#WebOfficeBox").css("right", "264px");
                $(".word-history-content").show();
                $(".doc-item").removeClass('active-item');
                obj.addClass('active-item');
            }
        },
        SelectMenuHandle: function (obj) { ////ѡ��ʱ�Ĳ˵�����
            this.CancelMenuHandle();
            this.StopWritingHandle();
            if ($(obj).hasClass('active-item')) {
                $(".doc-item").removeClass('active-item');
            } else {
                $(".doc-item").removeClass('active-item');
                $(obj).addClass('active-item');
            }
            WebOffice.ShowMenuBar(false);
        },
        CancelMenuHandle: function () {
            $(".doc-item").removeClass('active-item');
            $("#WebOfficeBox").css("top", "40px");
            $("#WordHistoryBox").css("top", "41px");
            $(".document-menu-handle-content").css("display", "none");
            $('#MenuHandleBox').html("");
        },
        StopWritingHandle: function () {
            this.CancelMenuHandle();
            WebOffice.StopHandWriting();
            WebOffice.ShowMenuBar(false);
        }
    };
    obj.init();
};