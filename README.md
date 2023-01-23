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

## 🔗 快速使用油猴调试

- 首先赋予油猴读取本地文件的权限
- 然后执行 npm run build 生成 [quick.test.js](./dist/quick.test.js)
- 新建一个油猴脚本, 用 [quick.test.js](./dist/quick.test.js) 替换原内容即可

  ```txt
  // 此 header 会自动本地加载打包完成的脚本
  // @require      file://.../xhh-script.js
  ```

### 📅 更新记录

[记录](./history.md)

### ⚙ 项目环境

vite + bootstrap + vue3 + pinia

### 🌳 项目文件结构说明

```text
Xhh-Script
 ├── build                        // 打包
 │   ├── load.config.js
 │   ├── load.header.js
 │   ├── plugins                  // vite 油猴插件
 │   ├── template
 │   └── utils.js
 ├── dist                         // 打包结果
 ├── global.config.js             // 全局配置
 ├── history.md
 ├── index.html
 ├── jsconfig.json
 ├── LICENSE
 ├── package-lock.json
 ├── package.json
 ├── README.md
 ├── src
 │   ├── apis                     // 接口集合
 │   ├── App.vue
 │   ├── components
 │   ├── config                   // 配置
 │   ├── define.element.js
 │   ├── exception
 │   ├── header                   // 油猴 header
 │   ├── load.style.js
 │   ├── main.js                  // 入口
 │   ├── model
 │   ├── module                   // 子模块
 │   ├── plugin
 │   ├── store                    // pinia 持久化仓库
 │   ├── style.css
 │   └── utils                    // 工具
 └── vite.config.js
```

### 💕 感谢

感谢各位 API 的制作者, 有了你们我才能快乐的玩耍 ♪(＾ ∀ ＾ ●)ﾉ
