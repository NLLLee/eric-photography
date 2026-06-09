# 个人摄影作品集 · Photo Portfolio

基于 **Astro** 的极简暗色摄影作品集，数据驱动、图片自动优化，部署到 **Vercel**。
风格参考 [Magnum Photos](https://www.magnumphotos.com/)：照片为主角、大量留白、克制配色、移动优先。

## ✨ 功能

- **分类**：人像（毕业照 / 领证跟拍 / 创意人像）、风景、街道
- **首页**：全屏 hero 封面 + 个人定位文案 + 分类入口 + 精选
- **画廊**：瀑布流网格、点击灯箱放大（← / → 切换、`Esc` 关闭、移动端滑动）、图片懒加载、响应式
- **数据驱动**：所有照片信息集中在一个 `src/data/photos.json`，加照片只需改数据
- **图片优化**：Astro `<Image>` 自动生成响应式尺寸 + WebP；附带批量处理脚本（压缩 / 缩略图 + 大图 / 去 EXIF）
- **SEO / 性能**：每图 alt、OpenGraph、sitemap、`theme-color`、最小化 JS、懒加载

## 🚀 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 本地开发： http://localhost:4321
npm run build      # 生产构建到 dist/
npm run preview    # 本地预览构建结果
```

> 需要 Node 18+（已在 Node 26 上验证）。

## 🖼️ 添加照片（两种方式）

### 方式 A：用脚本批量处理（推荐）

1. 把原图（手机/相机直出，含 EXIF 的大图）丢进 `_incoming/`
2. 运行：
   ```bash
   npm run photos
   ```
   脚本会**自动旋转、去除 EXIF、压缩**，并生成两种尺寸：
   - 大图 → `src/photos/<名字>.jpg`
   - 缩略图 → `src/photos/thumbs/<名字>.jpg`
3. 脚本结束后会打印可直接粘贴的 JSON 片段，复制进 `src/data/photos.json` 并补全字段。

常用参数：

```bash
npm run photos -- --force                 # 强制重新处理
npm run photos -- --large 2400 --thumb 900 --quality 82
npm run photos -- --input ~/Desktop/raw   # 自定义输入目录
```

### 方式 B：手动放图

把已经压缩好的图片直接放到 `src/photos/`（可选：缩略图放 `src/photos/thumbs/`，同名），
然后在 `src/data/photos.json` 登记即可。Astro 会在构建时进一步生成响应式 WebP。

## 🗂️ 数据格式（`src/data/photos.json`）

```jsonc
{
  "file": "grad-01.jpg",      // src/photos/ 里的文件名（必填）
  "title": "盛夏的句点",       // 灯箱里的标题（可选）
  "alt": "学士服毕业生在...",  // 无障碍 alt 文本（必填）
  "category": "portraits",     // portraits | landscape | street
  "subtag": "graduation",      // 人像专用：graduation | marriage | creative
  "featured": true,            // 是否在首页精选出现
  "order": 1                   // 排序，越小越靠前（可选）
}
```

分类与子标签在 `src/lib/categories.ts` 定义，可自由增改（保持 slug 与 JSON 一致）。

## ⚙️ 个性化

- 名字 / 文案 / 邮箱 / 社交链接 / hero 封面文件名 → `src/lib/site.ts`
- 分类与子标签 → `src/lib/categories.ts`
- 配色 / 字体 / 间距 → `src/styles/global.css`（CSS 变量在 `:root`）
- 关于我文案 → `src/pages/about.astro`

## 📮 联系表单（Web3Forms）

表单使用 [Web3Forms](https://web3forms.com)（免费、无需后端）。

1. 去 web3forms.com 输入你的邮箱，拿到 **access key**
2. 复制 `.env.example` 为 `.env`，填入：
   ```
   PUBLIC_WEB3FORMS_ACCESS_KEY=你的key
   ```
3. 在 Vercel 项目里也添加同名环境变量。

## ▲ 部署到 Vercel

1. 把项目推到 GitHub
2. Vercel → New Project → 导入仓库（会自动识别为 Astro，无需额外配置）
3. 在 Settings → Environment Variables 添加：
   - `PUBLIC_WEB3FORMS_ACCESS_KEY`
   - `SITE_URL`（你的正式域名，用于 SEO / sitemap）
4. Deploy 🎉

> 部署后记得把 `astro.config.mjs` 里的 `SITE_URL` 默认值、`public/robots.txt`
> 里的 sitemap 地址改成你的真实域名。

## 📁 项目结构

```
photo-portfolio/
├── _incoming/                # 丢原图到这里，跑 npm run photos
├── public/                   # favicon、robots.txt 等静态资源
├── scripts/
│   └── process-photos.mjs    # 批量压缩 / 缩略图 / 去 EXIF
└── src/
    ├── data/photos.json      # ← 加照片只改这里
    ├── lib/                  # 配置 + 数据加载（site / categories / images / photos）
    ├── photos/               # 网站用的大图（+ thumbs/ 缩略图）
    ├── styles/global.css     # 设计 tokens + 基础样式
    ├── components/           # BaseHead / Header / Footer / MasonryGallery ...
    ├── layouts/BaseLayout.astro
    └── pages/                # 首页 / [category] / about / contact / 404
```
