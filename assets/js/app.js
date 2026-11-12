"use strict";

(() => {
  const categoryNames = {
    fundamentals: "TinyML 基礎",
    "on-device-learning": "On-device Learning",
    "intermittent-computing": "Intermittent Computing"
  };
  const categorySymbols = { fundamentals: "◇", "on-device-learning": "↗", "intermittent-computing": "ϟ" };
  const levelNames = { beginner: "入門", intermediate: "進階", advanced: "深入研究" };
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const main = document.querySelector("#main");
  const state = { topics: null, category: "all", query: "", routeVersion: 0 };
  const articleCache = new Map();

  function el(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }
  function link(label, href, className) {
    const node = el("a", className, label);
    node.setAttribute("href", href);
    return node;
  }
  function button(label, className, handler) {
    const node = el("button", className, label);
    node.type = "button";
    node.addEventListener("click", handler);
    return node;
  }
  function topicUrl(slug) { return `#/topics/${slug}`; }
  function isText(value) { return typeof value === "string" && value.trim().length > 0; }
  function isStringArray(value) { return Array.isArray(value) && value.every(item => typeof item === "string"); }
  function validDate(value) {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  }
  function validHttps(value) {
    try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; }
    catch { return false; }
  }
  async function fetchJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
  async function loadIndex() {
    if (state.topics) return state.topics;
    const data = await fetchJson("./data/topics/index.json");
    if (!Array.isArray(data.topics)) throw new Error("Invalid index");
    const seen = new Set();
    for (const topic of data.topics) {
      if (!topic || !isText(topic.slug) || !slugPattern.test(topic.slug) || seen.has(topic.slug)
        || !isText(topic.title) || !isText(topic.summary)
        || !Object.hasOwn(categoryNames, topic.category) || !Object.hasOwn(levelNames, topic.level)
        || !isStringArray(topic.tags) || !validDate(topic.updatedAt)) throw new Error("Invalid topic metadata");
      seen.add(topic.slug);
    }
    state.topics = data.topics;
    return state.topics;
  }
  async function loadArticle(slug) {
    if (articleCache.has(slug)) return articleCache.get(slug);
    const article = await fetchJson(`./data/topics/${slug}.json`);
    if (!article || article.slug !== slug || !isText(article.overview) || !Array.isArray(article.sections)
      || article.sections.length < 4 || !isStringArray(article.keyTakeaways) || !article.keyTakeaways.length
      || !Array.isArray(article.references) || !article.references.length || !isStringArray(article.related)) throw new Error("Invalid article");
    const ids = new Set();
    for (const section of article.sections) {
      if (!section || !isText(section.id) || !slugPattern.test(section.id) || ids.has(section.id)
        || !isText(section.heading) || !isStringArray(section.paragraphs)
        || !isStringArray(section.bullets) || typeof section.example !== "string") throw new Error("Invalid section");
      ids.add(section.id);
    }
    if (!article.references.every(ref => ref && isText(ref.title) && validHttps(ref.url))
      || new Set(article.related).size !== article.related.length
      || !article.related.every(related => related !== slug && state.topics.some(topic => topic.slug === related))) throw new Error("Invalid article links");
    articleCache.set(slug, article);
    return article;
  }
  function badge(topic) {
    const node = el("span", "category-badge", categoryNames[topic.category]);
    node.dataset.category = topic.category;
    return node;
  }
  function topicCard(topic) {
    const card = el("article", "topic-card");
    const top = el("div", "card-top");
    top.append(badge(topic), el("span", "card-number", String(state.topics.indexOf(topic) + 1).padStart(2, "0")));
    const title = el("h3");
    title.append(link(topic.title, topicUrl(topic.slug)));
    const tags = el("ul", "tags");
    tags.setAttribute("aria-label", "文章標籤");
    topic.tags.forEach(tag => tags.append(el("li", "", tag)));
    const bottom = el("div", "card-bottom");
    const read = link("閱讀文章 ↗", topicUrl(topic.slug), "read-link");
    read.setAttribute("aria-label", `閱讀文章：${topic.title}`);
    bottom.append(el("span", "level", levelNames[topic.level]), read);
    card.append(top, title, el("p", "card-summary", topic.summary), tags, bottom);
    return card;
  }
  function resetFilters() { state.query = ""; state.category = "all"; }

  function renderHome() {
    document.title = "TinyML Knowledge Hub｜TinyML 技術知識庫";
    const page = el("div", "page");
    const hero = el("section", "hero");
    hero.setAttribute("aria-labelledby", "home-title");
    const intro = el("div");
    const heading = el("h1", "", "小裝置，大可能。");
    heading.id = "home-title";
    heading.append(el("span", "", "探索 TinyML 的世界。"));
    intro.append(el("p", "eyebrow", "TINYML 技術知識庫"), heading,
      el("p", "hero-copy", "從微控制器上的機器學習，到能在斷電之間持續前進的運算。用易懂的繁體中文，建立你的嵌入式機器學習知識地圖。"));
    const firstTopic = state.topics.find(topic => topic.slug === "tinyml-overview") || state.topics[0];
    if (firstTopic) intro.append(link("從 TinyML 開始　→", topicUrl(firstTopic.slug), "primary-link"));
    const map = el("div", "hero-map");
    map.append(el("p", "map-label", "YOUR LEARNING MAP"));
    const learningMap = [
      ["01", "認識裝置", "TinyML 基礎與資源限制"],
      ["02", "讓裝置學習", "On-device Learning · 裝置端學習"],
      ["03", "跨越斷電", "Intermittent Computing · 間歇運算"]
    ];
    learningMap.forEach(([number, title, subtitle]) => {
      const node = el("div", "map-node");
      const text = el("div");
      text.append(el("strong", "", title), el("span", "", subtitle));
      node.append(el("b", "", number), text);
      map.append(node);
    });
    map.append(el("p", "map-caption", "一個觀念，一步前進。從這裡連起你的知識。"));
    hero.append(intro, map);
    const stats = el("div", "stats");
    const categories = Object.keys(categoryNames).filter(category => state.topics.some(topic => topic.category === category));
    [[state.topics.length, "篇技術文章"], [categories.length, "個知識領域"]].forEach(([count, label]) => {
      const stat = el("span", "stat"); stat.append(el("strong", "", count), document.createTextNode(label)); stats.append(stat);
    });
    stats.append(el("span", "stats-note", "基礎觀念 → 運作原理 → 實際範例"));
    const library = el("section", "library");
    library.setAttribute("aria-label", "探索技術文章");
    const aside = el("aside");
    aside.append(el("p", "sidebar-label", "探索分類 / EXPLORE"));
    const categoryNav = el("div", "categories");
    categoryNav.setAttribute("role", "group");
    categoryNav.setAttribute("aria-label", "依分類篩選文章");
    const categoryButtons = [];
    ["all", ...categories].forEach(category => {
      const count = category === "all" ? state.topics.length : state.topics.filter(topic => topic.category === category).length;
      const control = button("", "category-button", () => { state.category = category; updateResults(); });
      control.append(el("span", "category-symbol", categorySymbols[category] || "▦"),
        el("span", "", category === "all" ? "全部文章" : categoryNames[category]), el("span", "category-count", String(count).padStart(2, "0")));
      control.dataset.category = category;
      categoryButtons.push(control);
      categoryNav.append(control);
    });
    aside.append(categoryNav);
    if (firstTopic) {
      const note = el("div", "study-note");
      note.append(el("strong", "", "第一次接觸 TinyML？"), el("p", "", "先認識裝置的能力與限制，再一步步探索學習與能源管理。"), link("閱讀入門文章 →", topicUrl(firstTopic.slug)));
      aside.append(note);
    }
    const content = el("div");
    const toolbar = el("div", "library-top");
    const titles = el("div");
    const resultTitle = el("h2", "library-title", "全部文章");
    const resultCount = el("p", "library-subtitle");
    resultCount.setAttribute("role", "status");
    resultCount.setAttribute("aria-live", "polite");
    titles.append(resultTitle, resultCount);
    const searchWrap = el("div", "search-wrap");
    const searchLabel = el("label", "sr-only", "搜尋文章標題、摘要或標籤");
    searchLabel.htmlFor = "topic-search";
    const search = el("input");
    search.id = "topic-search"; search.type = "search"; search.placeholder = "搜尋主題、關鍵字…"; search.value = state.query;
    const searchIcon = el("span", "search-icon"); searchIcon.setAttribute("aria-hidden", "true");
    searchWrap.append(searchLabel, searchIcon, search);
    toolbar.append(titles, searchWrap);
    const results = el("div");
    content.append(toolbar, results);
    library.append(aside, content);
    page.append(hero, stats, library);
    main.replaceChildren(page);
    function updateResults() {
      categoryButtons.forEach(control => control.setAttribute("aria-pressed", String(control.dataset.category === state.category)));
      resultTitle.textContent = state.category === "all" ? "全部文章" : categoryNames[state.category];
      const query = state.query.trim().toLocaleLowerCase("zh-TW");
      const filtered = state.topics.filter(topic => (state.category === "all" || topic.category === state.category)
        && [topic.title, topic.summary, ...topic.tags].some(value => value.toLocaleLowerCase("zh-TW").includes(query)));
      resultCount.textContent = `顯示 ${filtered.length} / ${state.topics.length} 篇文章${query ? `・搜尋「${state.query.trim()}」` : "・找到下一個想理解的觀念"}`;
      results.replaceChildren();
      if (filtered.length) {
        const grid = el("div", "card-grid"); filtered.forEach(topic => grid.append(topicCard(topic))); results.append(grid);
      } else {
        const empty = el("div", "empty-state");
        empty.append(el("h3", "", "沒有找到符合的文章"), el("p", "", "試試其他關鍵字，或清除搜尋與分類條件。"),
          button("清除所有篩選", "text-button", () => { resetFilters(); search.value = ""; updateResults(); search.focus(); }));
        results.append(empty);
      }
    }
    search.addEventListener("input", () => { state.query = search.value; updateResults(); });
    updateResults();
  }

  function renderArticle(topic, article) {
    document.title = `${topic.title}｜TinyML Knowledge Hub`;
    const page = el("div", "page");
    const nav = el("nav"); nav.setAttribute("aria-label", "麵包屑");
    const crumbs = el("ol", "breadcrumbs");
    const homeCrumb = el("li"); homeCrumb.append(link("首頁", "#/"));
    const categoryCrumb = el("li");
    const categoryLink = link(categoryNames[topic.category], "#/");
    categoryLink.addEventListener("click", () => { state.category = topic.category; state.query = ""; });
    categoryCrumb.append(categoryLink);
    const currentCrumb = el("li", "", topic.title); currentCrumb.setAttribute("aria-current", "page");
    crumbs.append(homeCrumb, categoryCrumb, currentCrumb); nav.append(crumbs);
    const layout = el("div", "article-layout");
    const body = el("article", "article-body");
    const header = el("header", "article-header");
    const meta = el("div", "article-meta");
    const date = el("time", "", `更新於 ${topic.updatedAt}`); date.dateTime = topic.updatedAt;
    meta.append(badge(topic), el("span", "level", levelNames[topic.level]), date);
    header.append(meta, el("h1", "", topic.title), el("p", "article-overview", article.overview));
    body.append(header);
    const toc = el("nav", "article-toc"); toc.setAttribute("aria-label", "文章章節導覽");
    toc.append(el("p", "sidebar-label", "本篇內容 / ON THIS PAGE"));
    const tocList = el("ol");
    function addSection(id, title, number) {
      const section = el("section", "article-section"); section.id = id;
      const heading = el("h2");
      if (number) heading.append(el("span", "section-number", String(number).padStart(2, "0")));
      heading.append(document.createTextNode(title)); heading.tabIndex = -1;
      section.append(heading);
      const item = el("li"); item.append(button(title, "toc-button", () => { section.scrollIntoView({ block: "start" }); heading.focus({ preventScroll: true }); })); tocList.append(item);
      return section;
    }
    article.sections.forEach((section, index) => {
      const node = addSection(`section-${section.id}`, section.heading, index + 1);
      section.paragraphs.forEach(paragraph => node.append(el("p", "", paragraph)));
      if (section.bullets.length) { const bullets = el("ul"); section.bullets.forEach(text => bullets.append(el("li", "", text))); node.append(bullets); }
      if (section.example) { const example = el("div", "example-box"); example.append(el("strong", "", "用情境理解"), el("p", "", section.example)); node.append(example); }
      body.append(node);
    });
    const takeaways = addSection("article-takeaways", "重點整理"); takeaways.classList.add("takeaways");
    const takeawaysList = el("ul"); article.keyTakeaways.forEach(text => takeawaysList.append(el("li", "", text))); takeaways.append(takeawaysList); body.append(takeaways);
    const references = addSection("article-references", "參考資料");
    references.append(el("p", "reference-note", "延伸閱讀原始論文、作者專案與官方技術文件。連結將在新分頁開啟。"));
    const referenceList = el("ol", "reference-list");
    article.references.forEach(ref => { const item = el("li"); const refLink = link(`${ref.title} ↗`, ref.url); refLink.target = "_blank"; refLink.rel = "noopener noreferrer"; item.append(refLink); referenceList.append(item); });
    references.append(referenceList); body.append(references);
    const related = addSection("article-related", "接著探索"); related.classList.add("related-section");
    if (article.related.length) { const grid = el("div", "card-grid"); article.related.forEach(slug => grid.append(topicCard(state.topics.find(item => item.slug === slug)))); related.append(grid); }
    else related.append(el("p", "", "回到知識總覽，探索更多主題。"));
    body.append(related, link("← 返回知識總覽", "#/", "primary-link article-end"));
    toc.append(tocList, link("← 返回首頁", "#/", "back-link"));
    const aside = el("aside", "article-aside"); aside.append(toc);
    layout.append(body, aside); page.append(nav, layout); main.replaceChildren(page);
  }
  function renderError(title, description, retry = false) {
    document.title = `${title}｜TinyML Knowledge Hub`;
    const page = el("div", "page"); const error = el("section", "error-state");
    error.append(el("p", "eyebrow", "TINYML KNOWLEDGE HUB"), el("h1", "", title), el("p", "", description));
    if (retry) error.append(button("重新載入", "text-button", () => route()));
    error.append(el("p", "article-end"));
    const homeLink = link("← 返回首頁", "#/", "primary-link");
    homeLink.addEventListener("click", () => { if (location.hash === "#/") route(); });
    error.append(homeLink); page.append(error); main.replaceChildren(page);
  }
  async function route(moveFocus = true) {
    const version = ++state.routeVersion;
    const hash = location.hash || "#/";
    if (hash === "#main") { main.focus(); return; }
    main.setAttribute("aria-busy", "true");
    const loading = el("p", "loading", "正在載入知識庫…"); loading.setAttribute("role", "status"); main.replaceChildren(loading);
    try {
      await loadIndex();
      if (version !== state.routeVersion) return;
      if (hash === "#/") renderHome();
      else {
        const match = /^#\/topics\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(hash);
        const topic = match && state.topics.find(item => item.slug === match[1]);
        if (!topic) renderError("找不到這個頁面", "這個網址可能有誤，或文章尚未收錄。請回到首頁選擇主題。");
        else {
          const article = await loadArticle(topic.slug);
          if (version !== state.routeVersion) return;
          renderArticle(topic, article);
        }
      }
    } catch {
      if (version !== state.routeVersion) return;
      renderError("暫時無法載入內容", "請確認網路連線並重試。若在本機開啟，請使用 HTTP 伺服器，勿直接開啟 HTML 檔案。", true);
    } finally {
      if (version === state.routeVersion) {
        main.removeAttribute("aria-busy");
        if (moveFocus) { const heading = main.querySelector("h1"); if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); } window.scrollTo(0, 0); }
      }
    }
  }
  // 跳至主內容不改變文章的路由。
  document.querySelector(".skip-link").addEventListener("click", event => { event.preventDefault(); main.focus(); main.scrollIntoView(); });
  window.addEventListener("hashchange", () => route());
  if (!location.hash) history.replaceState(null, "", "#/");
  route(false);
})();
