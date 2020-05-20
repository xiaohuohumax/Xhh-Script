// ==UserScript==
// @name            小火狐自用脚本/Shadow DOM/
// @namespace       http://tampermonkey.net/
// @version         2.0
// @description     其中包含:vip视频解析 pan资源搜索
// @author          xiaohuohu
// @match           *://**/*
// @note            2020.05.20-V1.0 2.添加视频脚本,资源脚本api初始筛选功能
// @note            2020.05.19-V1.0 1.添加历史记录功能,2.脚本升级为 shadow DOM结构,解决样式冲突问题
// @grant           GM_info
// @grant           GM_getValue
// @grant           GM_setValue
// ==/UserScript==
(() => {
    'use strict';
    /* ======================================================设置====================================================== */
    let setting = {
        /* 图标样式 */
        appScreen: 'left', // 脚本图标位置 left : 左侧 right : 右侧
        appTop: '3px', // 图标据顶部位置
        appLeftOrRight: '3px', // 图标据左边或右边的距离 依据 appScreen 而定
        appMargin: '3px', // 各个图标之间的间隔
        /* 记忆设置 */
        panChoHistory: true, // 是否打开 资源脚本 的选择历史(加载新页面时会自动使用上一个页面最后一次的选择)
        vipChoHistory: true, // 是否打开 视频脚本 的选择历史(加载新页面时会自动使用上一个页面最后一次的选择)
        /* 数量设置 */
        panShowMax: -1, // 资源脚本最大显示数量 <=0 无限制 >0 限制数量
        vipShowMax: -1, // 视频脚本显示最大数量 <=0 无限制 >0 限制数量
        /* 初始筛选 */
        panShowRe: '', // 资源脚本接口筛选 正则表达式 默认空着不过滤
        vipShowRe: '', // 视频脚本接口筛选 正则表达式 默认空着不过滤
        /* 日志颜色 */
        logInf: 'teal', // 正常提示颜色
        logErr: 'tomato', // 错误提示颜色
        logWar: 'plum', // 警告提示颜色
    }
    /* ======================================================/设置====================================================== */
    // 防止iframe嵌套加载脚本
    if (window.self != window.top) { return; }
    // 日志
    let log = {
        title: typeof (GM_info) == 'object' ? GM_info.script.name : '小火狐',
        inf: function (...infs) { console.log(`%c[${this.title}][提示]${infs.join('')}`, `color:${setting.logInf}`); },
        error: function (...err) { console.log(`%c[${this.title}][错误]${err.join('')}`, `color:${setting.logErr}`); },
        warning: function (...war) { console.log(`%c[${this.title}][警告]${war.join('')}`, `color:${setting.logWar}`); }
    }
    typeof (GM_setValue) != 'function' && typeof (GM_getValue) != 'function' && log.warning('此环境不支持存储数据到本地,请在油猴中使用.');
    // 存储数据到本地
    let dataBase = {
        setData: function (name, val) { typeof (GM_setValue) == 'function' && GM_setValue(name, val); },
        getData: function (name) { return typeof (GM_getValue) == 'function' ? GM_getValue(name) : undefined; }
    }
    try {
        class xhhScript extends HTMLElement {
            constructor() {
                super();
                /* 脚本配置区域 */
                this.appStyle = `<style> .app, .app * { box-sizing: border-box;}
                    .app { position: fixed; top: ${setting.appTop}; ${setting.appScreen}: ${setting.appLeftOrRight}; font-weight: bold; z-index: 99999; 
                        color: gray; font-size: 12px; font-family: "Microsoft YaHei","黑体","宋体",sans-serif;}
                    .appItem { position: relative; margin: ${setting.appMargin} 0;}
                    .appItem:first-child { margin-top: 0;}
                    .appItem:last-child { margin-bottom: 0;}
                    .appItemIcon { border: 2px solid teal; position: relative; z-index: 10; width: 20px; height: 20px; text-align: center;
                         line-height: 16px; border-radius: 50%; background: white; cursor: pointer;}
                    .appItemIcon:hover { color: tomato; transform: scale(1.1);}
                    .appItemBody { padding: 10px; position: absolute; top: 50%; ${setting.appScreen}: 50%; border-radius: 4px; 
                    display: none; z-index: 9; background: white; box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.4);}
                    .appItem:hover .appItemBody { display: block;}
                    .appItem:hover .appItemIcon { z-index: 12;}
                    .appItem:hover .appItemBody { z-index: 11;}
                    /* 通用样式 */
                    input[type="text"] { background: white; outline: none; border: 2px solid teal; padding: 3px 5px; 
                        border-radius: 4px; font-weight: bold; display: block; color: gray;}
                    .appScroll { overflow: hidden; border-radius: 4px;}
                    .appScrollBody { width: calc(100% + 17px); height: 100%; overflow-y: scroll;}</style>`;
                this.shadow = this.attachShadow({ mode: 'closed' }); // 创建影子树
                // 添加样式
                this.shadow.innerHTML = this.appStyle;
                this.init();
            }
            // 加入文档树是调用
            connectedCallback() {
                let that = this;
                // 模板
                // this.addScript({
                //     icon: 'V', // t图标字母
                //     html: ``, // 内容
                //     title: '', // 脚本描述
                //     css: ``, // 样式
                //     iconBg: '', // 图标颜色
                //     allowUrl: [], // 网址激活
                //     callBack: () => { } // 内容加载完成回调
                // })
                // PAN 脚本
                this.addScript({
                    icon: 'P',
                    iconBg: 'red',
                    title: '资源搜索',
                    html: `<div class="appPan">
                        <input class="appPanSure" type="text" placeholder="回车搜索-">
                        <div class="appPanFind">
                            <input class="appPanFindInput" type="text" placeholder="筛选-支持正则">
                            <div class="appPanFindSum"></div>
                        </div>
                        <div class="appScroll appPanListScroll">
                            <div class="appScrollBody appPanList">
                            </div>
                        </div>
                    </div>`,
                    css: `.appPan { /* border: 1px solid teal; */}
                        .appPanSure { margin-bottom: 5px;}
                        .appPanSure, .appPanFindInput { width: 100%;}
                        .appPanFind { position: relative; margin-bottom: 5px;}
                        .appPanFindSum { position: absolute; top: 50%; transform: translate(0, -50%); color: tomato; right: 5px;}
                        .appPanListScroll { width: 170px; height: 300px;}
                        .appPanListItem { display: flex; padding: 5px 10px; background: paleturquoise; margin: 3px 0; border-radius: 4px; 
                            position: relative; cursor: pointer;}
                        .appPanListItem:hover { background: palevioletred; color: white;}
                        .appPanListItem:hover .appPanLINum { color: teal;}
                        .appPanListItemCho::after { content: '#'; position: absolute; font-weight: bold; right: 8px; top: 50%; transform: translate(0, -50%); color: tomato;}
                        .appPanListItemCho:hover::after {color: white;}
                        .appPanLINum { color: tomato; margin-right: 3px;}
                        .appPanLINmae { font-size: 12px;}
                        .appPanLIKind { position: absolute; right: 20px; top: 50%; transform: translate(0, -50%);}`,
                    allowUrl: [
                        /.*/i // 全部
                    ],
                    callBack: () => {
                        var panApis = [
                            { from: "https://www.dashengpan.com/", name: "大圣盘", url: "https://www.dashengpan.com/search?keyword=%sv%", beeg: 1 },
                            { from: "https://dalipan.com/", name: "大力盘", url: "https://www.dalipan.com/search?keyword=%sv%", beeg: 1 },
                            { from: "https://www.xiaozhaolaila.com/", name: "小昭来啦", url: "https://www.xiaozhaolaila.com/s/search?q=%sv%", beeg: 1 },
                            { from: "https://www.yunpanjingling.com/", name: "云盘精灵", url: "https://www.yunpanjingling.com/search/%sv%", beeg: 1 },
                            { from: "https://www.xiaokesoso.com/", name: "小可搜搜", url: "https://www.xiaokesoso.com/s/search?q=%sv%", beeg: 2 },
                            { from: "http://www.panmeme.com/", name: "盘么么", url: "http://www.panmeme.com/query?key=%sv%", beeg: 2 },
                            { from: "http://www.xiaobaipan.com/", name: "小白盘", url: "http://www.xiaobaipan.com/list-%sv%.html", beeg: 2 },
                            { from: "http://www.rufengso.net/", name: "如风搜", url: "http://www.rufengso.net/s/name/%sv%", beeg: 2 },
                            { from: "http://www.slimego.cn/", name: "史莱姆", url: "http://www.slimego.cn/search.html?q=%sv%", beeg: 2 },
                            { from: "http://www.kengso.com/", name: "坑搜网", url: "http://www.kengso.com/s?wd=%sv%", beeg: 2 },
                            { from: "http://www.repanso.com", name: "热盘搜", url: "http://www.repanso.com/q?wd=%sv%", beeg: 2 },
                            { from: "http://www.shiyue.org/", name: "十月搜索", url: "http://www.shiyue.org/s/%sv%", beeg: 2 },
                            { from: "https://www.lzpan.com/", name: "懒盘", url: "https://www.lzpan.com/search/title?kw=%sv%", beeg: 2 },
                            { from: "http://wx.haogow.com/", name: "西部维度", url: "http://wx.haogow.com/so?keyword=%sv%", beeg: 2 },
                            { from: "http://wx.xingtuhua.com/", name: "商务中国", url: "http://wx.xingtuhua.com/so?keyword=%sv%", beeg: 2 },
                            { from: "http://www.vpansou.com/", name: "V盘搜", url: "http://www.vpansou.com/query?wd=%sv%", beeg: 2 },
                            { from: "http://aizhaomu.com/", name: "创业招", url: "http://aizhaomu.com/search/kw%sv%", beeg: 2 },
                            { from: "http://www.sodu123.com/", name: "搜度", url: "http://www.sodu123.com/sodu/so.php?q=%sv%", beeg: 2 },
                            //以下的更新慢
                            { from: "https://www.qzhou.com.cn/", name: "轻舟网", url: "https://www.qzhou.com.cn/search?keyword=%sv%", beeg: 3 },
                            { from: "http://www.59pan.com/", name: "59网盘", url: "http://www.59pan.com/search/%sv%/", beeg: 3 },
                            { from: "http://www.pansou.com/", name: "盘搜", url: "http://www.pansou.com/?q=%sv%", beeg: 3 },
                            { from: "https://www.fastsoso.cn/", name: "fastsoso", url: "https://www.fastsoso.cn/search?k=%sv%", beeg: 3 },
                            { from: "http://www.51sopan.cn/", name: "51搜盘", url: "http://www.51sopan.cn/s?wd=%sv%", beeg: 3 },
                            { from: "http://www.baiduyunsousou.com/", name: "暮无雪", url: "http://www.baiduyunsousou.com/search?kw=%sv%", beeg: 3 },
                            { from: "https://www.dupanbang.com/", name: "度盘帮", url: "https://www.dupanbang.com/q/%sv%", beeg: 3 },
                            { from: "http://www.xilinjie.com/", name: "西林街", url: "http://www.xilinjie.com/s?q=%sv%&t=pan", beeg: 3 },
                            { from: "http://www.vpanso.com/", name: "微盘搜", url: "http://www.vpanso.com/s?wd=%sv%", beeg: 3 },
                            { from: "https://www.xxhh360.com/", name: "云搜大师", url: "https://www.xxhh360.com/search?q=%sv%", beeg: 3 },
                            { from: "https://www.esopan.com/", name: "易搜盘", url: "https://www.esopan.com/share/kw%sv%", beeg: 3 },
                            { from: "http://www.panpanso.com/", name: "盘盘搜", url: "http://www.panpanso.com/baiduwp?qiehuan=1&sousuo=%sv%", beeg: 3 },
                            { from: "http://www.lsdy8.com/bdpan.php", name: "猎手电影", url: "http://www.lsdy8.com/bdpan.php?sousuo=%sv%", beeg: 3 },
                            { from: "https://jidanso.com/", name: "网盘传奇", url: "https://www.jidanso.com/index.php/search/?q=%sv%", beeg: 3 },
                            { from: "https://pan.here325.com/", name: "325搜", url: "https://pan.here325.com/s?q=%sv%", beeg: 3 },
                            { from: "http://chawangpan.com/", name: "盘搜大师", url: "http://chawangpan.com/paymentList.html?field=%sv%&pgtype=search&pg=1&type=1&btn=1&flag=1&ctype=1", beeg: 3 },
                            { from: "http://www.jisoupan.com/", name: "及搜盘", url: "http://www.jisoupan.com/search/%sv%.html", beeg: 3 },
                            { from: "http://www.jisoupan.com/", name: "多多下载", url: "http://www.jisoupan.com/search/%sv%.html", beeg: 3 },
                            { from: "http://www.sowangpan.com/", name: "搜网盘", url: "http://www.sowangpan.com/search/%sv%-0-全部-0.html", beeg: 3 },
                            { from: "https://www.soohub.com/", name: "soohub", url: "https://www.soohub.com/search/%sv%/1", beeg: 3 },
                            { from: "http://www.xxdown.cn/", name: "西西", url: "http://www.xxdown.cn/e/action/ListInfo.php?title=%sv%&mid=1&tempid=10&ph=1", beeg: 3 },
                            { from: "http://www.99baiduyun.com/", name: "99搜索", url: "http://www.99baiduyun.com/baidu/%sv%", beeg: 3 },
                            //以下是搜书的
                            { from: "http://mebook.cc/", name: "小书屋", url: "http://mebook.cc/?s=%sv%", beeg: 9 },
                            { from: "http://www.ireadweek.com/index.php", name: "周读", url: "http://www.ireadweek.com/index.php?g=portal&m=search&a=index&keyword=%sv%", beeg: 9 },
                            { from: "http://ibooks.org.cn/", name: "读书小站", url: "http://ibooks.org.cn/?s=下载 %sv%", beeg: 9 },
                            { from: "https://sobooks.cc/", name: "sobooks", url: "https://sobooks.cc/search/%sv%", beeg: 9 },
                            { from: "http://neikuw.com/", name: "内酷网", url: "http://neikuw.com/?s=%sv%", beeg: 9 },
                            { from: "https://www.xssousou.com/", name: "小说搜搜", url: "https://www.xssousou.com/s/%sv%.html://neikuw.com/?s=%sv%", beeg: 9 },
                            { from: "http://www.tushupan.com", name: "图书盘", url: "http://www.tushupan.com/search?query=%sv%", beeg: 9 },
                        ];
                        // 限制数量
                        panApis = setting.panShowMax > 0 ? panApis.slice(0, setting.panShowMax) : panApis;
                        // 内容过滤
                        panApis = that.apiFilter(panApis, setting.panShowRe, true);
                        let appPanList = that.q('.appPanList');
                        if (panApis.length <= 0) {
                            appPanList.innerHTML = "<div class='appPanListItem'>你都过滤完了,木有啦~~~</div>";
                            return;
                        }
                        // 添加编号
                        panApis.map((val, index) => {
                            val.number = index;
                            return val;
                        });
                        let appPanFindSum = that.q('.appPanFindSum');
                        let appPanSure = that.q('.appPanSure');
                        let appPanFindInput = that.q('.appPanFindInput');
                        // 当前选中: 从本地获取 或 默认初始选中0号
                        let nowCho = setting.panChoHistory && dataBase.getData('pan-panCho') ? JSON.parse(dataBase.getData('pan-panCho')) : panApis[0];
                        function addItem(re = '') {
                            // 删除所有子元素
                            that.removeChild(appPanList);
                            // 设置提示
                            appPanSure.setAttribute('placeholder', `回车搜索-${nowCho.name}`);
                            // 匹配过滤
                            let matchArray = that.apiFilter(panApis, re);
                            // 设置提示长度
                            appPanFindSum.innerHTML = matchArray.length;
                            if (matchArray.length == 0) {
                                appPanList.innerHTML = "<div class='appPanListItem'>木有结果~~~</div>";
                            } else {
                                // 生成对象
                                matchArray.forEach((val, index) => {
                                    let appPanListItem = that.c('div');
                                    appPanListItem.className = 'appPanListItem';
                                    // 是否被选中
                                    nowCho.number == val.number ? appPanListItem.classList.add('appPanListItemCho') : '';
                                    // 添加title
                                    appPanListItem.title = val.from;
                                    appPanListItem.innerHTML = `<div class="appPanLINum">${index + 1}</div>
                                        <div class="appPanLINmae">${val.name}</div>
                                        <div class="appPanLIKind">${val.beeg}</div>`;
                                    appPanList.append(appPanListItem);
                                    // 添加点击事件
                                    appPanListItem.addEventListener('click', () => {
                                        nowCho = val;
                                        // 修改选中标识
                                        that.q('.appPanListItemCho') && that.q('.appPanListItemCho').classList.remove('appPanListItemCho');
                                        appPanListItem.classList.add('appPanListItemCho');
                                        appPanSure.setAttribute('placeholder', `回车搜索-${nowCho.name}`);
                                        // 添加记录到本地
                                        setting.panChoHistory && dataBase.setData('pan-panCho', JSON.stringify(val));
                                    })
                                })
                            }
                        }
                        addItem();

                        // 输入监视
                        appPanFindInput.addEventListener('input', () => {
                            addItem(appPanFindInput.value);
                        });
                        appPanSure.addEventListener('keydown', (event) => {
                            var e = event || window.event;
                            // 按 Eenter
                            if (e && e.keyCode == 13) {
                                if (appPanSure.value.trim()) {
                                    that.changeUrl(nowCho.url.replace('%sv%', appPanSure.value));
                                }
                            }
                        })
                    }
                })
                // VIP 脚本
                this.addScript({
                    icon: 'V',
                    iconBg: 'green',
                    title: '视频解析',
                    html: `<div class="appVip">
                            <div class="appVipFind">
                                <input class="appVipFindInput" type="text" placeholder="筛选-支持正则" />
                                <div class="appVipFindSum"></div>
                            </div>
                            <div class="appScroll appVipListScroll">
                                <div class="appScrollBody appVipList">
                                </div>
                            </div>
                        </div>`,
                    css: `.appVip {}
                        .appVipFind { margin-bottom: 5px; position: relative;}
                        .appVipFindInput { width: 100%;}
                        .appVipFindSum{ position: absolute; top: 50%; right: 10px; transform: translate(0, -50%); color: tomato; }
                        .appVipListScroll{ width: 170px; height: 300px;}
                        .appVipItem { display: flex; background: paleturquoise; padding: 5px 10px; border-radius: 4px; cursor: pointer; position: relative; margin: 3px 0;}
                        .appVipItem:hover { background: palevioletred; color: white;}
                        .appVipItem:hover .appVipItemNum { color: teal;}
                        .appVipItemNum { margin-right: 3px; color: tomato;}
                        .appVipItemCho::after { content: '#'; position: absolute; font-weight: bold; right: 8px; top: 50%; transform: translate(0, -50%); color: tomato;}
                        .appVipItemCho:hover::after {color: white;}
                        .appVipNmae { font-size: 12px;}`,
                    allowUrl: [
                        /^\w+\:\/\/\w+\.iqiyi\.com/i,// 爱奇艺
                        /^\w+\:\/\/\w+\.youku\.com/i,// 优酷
                        /^\w+\:\/\/\w+\.le\.com/i,// 乐视
                        /^\w+\:\/\/\w+\.letv\.com/i,// 乐视
                        /^\w+\:\/\/v\.qq\.com/i,// 腾讯
                        /^\w+\:\/\/\w+\.tudou\.com/i,// 土豆
                        /^\w+\:\/\/\w+\.mgtv\.com/i,// 芒果
                        /^\w+\:\/\/film\.sohu\.com/i,// 搜狐
                        /^\w+\:\/\/tv\.sohu\.com/i,// 搜狐
                        /^\w+\:\/\/\w+\.acfun\.cn\/v/i,// acfun
                        /^\w+\:\/\/\w+\.bilibili\.com/i,// bilibili
                        /^\w+\:\/\/vip\.1905\.com\/play/i,// 1905电影网
                        /^\w+\:\/\/\w+\.pptv\.com/i,// pp视频
                        /^\w+\:\/\/v\.yinyuetai\.com\/video/i,// 音悦台
                        /^\w+\:\/\/v\.yinyuetai\.com\/playlist/i,// 音悦台
                        /^\w+\:\/\/\.fun\.tv\/vplay/i,// 风行视频
                        /^\w+\:\/\/\w+\.wasu\.cn\/Play\/show/i,// 华数
                        /^\w+\:\/\/\w+\.56\.com/i// 我乐视频
                    ],
                    callBack: () => {
                        let urlApis = [
                            { name: "玩的嗨", url: "http://tv.wandhi.com/go.html?url=", title: "综合接口，一键VIP 更新可用【作者mark zhang】脚本的接口" },
                            { name: "石头解析", url: "https://jiexi.071811.cc/jx.php?url=", title: "手动点播放" },
                            { name: "无名小站", url: "http://www.sfsft.com/admin.php?url=", title: "无名小站同源" },
                            { name: "无名小站", url: "http://www.82190555.com/video.php?url=", title: "综合线路" },
                            { name: "无名小站2", url: "http://www.wmxz.wang/video.php?url=", title: "转圈圈就换线路" },
                            { name: "163人", url: "http://jx.api.163ren.com/vod.php?url=", title: "偶尔支持腾讯" },
                            { name: "8090g", url: "http://api.oopw.top/jiexi/?url=", title: "8090g全网视频解析" },
                            { name: "人人发布", url: "http://v.renrenfabu.com/jiexi.php?url=", title: "综合，多线路" },
                            { name: "盘古解析", url: "http://607p.com/?url=", title: "综盘古解析" },
                            { name: "思古解析", url: "http://bofang.online/?url=", title: "思古解析" },
                            { name: "穷二代解析", url: "http://api.baiyug.vip/?url=", title: "穷二代解析" },
                            { name: "囧妈", url: "https://z1.m1907.cn/?jx=", title: "囧妈" },
                            { name: "爱奇艺优酷", url: "https://jiexi.071811.cc/jx2.php?url=", title: "爱奇艺 优酷(第一源)" },
                            { name: "OK解析", url: "https://okjx.cc/?url=", title: "B站(第一源)" },
                            { name: "黑云解析", url: "https://jiexi.380k.com/?url=", title: "B站(第二源)" },
                            { name: "BL解析", url: "https://vip.bljiex.com/?v=", title: "全站" },
                            { name: "HK解析", url: "https://jx.rdhk.net/?v=", title: "芒果" },
                            { name: "初心解析", url: "http://jx.bwcxy.com/?v=", title: "初心解析" },
                            { name: "星空解析", url: "https://jx.fo97.cn/?url=", title: "星空解析" },
                            { name: "全网vip", url: "https://play.fo97.cn/?url=", title: "全网vip" },
                            { name: "360dy解析", url: "http://yun.360dy.wang/jx.php?url=", title: "360dy解析" },
                            { name: "小蒋极致", url: "https://www.kpezp.cn/jlexi.php?url=", title: "小蒋极致" },
                            { name: "维多解析", url: "https://jx.ivito.cn/?url=", title: "维多解析（超清）" },
                            { name: "云梦2", url: "http://app.hoptc.cn/dyjx.php?url=", title: "云梦2" },
                            { name: "tv920解析", url: "https://api.tv920.com/vip/?url=", title: "tv920解析" },
                            { name: "89免费解析", url: "http://www.ka61b.cn/jx.php?url=", title: "89免费解析" },
                            // { name: "下视", url: "http://www.xiashipin.net/?url=", title: "下视?" },
                            // { name: "智库解析", url: "http://www.guandianzhiku.com/v/s/?url=", title: "智库解析" },
                            { name: "逆天解析", url: "http://nitian9.com/?url=", title: "逆天解析" },
                            // { name: "羊分", url: "http://buchi.me/?v=", title: "羊分?" },
                            // { name: "爱分", url: "http://api.iifen.top/?v=", title: "爱分?" },
                            { name: "XyPlayer解析", url: "http://jx.xyplay.vip/?url=", title: "XyPlayer解析" },
                            // { name: "豪华", url: "http://api.lhh.la/vip/?url=", title: "豪华?" },
                            { name: "40解析", url: "https://jx40.net/url=", title: "40解析" },
                            // { name: "无名影视", url: "http://api.51ds.shop/jx/?url=", title: "无名影视" },
                            // { name: "宿命解析", url: "http://api.sumingys.com/index.php?url=", title: "宿命解析" },
                            // { name: "ZLVIP", url: "https://vip.zlkkk.shop/2019/?url=", title: "ZLVIP" },
                            { name: "8B解析", url: "http://api.8bjx.cn/?url=", title: "8B解析" },
                            // { name: "千忆解析", url: "https://v.qianyicp.com/v.php?url=", title: "千忆解析" },
                            // { name: "梦城", url: "https://mcncn.cn/?url=", title: "梦城" },
                            { name: "41解析", url: "https://jx.f41.cc/?url=", title: "114解析" },
                            { name: "ckmov解析", url: "https://www.ckmov.vip/api.php?url=", title: "解析系统" },
                            { name: "超清干货", url: "http://k8aa.com/jx/index.php?url=", title: "超清干货" },
                            // { name: "七星解析1", url: "http://api.greatchina56.com/?url=", title: "七星解析1" },
                            // { name: "熊猫解析", url: "http://111ys.cn/111/?url=", title: "熊猫解析" },
                            { name: "穷二", url: "http://jx.ejiafarm.com/x/jiexi.php?url=", title: "穷二" },
                            { name: "517解析", url: "http://cn.bjbanshan.cn/jx.php?url=", title: "517解析" },
                            // { name: "千亿", url: "https://v.qianyicp.com/v.php?url=", title: "千亿" },
                            // { name: "小视", url: "http://www.xiashipin.net/?url=", title: "小视?" },
                            // { name: "52解析", url: "http://apk.528kan.cn/index.php?url=", title: "52解析" },
                            { name: "丸酷云解析", url: "https://wq66.cn/?url=", title: "丸酷解析" },
                            { name: "智能解析", url: "https://jx.qppyy.com/jx/?url=", title: "智能解析" },
                            { name: "618", url: "http://jx.618ge.com/?url=", title: "618?" },
                            { name: "凉城解析", url: "http://jx.mw0.cc/?url=", title: "凉城解析" },
                            { name: "解析", url: "http://69p.top/?url=", title: "解析" },
                            { name: "播大", url: "https://vip.bddjx.com/?url=", title: "播大" },
                            { name: "爸比解析", url: "http://www.33tn.cn/?url=", title: "爸比解析" },
                            { name: "大亨解析", url: "http://jx.cesms.cn/?url=", title: "大亨解析" },
                            { name: "赵先", url: "https://jx.zhaodh.top/?v=", title: "赵先" },
                            { name: "宏伟解析", url: "http://www.cqhwdnwx.com/jx/?url=", title: "宏伟解析" },
                            { name: "地久天长", url: "http://www.lexiangsj.xyz/?v=", title: "地久天长" },
                            { name: "47解析", url: "http://jx.nxnns47.cf/?v=", title: "47解析" },
                            { name: "1ff1解析", url: "http://jx.1ff1.cn/?url=", title: "1ff1解析" },
                            { name: "116kan", url: "http://vip.116kan.com/?url=", title: "116kan" },
                            { name: "弦易", url: "http://jx.hongyishuzhai.com/index.php?url=", title: "弦易" },
                            { name: "55解析", url: "http://55jx.top/?url=", title: "55解析" },
                            { name: "00180", url: " https://jx.000180.top/jx/?url=", title: "00180" },
                            { name: "七星", url: "http://qx.c7776.com/v3/?v=", title: "七星" },
                            { name: "128解析", url: "https://jx.128sp.com/jxjx/?url=", title: "128解析" },
                            { name: "19解析", url: "http://19g.top/?url=", title: "19解析" },
                            { name: "无极", url: "http://jx.6666txt.com/?url=", title: "无极" },
                            { name: "云易1", url: "http://app.baiyug.cn:2019/vip/?url=", title: "云易1" },
                            { name: "云易2", url: "https://vip.bddjx.com/?url=", title: "云易2" },
                            { name: "秒播解析", url: "http://www.cuan.la/?url=", title: "秒播解析" },
                            { name: "265解析", url: "https://vod.265ks.com/vod/index.php?url=", title: "265解析" },
                            { name: "1969解析", url: "http://ys.1969com.cn/?url=", title: "1969解析" },
                            { name: "优奇高速稳", url: "https://jx.youqi.tw/v.php?url=", title: "优奇高速稳" },
                            // { name: "云解", url: "https://api.3456yun.com/?url=", title: "云解" },
                            { name: "热点解析", url: "http://jx.rdhk.net/?v=", title: "热点解析" },
                            { name: "ha12解析", url: "http://py.ha12.xyz/sos/index.php?url=", title: "ha12解析" },
                            { name: "9酷解析", url: "https://jx.9ku.wang/9ku/?url=", title: "9酷解" },
                            { name: "冰河解析", url: "http://jx.duzhiqiang.com/?url=", title: "冰河解析" },
                            { name: "智能解析", url: "https://lany.lzure.kim/?v=", title: "智能解析" },
                            { name: "狸猫解析", url: "http://111jx.xyz/?url=", title: "狸猫解析" },
                            { name: "云解析", url: "http://gege.ha123.club/gege1234/index.php?url=", title: "云解?" },
                            { name: "清风明月", url: "http://fateg.xyz/?url=", title: "清风明月" },
                            { name: "花语有你", url: "http://api.huahuay.com/?url=", title: " 花语有你" },
                            { name: "无名小站", url: "http://www.85105052.com/admin.php?url=", title: "综合线路" },
                            // { name: "综合线路", url: "https://yun.odflv.com/?url=", title: "综合线路?(不太稳定)" },
                            { name: "综合线路", url: "http://jx.598110.com/duo/index.php?url=", title: "综合线路" },
                            { name: "综合线路", url: "http://jx.598110.com/index.php?url=", title: "综合线路" },
                            { name: "优酷 稳定", url: "http://le.206dy.com/vip.php?url=", title: "优酷 稳定" },
                            { name: "腾讯爱奇艺优酷", url: "http://api.hlglwl.com/jx.php?url=", title: "腾讯爱奇优酷" },
                            { name: "通用vip接口3", url: "http://www.1717yun.com/jx/ty.php?url=", title: "通用vip接口3" },
                            { name: "玩的嗨接口:42", url: "https://jx.128sp.com/jxjx/?url=", title: "玩的嗨接口:42" },
                            // 未测试接口
                            { name: "17云", url: "https://www.1717yun.com/jx/ty.php?url=", title: "优酷、腾讯超清、速度较快" },
                            { name: "解析啦", url: "https://api.jiexi.la/?url=", title: "挺好的" },
                            { name: "花园影视", url: "http://j.zz22x.com/jx/?url=", title: "挺好的" },
                            { name: "乐乐云", url: "https://660e.com/?url=", title: "乐乐云" },
                            { name: "YunParse", url: "http://api.jx.bugxx.com/cfee/vod.php?url=", title: "偶尔支持腾讯" },
                            { name: "drgxj", url: "http://jx.drgxj.com/?url=", title: "1111" },
                            { name: "初心", url: "https://jx.bwcxy.com/?v=", title: "优酷" },
                            { name: "tt-hk", url: "https://hh.tt-hk.cn/jx.php?url=", title: "支持腾讯" },
                            { name: "Duplay解析", url: "http://jx.du2.cc/?url=", title: "速度较慢" },
                            { name: "无名小站", url: "https://www.administratorw.com/admin.php?url=", title: "速度较慢" },
                            { name: "jlsprh解析", url: "http://vip.jlsprh.com/?url=", title: "还行吧" },
                            { name: "初颜解析", url: "http://jx.wodym.cn/?url=", title: "初颜解析" },
                            { name: "知网解析", url: "http://www.xyyh.xyz/zwjx/?url=", title: "知网解析" },
                            { name: "云梦解析", url: "http://www.xuanbo.top/yjx/index.php?url=", title: "云梦解析" },
                            { name: "z8解析", url: "http://www.hoptc.cn/z8/?url=", title: "z8解析" },
                            { name: "116kan", url: "http://vip.116kan.com/?url=", title: "116kan" },
                            { name: "弦易阁", url: "http://jx.hongyishuzhai.com/index.php?url=", title: "弦易阁" },
                            { name: "55解析", url: "http://55jx.top/?url=", title: "55解析" },
                            { name: "00180", url: " https://jx.000180.top/jx/?url=", title: "00180" },
                            { name: "七星", url: "http://qx.c7776.com/v3/?v=", title: "七星" },
                            { name: "128解析", url: "https://jx.128sp.com/jxjx/?url=", title: "128解析" },
                            { name: "19解析", url: "http://19g.top/?url=", title: "19解析" },
                            { name: "云易1", url: "http://app.baiyug.cn:2019/vip/?url=", title: "云易1" },
                            { name: "云易2", url: "https://vip.bddjx.com/?url=", title: "云易2" },
                            { name: "秒播解析", url: "http://www.cuan.la/?url=", title: "秒播解析" },
                            { name: "265解析", url: "https://vod.265ks.com/vod/index.php?url=", title: "265解析" },
                            { name: "优奇高速稳定", url: "http://ys.1969com.cn/?url=", title: "1969解析" },
                            { name: "1969解析", url: "https://jx.youqi.tw/v.php?url=", title: "优奇高速稳定" },
                            { name: "云解析", url: "https://api.3456yun.com/?url=", title: "云解析" },
                            { name: "热点解析", url: "http://jx.rdhk.net/?v=", title: "热点解析" },
                            { name: "ha12解析", url: "http://py.ha12.xyz/sos/index.php?url=", title: "ha12解析" },
                            { name: "9酷解析", url: "https://jx.9ku.wang/9ku/?url=", title: "9酷解析" },
                            { name: "冰河解析", url: "http://jx.duzhiqiang.com/?url=", title: "冰河解析" },
                            { name: "智能解析", url: "https://lany.lzure.kim/?v=", title: "智能解析" },
                            { name: "狸猫解析", url: "http://111jx.xyz/?url=", title: "狸猫解析" },
                            { name: "综合线路", url: "https://yun.odflv.com/?url=", title: "综合线路(不太稳定)" },
                            { name: "全网二", url: "http://jx.zzit.cc/tv.php?url=", title: "全网二 稳定性未知" },
                            { name: "腾讯", url: "http://jx.598110.com/index.php?url=", title: "腾讯 别的不能用时用" },
                            { name: "优酷稳定", url: "http://le.206dy.com/vip.php?url=", title: "优酷 稳定" },
                            { name: "腾讯爱奇艺优酷", url: "http://api.hlglwl.com/jx.php?url=", title: "腾讯 ☆ 爱奇艺 √ 优酷" },
                            { name: "通用vip接口3", url: "http://www.1717yun.com/jx/ty.php?url=", title: "通用vip接口3" },
                            { name: "47解析", url: "http://jx.nxnns47.cf/?v=", title: "47解析" },
                            { name: "1ff1解析", url: "http://jx.1ff1.cn/?url=", title: "1ff1解析" },
                            { name: "云解析", url: "http://gege.ha123.club/gege1234/index.php?url=", title: "云解析" },
                            { name: "清风明月", url: "http://fateg.xyz/?url=", title: "清风明月" },
                            { name: "花语有你", url: "http://api.huahuay.com/?url=", title: "花语有你" },
                            { name: "综合线路", url: "http://www.85105052.com/admin.php?url=", title: "综合线路" },
                        ];
                        // 限制数量
                        urlApis = setting.vipShowMax > 0 ? urlApis.slice(0, setting.vipShowMax) : urlApis;
                        urlApis = that.apiFilter(urlApis, setting.vipShowRe, true);
                        let appVipList = that.q('.appVipList');
                        if (urlApis.length <= 0) {
                            appVipList.innerHTML = "<div class='appVipItem'>你都过滤完了,木有啦~~~</div>";
                            return;
                        }
                        // 添加编号
                        urlApis.map((val, index) => {
                            val.number = index;
                            return val;
                        })
                        let appVipFindSum = that.q('.appVipFindSum');
                        let appVipFindInput = that.q('.appVipFindInput');
                        // 当前选中: 从本地获取 或 默认初始选中0号
                        let nowCho = setting.vipChoHistory && dataBase.getData('vip-vipCho') ? JSON.parse(dataBase.getData('vip-vipCho')) : urlApis[0];
                        function addItem(re = '') {
                            // 删除所有子元素
                            that.removeChild(appVipList);
                            // 匹配过滤
                            let matchArray = that.apiFilter(urlApis, re);
                            // 设置提示长度
                            appVipFindSum.innerHTML = matchArray.length;
                            if (matchArray.length == 0) {
                                appVipList.innerHTML = "<div class='appVipItem'>木有结果~~~</div>";
                            } else {
                                // 生成对象
                                matchArray.forEach((val, index) => {
                                    let appVipItem = that.c('div');
                                    appVipItem.className = 'appVipItem';
                                    // 是否被选中
                                    nowCho.number == val.number ? appVipItem.classList.add('appVipItemCho') : '';
                                    // 添加title
                                    appVipItem.title = val.name;
                                    appVipItem.innerHTML = ` <div class="appVipItemNum">${index + 1}</div>
                                        <div class="appVipNmae">${val.name}</div>`;
                                    appVipList.append(appVipItem);
                                    // 添加点击事件
                                    appVipItem.addEventListener('click', () => {
                                        nowCho = val;
                                        // 修改选中标识
                                        that.q('.appVipItemCho') && that.q('.appVipItemCho').classList.remove('appVipItemCho');
                                        appVipItem.classList.add('appVipItemCho');
                                        // 添加记录到本地
                                        setting.vipChoHistory && dataBase.setData('vip-vipCho', JSON.stringify(val));
                                        that.changeUrl(val.url + that.getThisUrl());
                                    })
                                })
                            }
                        }
                        addItem();
                        // 输入监视
                        appVipFindInput.addEventListener('input', () => {
                            addItem(appVipFindInput.value);
                        });
                    }
                })
            }
            init() {
                // 脚本最顶层标签
                this.app = this.c('div');
                this.app.className = 'app';
                this.shadow.append(this.app);
            }
            // 寻找单一标签
            q(name) {
                return this.app.querySelector(name);
            }
            // 寻找全部标签
            qa(name) {
                return this.app.querySelectorAll(name);
            }
            // 创建标签
            c(name) {
                return document.createElement(name);
            }
            removeChild(obj) {
                obj.innerHTML = '';
            }
            // 切换目标网址 打开方式 true 新窗口 false 当前窗口
            changeUrl(url, flag = true) {
                flag ? window.open(url) : window.location.assign(url);
            }
            // 获取当前url
            getThisUrl() {
                return window.location.href;
            }
            // 添加模块
            addScript({ icon = '', iconBg = 'teal', title = '', html = '', css = '', callBack = () => { }, allowUrl = [] }) {
                let flag = true;
                allowUrl.some((val) => {
                    try {
                        if (val.test(this.getThisUrl())) {
                            let appItem = this.c('div');
                            appItem.className = 'appItem';
                            appItem.innerHTML = `<style>${css}</style>
                                    <div class="appItemBody">${html}</div>
                                    <div class="appItemIcon" title="${title}" style="color:${iconBg}">${icon}</div>`;
                            this.app.append(appItem);
                            // 创建完回调
                            callBack();
                            flag = false;
                            log.inf(`${title}脚本 已加载成功`);
                            return true;
                        }
                    } catch (error) { }
                });
                flag && log.inf(`${title}脚本 已放弃加载`);
            }
            // api过滤
            apiFilter(apis, re, flag = false) {
                try {
                    let Reg = RegExp(re, 'g');
                    return apis.filter((val) => {
                        return Reg.test(val.name);
                    });
                } catch (error) {
                    log.warning(`正则表达式错误 ${error}`);
                    return flag ? apis : [];
                }
            }
        }
        customElements.define('xhh-script', xhhScript);
        window.onload = () => {
            let app = document.createElement('xhh-script');
            document.body.after(app);
            log.inf('脚本全部准备完成');
            log.inf('我的GITHUB: https://github.com/xiaohuohumax');
        }
    } catch (error) {
        log.error(`脚本发生意外错误,可以尝试刷新网页.\n详细详细:${error}`)
    }
})();