# TinyML Knowledge Hub｜TinyML 技術知識庫

AI 課程第九週 AGENTS.md 作業。以繁體中文整理 TinyML（微型機器學習）、On-device Learning（裝置端學習）與 Intermittent Computing（間歇運算），讓學生與 MCU 開發初學者可以搜尋、閱讀並持續擴充知識。

核心原則是「內容與版型分離」：文章放在獨立 JSON，清單由索引產生，所有文章共用同一個頁面模板。開發與維護規則請先閱讀 [AGENTS.md](./AGENTS.md)，原始規劃見 [PROJECT_PLAN.md](./PROJECT_PLAN.md)。

## 功能

- 首頁呈現知識地圖、索引文章總數、分類數及文章卡片。
- 依標題、摘要、標籤搜尋，不分英文大小寫；搜尋可與分類條件同時使用。
- 三個固定分類及「全部文章」，每個分類數量由索引計算。
- 無搜尋結果時提供說明與「清除所有篩選」。
- 共用文章頁包含麵包屑、程度、更新日期、四個標準章節、重點整理、參考資料與相關文章。
- 章節導覽可跳至內文章節；返回首頁保留搜尋與分類，點麵包屑分類則直接顯示該分類。
- 未知網址、找不到文章或 JSON 載入失敗時顯示錯誤頁；載入失敗可重試。
- 手機優先的響應式排版、鍵盤焦點、跳至主內容連結與搜尋結果狀態提示。

## 技術與目錄

原生 HTML5、CSS3、JavaScript 與 JSON，沒有建置步驟、CDN、第三方 JavaScript、後端、資料庫、登入或付費 API。網站使用系統字型，核心功能不需連接第三方服務；開啟參考資料時才會前往來源網站。需要支援 `fetch`、CSS Grid 與現代 JavaScript 的瀏覽器。

```text
.
├── AGENTS.md
├── PROJECT_PLAN.md
├── README.md
├── index.html
├── .nojekyll
├── assets/
│   ├── css/styles.css
│   └── js/app.js
└── data/topics/
    ├── index.json
    ├── tinyml-overview.json
    ├── mcu-resource-constraints.json
    ├── on-device-learning-overview.json
    ├── sparse-update.json
    ├── intermittent-computing-overview.json
    └── checkpointing-overview.json
```

`index.html` 只有共用入口與容器；`app.js` 負責讀取索引、搜尋、分類、hash routing、資料檢查及文章渲染；`styles.css` 定義全站設計變數與響應式規則。文章資料透過 DOM 文字節點與 `textContent` 渲染，不使用 `innerHTML` 插入文章內容。參考資料限制為 HTTPS，開啟新分頁使用 `noopener noreferrer`。

## 本機執行

在專案根目錄開啟終端機，使用 Python 3 啟動靜態 HTTP 伺服器：

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

若 Windows 上只有 Python Launcher，可改用：

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

