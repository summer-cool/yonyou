var md5 = require('js-md5');
export default function webOpenoffice(p){
    if ("Win32" != navigator.platform && "Windows" != navigator.platform) return alert("抱歉，目前只支持window系统打开!");
    let code;
    let u = '';//url参数整合
    let t = {//环境及域名
        develop: {
            esn: "http://web.chaoke.com:91",
            diwork: "http://web.yyuap.com:91"
        },
        prerelease: {
            esn: "https://ec.yonyoucloud.com",
            diwork: "https://workbench-daily.yyuap.com"
        },
        online: {
            esn: "https://pub.esn.ren",
            diwork: "https://www.diwork.com"
        }
    };
    p && Object.keys(p).forEach((key)=>{
        if(key!="openUrl"){
            u+=`&${key}=${p[key]}`;
        }
    });
    let l = encodeURIComponent(`${p.openUlr}?${u}`);//传入后台最终跳转url
    location.href = `KGBrowser://$link:${t[p.hostType][p.useFor]}/account/signUp/jinge?redirect_url=${l}&client_code=${p[code]}&detailEs=${md5(p[code]+'3877784962425a6e766b6d6c495a4f736a654659')}$skin=0$titlecolor=f6f6f6$tabshow=1$postdata=`
}