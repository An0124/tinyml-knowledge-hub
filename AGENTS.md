# AGENTS.md — TinyML 技術知識庫（TinyML Knowledge Hub）

> 本文件是本專案的開發規範。AI 助手在新增、修改、刪除任何內容前，必須先閱讀本文件。若使用者的新需求與本文衝突，先指出衝突，並依使用者明確指定的修改方向同步更新本規範。

## 1. 專案目的與使用對象

- 專案名稱：TinyML 技術知識庫（TinyML Knowledge Hub）。
- 目標：以易懂、可查詢、可持續擴充的方式，整理 TinyML、On-device Learning 與 Intermittent Computing 技術知識。
- 主要讀者：初次接觸 TinyML 的學生、MCU 開發初學者，以及想快速複習技術概念的研究生。
- 核心理念：**一次建立版型與規則，日後新增文章只需新增內容資料，不應重寫網站。**
- 內容語言：繁體中文（臺灣用語）；專有名詞第一次出現時保留英文並補充中文說明，例如「On-device Learning（裝置端學習）」。

## 2. 技術與部署限制

- 使用原生 HTML5、CSS3、JavaScript（ES6+）與 JSON；不使用 React、後端、資料庫或付費 API。
- 網站為靜態網站，可直接由 GitHub Pages 發布；不得引入必須在伺服器執行的功能。
- 不依賴 CDN 或外部 JavaScript 套件；網站核心功能必須在沒有第三方服務的情況下運作。
- GitHub Pages 使用 `main` 分支的 `/(root)` 作為發布來源。
- 所有靜態檔案與 fetch 路徑使用相對路徑，例如 `./assets/css/styles.css` 與 `./data/topics/index.json`，不要將專案路徑硬寫死。
- 頁面採 hash routing，首頁為 `#/`，技術文章為 `#/topics/<slug>`。例如 `#/topics/tinyml-overview`，在 GitHub Pages 重新整理時不應產生 404。
- 不得將 API 金鑰、密碼、個資或不具授權的材料放入 Repository。

## 3. 專案檔案結構

```text
tinyml-knowledge-hub/
├── AGENTS.md                  # AI 開發與維護規範（本檔）
├── README.md                  # 專案介紹、啟動、部署與新增文章教學
├── index.html                 # 唯一 HTML 入口與網站共用容器
├── .nojekyll                  # 避免 GitHub Pages 以 Jekyll 處理靜態檔案
├── assets/
│   ├── css/
│   │   └── styles.css         # 全站樣式、RWD、色彩變數
│   └── js/
│       └── app.js             # 路由、搜尋、分類、文章渲染與錯誤處理
└── data/
    └── topics/
        ├── index.json         # 全站文章清單與搜尋所需中繼資料
        ├── tinyml-overview.json
        ├── mcu-resource-constraints.json
        ├── on-device-learning-overview.json
        ├── sparse-update.json
        ├── intermittent-computing-overview.json
        └── checkpointing-overview.json
```

請保持這個結構；有明確需求時才新增資料夾，並同步更新 `README.md` 與本文件。

## 4. 固定分類與網址規則

只能使用下列分類代碼：

| category | 網頁顯示名稱 | 主題範例 |
| --- | --- | --- |
| `fundamentals` | TinyML 基礎 | TinyML、MCU 記憶體、Quantization |
| `on-device-learning` | On-device Learning | Forward/Backward、Sparse Update |
| `intermittent-computing` | Intermittent Computing | Energy Harvesting、Checkpointing |

- `slug` 必須是唯一且全小寫的英文 kebab-case，例如 `activation-checkpointing`。
- `slug` 只允許英文字母 a–z、數字 0–9 與字詞間連字號，建議符合 `^[a-z0-9]+(?:-[a-z0-9]+)*$`。
- 文章檔名必須是 `<slug>.json`，文章網址必須是 `#/topics/<slug>`。
- 既有文章的 `slug` 是永久識別碼，除非有明確遷移要求，否則不得更改。
- 每個文章頁都必須共用同一套模板；不得為單篇文章複製一份 HTML。

## 5. 文章索引格式：`data/topics/index.json`

索引是首頁卡片、分類篩選與搜尋的唯一資料來源。格式如下：