用瀏覽器開啟 [本機首頁](http://127.0.0.1:8000/#/)，停止時在伺服器終端機按 `Ctrl+C`。若 8000 已被佔用，將指令與網址的埠號一起改成 8001。

**請勿直接以 `file://` 開啟 `index.html`。** 瀏覽器可能阻擋 JSON 的 `fetch()`；此時網站會顯示載入失敗提示。

## 初始文章與網址

以下路徑接在本機或 GitHub Pages 網址之後：

| 分類 | 文章 | hash 路徑 |
| --- | --- | --- |
| TinyML 基礎 | TinyML 是什麼？ | `#/topics/tinyml-overview` |
| TinyML 基礎 | MCU 記憶體與運算資源限制 | `#/topics/mcu-resource-constraints` |
| On-device Learning | On-device Learning 入門 | `#/topics/on-device-learning-overview` |
| On-device Learning | Sparse Update 的目的與運作 | `#/topics/sparse-update` |
| Intermittent Computing | Intermittent Computing 是什麼？ | `#/topics/intermittent-computing-overview` |
| Intermittent Computing | Checkpointing 與斷電恢復 | `#/topics/checkpointing-overview` |

文章包含定義與背景、核心原理、實際範例、適用情境與限制。教學情境與假設容量均有標示，不宣稱為論文實驗結果。更新日期為實際建立內容的日期 `2026-11-12`。

## 部署至 GitHub Pages

1. 建立 GitHub Repository，名稱可使用 `tinyml-knowledge-hub`。
2. 將本目錄的內容提交並推送至 `main` 分支的根目錄；保留 `.nojekyll`。`index.html` 必須直接位於根目錄。
3. 到 Repository 的 **Settings → Pages → Build and deployment**。
4. Source 選 **Deploy from a branch**，Branch 選 **main**，目錄選 **/(root)**，儲存。
5. 等待 Pages 部署成功，以 GitHub 顯示的網址為準。一般專案網址形式為 `https://<帳號>.github.io/tinyml-knowledge-hub/`。
6. 在公開網址實測首頁、搜尋、分類，以及六個 `#/topics/<slug>` 網址；直接貼上文章網址並重新整理，確認仍可讀取。

所有 CSS、JavaScript 與 JSON 路徑均相對於入口，例如 `./data/topics/index.json`，不依賴固定 Repository 名稱。hash 後的文章路徑不會作為伺服器檔案路徑送出，因此無須設定伺服器重寫或額外的 `404.html`。

本次工作目錄尚未建立 Git Repository，亦未設定 GitHub 遠端；目前沒有公開 Repository 或 Pages 網址。部署與公開環境驗收仍待完成。

## 新增文章：只動兩個 JSON 檔

1. 完整閱讀 `AGENTS.md` 與 `data/topics/index.json`，確認主題與 slug 未重複。
2. 選擇合法分類及程度，決定小寫 kebab-case slug。既有 slug 請保留。
3. 新增 `data/topics/<slug>.json`。使用 `AGENTS.md` 第 6 節格式；也可複製一篇既有 JSON 後替換內容，保留完整欄位。
4. 在 `data/topics/index.json` 的 `topics` 陣列加入一筆索引：

```json
{
  "slug": "model-quantization",
  "title": "Model Quantization（模型量化）",
  "category": "fundamentals",
  "summary": "認識模型量化的基本概念，以及精度與資源使用之間的取捨。",
  "level": "beginner",
  "tags": ["Quantization", "INT8", "TinyML"],
  "updatedAt": "2026-11-12"
}
```

以上是格式示範；實際新增時請將 `updatedAt` 改成內容真正更新的日期。本次先交付規劃的六篇文章，尚未新增這個示範主題。

每篇內容 JSON 必須包含：

| 欄位 | 要求 |
| --- | --- |
| `slug` | 與檔名及索引一致 |
| `overview` | 1–3 句導讀 |
| `sections` | 至少四個必要主題；每節含唯一 `id`、`heading`、`paragraphs`、`bullets`、`example` |
| `keyTakeaways` | 建議三項學習重點 |
| `references` | 至少一項可信來源，含 `title` 與 `https://` 網址 |
| `related` | 既有文章的 slug；不能連自己或不存在的文章 |

欄位不可省略；沒有項目的陣列填 `[]`，沒有示例填 `""`。JSON 不可包含 HTML、註解或結尾多餘逗號。

儲存後重新整理首頁，新卡片、數量、分類及搜尋結果會由索引自動更新，文章網址為 `#/topics/<slug>`。**不必修改 `index.html`、`app.js` 或 CSS，也不建立單篇 HTML。** 已開啟的頁面會快取索引及文章，修改 JSON 後需重新整理才能讀到更新。

可重複使用展示指令：

> 請先閱讀 AGENTS.md，再依照既有格式新增「Model Quantization（模型量化）」文章，分類為 fundamentals，並確保首頁搜尋、分類與文章連結都能使用。請列出實際修改的檔案與驗證結果。

展示時保留前後差異，確認只新增 `data/topics/model-quantization.json` 及修改 `data/topics/index.json`，再實測搜尋 `INT8`、切換 TinyML 基礎分類及開啟新文章。

## 參考來源

各篇文章尾端有對應來源；本知識庫使用下列官方專案與原始論文：

- [TensorFlow Lite for Microcontrollers](https://github.com/tensorflow/tflite-micro)
- [TFLM 官方記憶體管理文件](https://github.com/tensorflow/tflite-micro/blob/main/docs/memory_management.md)
- [TensorFlow Lite Micro: Embedded Machine Learning on TinyML Systems](https://arxiv.org/abs/2010.08678)
- [On-Device Training Under 256KB Memory](https://arxiv.org/abs/2206.15472)
- [MIT HAN Lab tiny-training](https://github.com/mit-han-lab/tiny-training)
- [Mementos 原始論文](https://web.eecs.umich.edu/~kevinfu/papers/ransford-mementos-asplos11.pdf)
- [DINO 原始論文](https://course.ece.cmu.edu/~ece742/S23/paper_pdfs/dino.pdf)
- [PyTorch：Activation Checkpointing 官方說明](https://docs.pytorch.org/docs/2.15/checkpoint.html)

## 驗證紀錄（2026-11-12）

- 已通過：7 個 JSON 解析、索引欄位、唯一 slug、檔名一致、合法分類與程度、相關文章完整性；六篇各有四個必要章節、三項重點及參考來源，無 HTML 內容。
- 已通過：`node --check assets/js/app.js`。
- 已通過：本機 HTTP 伺服器回傳首頁、CSS、JavaScript、索引與六個文章 JSON，共 10 個檔案的 HTTP 200。
- 已通過：10 組 jsdom DOM 整合測試，執行實際的 `app.js` 並透過本機 HTTP 讀取 JSON，驗證六張卡片與動態數量、標題／摘要／標籤搜尋、英文大小寫與空白處理、三種分類各 2 篇、搜尋與分類交集、空結果與清除篩選。
- 已通過：六篇文章從卡片開啟、以文章 hash 直接重新載入、四個內容章節、更新日期、參考資料連結屬性、章節按鈕、相關文章及返回首頁；另外驗證篩選保留、分類麵包屑、不存在與錯誤路由、HTTP 失敗與錯誤 JSON 後重試，以及快速切換路由。
- 已通過：以含 HTML 標記的測試字串確認文章仍以純文字顯示；以額外 JSON 測試資料模擬第七篇文章，確認不改模板即可新增卡片、數量、分類、搜尋與文章路由。測試資料未寫入正式文章，不等同已完成課程的第七篇實際新增展示。
- 已通過：主要文字、次要文字、主按鈕及三種分類色彩的靜態對比計算，六組對比均至少 4.86:1。這是色碼計算，並非瀏覽器畫面驗收。
- 已確認：8 個不同參考資料網址均可由網頁查閱工具讀取；尚未用本機瀏覽器逐一點擊。
- 尚待驗證：實際瀏覽器的視覺排版、鍵盤操作及 360px、768px、1280px 的橫向溢出檢查。此次瀏覽器自動化因無法可靠判讀目前網址而停止，未將這些項目記為通過。
- 尚待完成：GitHub Pages 部署與公開網址重新整理測試，以及課程的第七篇文章擴充展示。

人工驗收時請測試：搜尋 `mcu`、`SRAM` 及摘要詞彙；三種分類各應有 2 篇；搜尋不存在的字詞後清除條件；逐篇開啟、重新整理、使用章節導覽與返回首頁；開啟 `#/topics/not-found` 查看錯誤頁；在開發工具調整三種寬度，確認無橫向捲動且按鈕可操作。

DOM 測試使用的 jsdom 只安裝在系統暫存目錄，不屬於網站依賴，也未加入 Repository。jsdom 不執行真實排版，不能據此宣稱 RWD 或瀏覽器視覺測試通過。
