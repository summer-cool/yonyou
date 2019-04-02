# yy-open-jinge

> A Vue.js project

### -由于参数及接口局限性，目前只支持文库文件
> 此操作涉及打开其他浏览器打开文件，需要做单点登录验证才可查看编辑文件，以及参数较多，点击事件触发获取参数及配置参数跳转前建议做loding.
###  使用方法
```sh
    npm install yy-open-jinge
```
```js
<template>
    <div @click="openMethods">点击打开</div>
</template>
<script>
//组件内部引入
// 实例
    import webOpenoffice from "yy-open-jinge"
    export default{
        methods:{
            openMethods(){
                //设置参数
                let params = {
                    fid:114750,
                    qzid:1,
                    userName:"lijian",
                    member_id:213123,
                    openUrl:"web.chaoke.com/jinge.html",
                    vid:123,
                    code:3123,
                    fileType:".doc",
                    hostType:"develop",
                    useFor:"esn",
                    docFileName:"文库文档",
                    isNewCreated:false,
                    showHistory:true,
                };
                //调用
                webOpenoffice(params);
            }
        }
    }
</script>
```
### 参数说明
```sh
    fid(必填) - 文档id 
    qzid(必填) - 圈子id   --vue项目store中可拿到
    userName(必填) - 当前操作文件者   --vue项目store中可拿到
    member_id(必填) - 当前操作人员id   --vue项目store中可拿到
    openUrl(必填) - 跳转页面（金格所要打开页面）
    vid(有版本id则必填) - 所要打开文本版本id  
    code(必填) - 跨浏览器登录所需code 接口地址(/user/userCode,所需参数{v:1.0}) 
    fileType(必填) - 文档类型  .doc  .xls (word、excel、wps、ppt、金山表格、visio等格式)
    hostType(必填) - 开发环境（"develop":测试环境,"prerelease":预发布,"online":线上）
    useFor(必填) - 使用类型("esn"||"diwork") web_esn_new环境和diwork环境
    docFileName - 文档名 
    isNewCreated - 是否为新建(默认否) 
    showHistory - 是否显示历史版本(默认显示)  
```
###  跳转html格式
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="./jingeOffice.js"></script>
</head>

<body KGBrowser="友空间[专用];V5.0S0xGAAEAAAAAAAAAEAAAADgBAABAAQAALAAAAFQrGnSwm4qFu6rkNBXhTP69K4MP281M2xmioOYpSsf7FRvtIEBTLogvd4YXZpl3TamYF6ACBtQz1j7wa3KoL8WpvLo7xU8sPHaABsjcC0zDgJiNUPvKF034gUMs2wzBlJcOT7RCAv9XmMUpN8duKw7Ne5GBulAtkjXYyD/QCRk1rMJVkdCk6f6xBhiktkvHu2n07lhxOVh/gqMQwsNum+1/noqmCfMRmMaaZFF7OjmdQ5FF2fRvKIX8HSxu31K+h6ImJLCO91SWeX23RbUOKL6PB4/GIZ3hqV9j/WONbUvDlRY0Tha/pWrb2eMcYanDFYGvCWyQDbD47A1FC7c0pspr4h+13EPOy9/KbynS1M3HCG+RwX7iRNPwOGHKUDvNIEGnluT7YVUzDU6auNzeKPbjaq+39M/NPMSOBZka/YU2cWZiTjTmyZUc4asXw9ExlA=="
    style="overflow-y:hidden;margin:0;padding:0;overflow-x:hidden">
    
</body>

</html>
```
```sh
body标签必写标识 ：KGBrowser="友空间[专用];V5.0S0xGAAEAAAAAAAAAEAAAADgBAABAAQAALAAAAFQrGnSwm4qFu6rkNBXhTP69K4MP281M2xmioOYpSsf7FRvtIEBTLogvd4YXZpl3TamYF6ACBtQz1j7wa3KoL8WpvLo7xU8sPHaABsjcC0zDgJiNUPvKF034gUMs2wzBlJcOT7RCAv9XmMUpN8duKw7Ne5GBulAtkjXYyD/QCRk1rMJVkdCk6f6xBhiktkvHu2n07lhxOVh/gqMQwsNum+1/noqmCfMRmMaaZFF7OjmdQ5FF2fRvKIX8HSxu31K+h6ImJLCO91SWeX23RbUOKL6PB4/GIZ3hqV9j/WONbUvDlRY0Tha/pWrb2eMcYanDFYGvCWyQDbD47A1FC7c0pspr4h+13EPOy9/KbynS1M3HCG+RwX7iRNPwOGHKUDvNIEGnluT7YVUzDU6auNzeKPbjaq+39M/NPMSOBZka/YU2cWZiTjTmyZUc4asXw9ExlA=="
```
### 跳转html页面引用金格js下载地址
```sh
    https://static.yonyoucloud.com/3122184/5417/201903/1/15514092481J6f.js
```
