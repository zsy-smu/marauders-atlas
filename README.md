![活点地图操作演示：墨迹显影、人物足迹与打人柳地点档案](docs/images/marauders-atlas-demo.gif)

# 活点地图 · Marauder’s Atlas

### [🗺️ 在线体验活点地图 →](https://zsy-smu.github.io/marauders-atlas/)

一张可以缩放、翻阅地点档案、观察人物脚印的霍格沃茨地图。中文界面，非官方同人项目，用原生 JavaScript 和 SVG 制作。

[English](README.en.md) · [下载源码](https://github.com/zsy-smu/marauders-atlas/archive/refs/heads/main.zip) · [本地运行](#本地运行)

[![Static checks](https://github.com/zsy-smu/marauders-atlas/actions/workflows/check.yml/badge.svg)](https://github.com/zsy-smu/marauders-atlas/actions/workflows/check.yml)

**三卷地图 / 50 份地点档案 / 10 组楼层 / 3 个年代**

在线版无需登录，也可以下载源码在本地运行。

## 可以怎么玩

打开封面，墨迹会逐渐显现。拖动、放大地图，点击建筑或目录里的地名，就能打开对应档案。校域、城堡、霍格莫德可以来回切换，密道两端的档案也能互相跳转。

有几处值得找找：

- **费尔奇也在。** 切到 1993—94 年的人物组，可以看到他的示意巡逻。名字向前走，已经落下的左右脚印留在原地，慢慢磨损、消失。暂停时，脚印也停止消退。
- **有求必应屋留了一个“？”** 档案说明了地图的盲区，不会显示屋内人物。
- **密道有年代差异。** 四楼镜后旧路在 1993—94 年标记为已坍塌；1976 年只作较早状态的推定，不当作通行事实。1998 年另有阿利安娜画像通道的补充记录。
- **独眼女巫能带你翻到蜂蜜公爵。** 从三楼打开地窖线索，可以切到霍格莫德档案，再从另一端返回。

这些人物路线是演示动画，不是原著事件的实时回放。霍格莫德目前以地点介绍为主，没有村内人物追踪。

## 地图里有什么

| 分卷 | 内容 |
| --- | --- |
| 校域 | 城堡、黑湖、禁林、打人柳、海格的小屋、温室、魁地奇球场、车站等，14 份档案 |
| 城堡 | 从地下到塔楼的 10 组楼层导览，24 份档案 |
| 霍格莫德 | 蜂蜜公爵、三把扫帚、猪头酒吧、羽毛笔店、邮局等，12 份档案 |

![霍格莫德地图](docs/images/hogsmeade.jpg)

城堡里，三楼和四楼已经单独设计了布局。三楼有雕像壁龛、陈列廊和挂毯线索；四楼有图书馆、阅览桌、禁书区与镜后旧路。其余八组仍使用共用导览布局，还没有逐层完成。

<table>
  <tr>
    <td width="50%"><img src="docs/images/third-floor.jpg" alt="三楼布局：雕像壁龛、陈列廊与挂毯捷径"><br>三楼：独眼女巫与挂毯线索</td>
    <td width="50%"><img src="docs/images/fourth-floor.jpg" alt="四楼布局：图书馆、禁书区与镜后旧路"><br>四楼：图书馆与镜后旧路</td>
  </tr>
</table>

手机上可以用目录找地点，档案从下方打开，文字单独滚动。下面是四楼年代对照的实际截图：

<p align="center"><img src="docs/images/fourth-floor-era.jpg" width="300" alt="手机端四楼镜后密道的年代对照"></p>

## 本地运行

安装 Node.js 20 或更新版本，然后运行：

```sh
git clone https://github.com/zsy-smu/marauders-atlas.git
cd marauders-atlas
npm start
```

不需要 `npm install`。打开终端给出的地址，默认是 `http://127.0.0.1:4173`，不需要账号、API 密钥或后端。

也可以下载上方的源码 ZIP，解压后在项目目录运行 `npm start`。如果已有 Python：

```sh
python -m http.server 4173 --directory dist
```

操作：拖动、滚轮或双指缩放；`/` 搜索；`+`、`-`、`0` 调整视野；`Esc` 关闭当前面板，没有面板时收起地图。页面提供足迹、密道和暂停开关，并适配系统的“减少动态效果”设置。

<details>
<summary>源码、检查与部署</summary>

```text
dist/
  index.html                    页面结构
  styles.css / refinements.css  纸张、排版、动画与移动端样式
  data.js                       地点、来源、年代与关联线索
  art.js                        SVG 平面、家具、热区与路线
  app.js                        地图交互、搜索、档案与动画
  assets/                       纸纹、插画与图标
scripts/                        本地预览与检查脚本
docs/                           制作记录、资料依据与截图
```

运行检查：

```sh
npm run check
```

检查覆盖脚本、档案、资源、动画与路线。目前路线检查包含 10 组楼层 × 3 个年代，采样 92,475 个路径位置并检查双脚余量。它验证项目内部的一致性，不证明原著空间准确，也不替代真实设备测试。

部署时将 `dist/` 作为静态站点根目录。仓库已附手动触发的 Pages 工作流：Settings → Pages 选择 GitHub Actions，再运行 Actions → Deploy GitHub Pages。工作流会上传 `dist/`；推送源码不会自动发布站点。GitHub 的分支部署只能选根目录或 `/docs`，不能直接选 `/dist`。见[官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

</details>

## 许可

代码与项目文档采用 [MIT License](LICENSE)。素材来源、参考项目与插画说明见 [第三方说明](THIRD_PARTY_NOTICES.md)及[插画记录](docs/ARTWORK.md)。

这是非官方《哈利·波特》同人项目，未获官方认可或背书。相关人物、名称和设定属于各自权利人；代码的开源许可不授予这些既有权利。