```json
{
  "topics": [
    {
      "slug": "tinyml-overview",
      "title": "TinyML 是什麼？",
      "category": "fundamentals",
      "summary": "認識在微控制器上執行機器學習的核心概念與資源限制。",
      "level": "beginner",
      "tags": ["TinyML", "MCU", "Inference"],
      "updatedAt": "2026-11-12"
    }
  ]
}
```

規範：
- 需要的欄位：`slug`、`title`、`category`、`summary`、`level`、`tags`、`updatedAt`；不得省略。
- `level` 只能使用 `beginner`、`intermediate`、`advanced`。
- `updatedAt` 採 `YYYY-MM-DD`，代表該文章內容上次實際更新的日期，不可虛構日期。
- `summary` 必須是一到兩句繁體中文，讓讀者知道本文能學到什麼。
- 每個 `slug` 不得重複；索引中每一筆資料必須有對應的 `<slug>.json`。
- 首頁的分類、搜尋結果、文章數量都從這份索引動態產生，不可寫死在 HTML 中。

## 6. 文章內容格式：`data/topics/<slug>.json`

```json
{
  "slug": "tinyml-overview",
  "overview": "本篇介紹 TinyML 的目的、執行環境及常見限制。",
  "sections": [
    {
      "id": "definition",
      "heading": "定義與背景",
      "paragraphs": ["TinyML 主要關注在資源有限的嵌入式裝置上執行機器學習工作。"],
      "bullets": ["常見平台包括 MCU。"],
      "example": "例如使用感測器資料在裝置上執行簡單分類。"
    },
    {
      "id": "mechanism",
      "heading": "核心原理與運作流程",
      "paragraphs": ["說明資料輸入、模型運算與結果輸出的基本流程。"],
      "bullets": [],
      "example": ""
    },
    {
      "id": "example",
      "heading": "實際範例",
      "paragraphs": ["以一個簡化的小型感測應用解釋輸入、處理與輸出。"],
      "bullets": [],
      "example": "本段示例為教學用情境，不代表特定論文的實驗結果。"
    },
    {
      "id": "limitations",
      "heading": "適用情境與限制",
      "paragraphs": ["說明記憶體、運算能力及能耗限制。"],
      "bullets": [],
      "example": ""
    }
  ],
  "keyTakeaways": [
    "理解 TinyML 的基本目標。",
    "能分辨 MCU 資源限制對模型部署的影響。",
    "知道何時需要進一步查閱模型最佳化方法。"
  ],
  "references": [
    {
      "title": "TensorFlow Lite for Microcontrollers 原始碼",
      "url": "https://github.com/tensorflow/tflite-micro"
    }
  ],
  "related": ["mcu-resource-constraints"]
}
```

規範：
- `slug` 必須與檔名及索引中的 `slug` 相同。
- `overview` 需以一至三句話說明讀者會學到什麼。
- `sections` 至少包含四個主題：①定義與背景 ②核心原理／架構 ③實際範例 ④適用情境與限制。可按需要補充其他小節，但不得刪除這四項。
- 每個 `section` 必須有唯一 `id`、`heading`、`paragraphs`（字串陣列）、`bullets`（字串陣列）、`example`（字串）；沒有內容時用 `[]` 或 `""`。
- `keyTakeaways` 建議三項，必須為讀者能理解的學習重點。
- `references` 至少一項，優先使用論文原文、作者專案或官方技術文件；每筆包含 `title` 和合法 `https://` 網址。
- `related` 是已有文章的 `slug` 陣列，建議 0–3 項，不得連至不存在的文章，也不可連到自己。
- 不允許在 JSON 中寫 HTML；渲染時用安全的 DOM 文字節點或 `textContent`，不可把未驗證的內容直接放進 `innerHTML`。

## 7. 頁面與功能規範

### 首頁 `#/`

- 網站名稱、副標題、簡短介紹。
- 搜尋框：依文章 `title`、`summary`、`tags` 篩選（不需全文搜尋）。
- 分類篩選：全部、TinyML 基礎、On-device Learning、Intermittent Computing。
- 文章卡片：標題、摘要、分類、程度、標籤與閱讀連結。
- 若搜尋無結果，顯示明確提示和清除篩選方式。

### 文章頁 `#/topics/<slug>`

