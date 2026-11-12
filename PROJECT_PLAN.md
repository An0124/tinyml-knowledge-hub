# 第九週作業專案規劃：TinyML 技術知識庫

## 專案定位
以繁體中文整理 TinyML、On-device Learning、Intermittent Computing 的入門與研究知識。使用原生 HTML、CSS、JS 與 JSON，採「共用模板 + 獨立文章資料 + 索引」架構，部署於 GitHub Pages。

## 建議最小完成範圍（MVP）
1. 首頁：網站簡介、三種分類、文章卡片、關鍵字搜尋、空結果提示。
2. 文章頁：標題與中繼資料、四個標準章節、三條重點整理、參考資料、相關文章、返回首頁。
3. 資料架構：`data/topics/index.json` + 每篇文章獨立 `<slug>.json`。
4. 操作：使用 hash routing（`#/`、`#/topics/<slug>`）避免 GitHub Pages 深連結 404。
5. 可讀性：手機、平板、桌面 RWD，所有互動有明確操作與錯誤狀態。
6. 交付：`AGENTS.md`、`README.md`、GitHub Repository、GitHub Pages 網址、新增文章示範。

## 初始六篇文章
| 分類 | slug | 中文標題 |
| --- | --- | --- |
| 基礎 | `tinyml-overview` | TinyML 是什麼？ |
| 基礎 | `mcu-resource-constraints` | MCU 記憶體與運算資源限制 |
| 裝置端學習 | `on-device-learning-overview` | On-device Learning 入門 |
| 裝置端學習 | `sparse-update` | Sparse Update 的目的與運作 |
| 間歇運算 | `intermittent-computing-overview` | Intermittent Computing 是什麼？ |
| 間歇運算 | `checkpointing-overview` | Checkpointing 與斷電恢復 |

## 新增文章實測
請 AI 先閱讀 AGENTS.md，再新增 `model-quantization`。預期只需新增一個 JSON 檔、更新索引，首頁自動產生卡片且新文章 URL 可直接開啟。

## 實作順序
1. 建立檔案架構與 AGENTS.md。
2. 實作首頁、共用文章模板、索引載入、hash 路由。
3. 實作搜尋、分類、無結果與錯誤狀態、手機排版。
4. 撰寫六篇示範文章並附可信來源。
5. 依 AGENTS.md 讓 AI 新增第七篇文章，保留操作前後差異作證明。
6. 補上 README，部署 GitHub Pages，實際測試 Repo 與公開網站。

## 9～10 分展示重點
- 規則具體：清楚定義資料欄位、命名、分類、頁面模板、來源與驗證方式。
- 網頁對應：首頁卡片、搜尋、分類、文章內文確實由 JSON 驅動。
- 可延伸證據：執行一次「新增第七篇文章」並在 README 說明新增的兩個 JSON 檔案。
- 成品完整：公開 Repo 與 Pages；首頁、文章、搜尋、分類、手機版可正常使用。

## GitHub Pages 部署摘要
GitHub Repository 命名建議 `tinyml-knowledge-hub`。將檔案提交至 `main` 根目錄，至 GitHub Settings > Pages > Build and deployment，選擇 `Deploy from a branch`、`main`、`/(root)`，儲存後取得網站網址。實際網址形式通常是 `https://<GitHub帳號>.github.io/tinyml-knowledge-hub/`（需以自己的帳號替換，且以 Pages 顯示網址為準）。

## 線上繳交欄位
1. 專案簡介
2. GitHub Repository（實際連結）
3. 公開網站（實際連結）
4. AGENTS.md（建議提供 Repo 內該檔連結，並視老師要求附上內容）
5. 說明 AI 如何遵照文件新增 `model-quantization` 等文章，而不重新建立頁面模板。
