# Xhh-Script

自用油猴脚本 /Shadow DOM/

### 🧰 功能

- 🎥 VIP 视频解析
- 🕸 网盘资源搜索

### 📖 使用

- 浏览器安装 🔗[油猴](https://www.tampermonkey.net/) 插件
- 油猴中新建脚本
- 使用项目打包完成的脚本 [xhh-script.js](./dist/xhh-script.js) 替换即可新油猴脚本内容
- 最后刷新网页即可

### 🔨 修改脚本配置

对照脚本 [xhh-script.js](./dist/xhh-script.js) 中配置的说明修改即可

```javascript
// 基础配置
// elementName         Shadow DOM 标签名称
// ...
window.base_config = {
  elementName: 'xhh-script',
  // ...
}
```

### 🧪 运行 & 修改 & 构建

- 克隆项目源码
- 安装依赖 & 运行调试

  ```shell
  npm i
  npm run dev
  ```

- 打包构建

  ```shell
  npm run build
  ```

### 📂 使用油猴调试

- 打包项目, 生成脚本 [xhh-script.js](./dist/xhh-script.js)
- 修改油猴插件允许读取本地文件
- 油猴新建脚本页
- 新建脚本并添加 header 指向打包完成脚本即可

  ```javascript
  // ==UserScript==
  // @name         测试
  // ...
  // @require      file://D:\Github\Xhh-Script\dist\xhh-script.js
  // ==/UserScript==
  ```

### ⚙ 项目环境

vite + bootstrap + vue3

### 🌳 项目文件结构说明

```text
Xhh-Script
 ├── build                      // 脚本构建插件
 │   ├── index.js
 │   └── plugins
 │       ├── format.js
 │       └── template.txt
 ├── dist                       // 油猴脚本
 │   └── xhh-script.js
 ├── global.config.js           // 全局配置
 ├── index.html
 ├── jsconfig.json
 ├── LICENSE
 ├── package-lock.json
 ├── package.json
 ├── README.md
 ├── src
 │   ├── apis                   // 模块 API
 │   │   ├── api.rule.md        // API 格式说明
 │   │   ├── pan.json
 │   │   └── vip.json
 │   ├── App.vue
 │   ├── components
 │   │   ├── EmojiIcon.vue
 │   │   └── ModuleCard.vue
 │   ├── config                 // 插件配置
 │   │   ├── base.config.js
 │   │   ├── pan.config.js
 │   │   └── vip.config.js
 │   ├── exception
 │   │   └── config.error.js
 │   ├── header                 // 油猴插件 header
 │   │   ├── headers.js
 │   │   └── headers.json
 │   ├── init.js
 │   ├── main.js
 │   ├── model
 │   │   └── config.loader.js
 │   ├── module                 // 子模块
 │   │   ├── PanModule.vue
 │   │   └── VipModule.vue
 │   └── utils                  // 辅助工具
 │       ├── load.config.js
 │       ├── load.header.js
 │       ├── load.style.js
 │       ├── logger.js
 │       ├── meta.env.js
 │       └── url.js
 └── vite.config.js
```

### 💕 感谢

感谢各位 API 的制作者, 有了你们我才能快乐的玩耍 ♪(＾ ∀ ＾ ●)ﾉ