- 麵包屑：首頁 / 分類 / 文章標題。
- 顯示文章標題、分類、程度、更新日期、簡介。
- 以固定順序顯示 `sections`、重點整理、參考資料、相關文章。
- 參考資料連結開新分頁時使用 `rel="noopener noreferrer"`。
- 提供返回首頁及閱讀相關文章的操作。
- 找不到 `slug` 或無法讀取 JSON 時，顯示友善錯誤畫面和返回首頁連結，不可出現空白頁。

### 通用設計

- 清爽的技術文件風格：白色或淺灰背景、深藍文字與青綠色重點色。
- 先定義 CSS 變數（如 `--color-primary`、`--color-bg`、`--radius-card`），不得到處寫重複色碼。
- 行動裝置優先；在 360px、768px、1280px 常見寬度應能正常閱讀。
- 文字與背景須有足夠對比，按鈕、連結和輸入框需有可辨識的焦點樣式。
- 所有可點擊元素應使用 `<a>` 或 `<button>`，不可用無語意 `<div>` 假裝按鈕。

## 8. AI 新增文章的標準作業流程（必須遵守）

1. 先讀 `AGENTS.md`、`data/topics/index.json`，確認新主題沒有重複。
2. 選擇正確的既有分類、難易程度、英文 `slug`，並確認相關文章是否存在。
3. 根據第 6 節格式新增 `data/topics/<slug>.json`，四個必要小節、重點整理及參考資料不可缺少。
4. 更新 `data/topics/index.json`，加入符合第 5 節格式的新索引資料。
5. 不要為新增文章建立新的 HTML 頁面，不要修改 `index.html` 或 `app.js`，除非發現現有模板功能不足且使用者明確要求修正。
6. 驗證 JSON 格式、所有 slug、相關文章連結、搜尋與分類結果、文章網址及手機版排版。
7. 回報新增／修改的檔案、文章網址、參考來源、檢查結果，以及尚未完成的事項。未實際測試的項目不得聲稱測試成功。

## 9. AI 修改既有內容的規則

- 只修改與需求直接相關的檔案，避免大範圍重寫。
- 必須保留原 `slug`，除非使用者要求更換且同意調整所有連結。
- 更新內容時同步修正索引中的 `summary`、`tags` 或 `updatedAt`（若有變動）。
- 學術敘述需可追溯來源，不可編造論文數據、作者、年份、實驗結果或 GitHub 網址。
- 技術概念要區分正式定義、論文作者主張與自己設計的教學舉例。
- 遇到不確定的技術細節，應標示待查證，不能以猜測當作事實。
- 不直接複製受版權保護的長篇段落或未授權圖表。
- 新增網站功能須保留現有文章可讀性及 hash 路由相容性，並更新 README 說明。

## 10. 完成前的必要驗收

- [ ] 首頁能在本機 HTTP 伺服器載入；不要以 `file://` 打開網站來測試 `fetch()`。
- [ ] 首頁讀取的是索引資料，文章卡片數目與 `index.json` 一致。
- [ ] 搜尋文字與切換分類後，畫面能正確更新；無結果時有提示。
- [ ] 每篇文章網址都能點開、重新整理、返回首頁。
- [ ] 所有 JSON 能正確解析，必填欄位齊全，`slug`、`related`、`category` 合法。
- [ ] 所有文章至少有四個必要小節、重點整理及一筆可信參考來源。
- [ ] 外部連結可點擊且沒有明顯錯誤；未實際確認的連結需註明待檢查。
- [ ] 360px、768px、1280px 寬度沒有明顯橫向溢出或操作困難。
- [ ] GitHub Pages 網址可正常訪問，文章 hash 網址重新整理後仍可讀取。
- [ ] `README.md` 清楚說明專案目的、技術架構、本機啟動、部署方式及新增文章的方法。

## 11. 本課作業的「可重複使用」展示方式

初始建立六篇文章，涵蓋三種分類。完成後向 AI 下達以下指令，以驗證本文件確實能指導擴充：

> 請先閱讀 AGENTS.md，再依照既有格式新增「Model Quantization（模型量化）」文章，分類為 fundamentals，並確保首頁搜尋、分類與文章連結都能使用。請列出實際修改的檔案與驗證結果。

理想情況下，AI 只需新增 `data/topics/model-quantization.json` 並修改 `data/topics/index.json`，就能讓新內容在首頁出現，且擁有固定網址 `#/topics/model-quantization`。如需修改核心程式才可新增文章，應優先檢查原有架構是否違反「內容與版型分離」的原則。
