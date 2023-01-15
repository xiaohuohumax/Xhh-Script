## api rule

### pan json

[pan.json](./pan.json)

```json
[
  {
    // 接口名称
    "name": "name",
    // 接口网址 搜索关键字%info%
    "api": "https://www.***.com/search?q=%info%",
    // 提示信息 [可缺省,缺省与name相同]
    "title": "tip msg",
    // 排序下标越大越靠前 [可缺省,缺省为0]
    "index": 100
  }
]
```

### vip json

[vip.json](./vip.json)

```json
[
  {
    // 接口名称
    "name": "name",
    // 接口网址 网址替换关键字%url%
    "api": "https://www.***.com/search?q=%url%",
    // 提示信息 [可缺省,缺省与name相同]
    "title": "tip msg",
    // 排序下标越大越靠前 [可缺省,缺省为0]
    "index": 100
  }
]
```
