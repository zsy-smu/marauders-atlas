# 活点地图 · Marauder’s Atlas

一张会显影的魔法地图，也是一本可以逐卷探索的霍格沃茨地方志。

用原生 HTML、CSS、JavaScript 和 SVG 制作：旧新闻纸、细密版画、游走的墨迹足迹，以及带原著线索的地点档案。无需框架、数据库、API 密钥或构建步骤。

![校域总览](docs/images/grounds.jpg)

## 可以探索什么

- **校域总览**：城堡、黑湖、禁林、海格的小屋、打人柳、温室、魁地奇球场与车站。
- **城堡楼层**：地下、地面层、一至七楼及塔楼，共10组导览平面。
- **霍格莫德**：蜂蜜公爵、三把扫帚、猪头酒吧、佐科、风雅牌、文人居、邮局等商店与村外地点。
- **50份地点档案**：地点细节、关联故事、年代说明及可点击的资料出处；包含分卷入口与跨图关联条目。
- **三个年代**：1976、1993—94、1998。密道会按相应历史背景显示说明。
- **交互**：拖动、滚轮缩放、双指缩放、跨卷搜索、足迹开关、密道开关、暂停与“恶作剧完毕”。

![霍格莫德街区](docs/images/hogsmeade.jpg)

## 本地运行

需要 Node.js 20 或更高版本。没有第三方依赖，**不用执行 npm install**。

```sh
git clone https://github.com/zsy-smu/marauders-atlas.git
cd marauders-atlas
npm start
```

打开终端显示的地址，默认是 `http://127.0.0.1:4173`。

也可以使用 Python：

```sh
python -m http.server 4173 --directory dist
```

检查脚本语法、地点数据、分图、本地素材、脚印动画及十组楼层的走廊余量：

```sh
npm run check
```

## 操作方式

| 操作 | 效果 |
| --- | --- |
| 点击封面誓词 | 唤醒墨迹，展开地图 |
| 顶部三个分卷签 | 切换校域、城堡和霍格莫德 |
| 点击建筑或左侧索引 | 定位并打开地点档案 |
| 搜索框 / `/` | 跨分卷搜索地点、人物线索或密道 |
| 拖动、滚轮、双指 | 漫游与缩放 |
| `+`、`-`、`0` | 放大、缩小、恢复全图 |
| `Esc` | 先关闭档案或侧栏，再收起地图 |

手机上通过纸面右下角的“目录”打开地点列表。地名与中文姓名按屏幕尺度保持可读；档案在下半屏展开，顶部“收起”按钮在滚动时保持可用。系统启用“减少动态效果”时，展开和墨迹动画会相应关闭。路线检查范围与手机调整见 [可读性与空间检查说明](docs/READABILITY-AND-ROUTES.md)。

<img src="docs/images/mobile.jpg" width="320" alt="手机竖屏预览">

## 内容依据与边界

地点信息优先参考七部小说、官方 HarryPotter.com / J.K. Rowling 文章；Harry Potter Lexicon 用于辅助核对章节。每份档案均有资料入口，详见 [内容与出处](docs/LORE.md)。

建筑造型、精确坐标、道路曲线和房间平面是本项目的插画重建，不能当作原著给定的统一测绘。人物足迹是对应年代的示意动画，不是情节的实时回放。

霍格莫德是补充探索分卷，不显示全村人物追踪。有求必应屋以图外札记表示；1998年的阿利安娜肖像通道不会出现在1993年的路径中。未详述的出校密道不编造出口。

## 项目结构

```text
dist/
  index.html              页面和界面结构
  styles.css              纸张、排版、动画与响应式布局
  refinements.css         纸纹和版画融合的细节样式
  app.js                  分卷、搜索、缩放、拖动、年代与档案
  data.js                 地点资料、来源、楼层和年代状态
  art.js                  SVG 楼层平面、热区与路线
  assets/                 纸张纹理、两张生成式版画和图标
scripts/
  serve.mjs               无依赖本地预览服务器
  check.mjs               源码与资源一致性检查
docs/
  LORE.md                 资料来源和内容边界
  ARTWORK.md              视觉素材与生成提示词
  images/                 实际页面截图
```

修改地点资料从 `dist/data.js` 开始。调整插画位置时，也要同步调整 `illustratedPositions` 和 `art.js` 中对应的路线；房间平面与家具在 `art.js` 中生成。

## 静态部署

将 `dist/` 作为网站根目录即可，路径均为相对路径，支持部署到子目录。仓库包含一个**仅手动触发**的 GitHub Pages 工作流：

1. 在仓库 **Settings → Pages** 中把 Source 设为 **GitHub Actions**。
2. 打开 **Actions → Deploy GitHub Pages → Run workflow**。
3. 等待工作流输出部署地址。

推送源码只会运行只读检查，不自动创建公开演示站点。部署流程参见 [GitHub 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 许可与致谢

程序代码与项目文档采用 [MIT License](LICENSE)。配套图像的生成方式、纸纹来源以及授权范围见 [素材与第三方说明](THIRD_PARTY_NOTICES.md) 和 [插画说明](docs/ARTWORK.md)。

这是一个非官方 Harry Potter 同人项目。Harry Potter、Hogwarts 及相关人物、名称和设定的权利属于其各自权利人；本项目的开源许可不授予这些既有权利，也不代表获得官方认可。
