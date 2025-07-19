(() => {
  // 主题模式切换
  document.querySelectorAll("button[data-md-color-scheme]").forEach(btn =>
    btn.addEventListener("click", () => {
      const s = btn.getAttribute("data-md-color-scheme");
      document.body.setAttribute("data-md-color-scheme", s);
      localStorage.setItem("data-md-color-scheme", s);
      updateScheme();
    })
  );
  // 主色调切换
  document.querySelectorAll("button[data-md-color-primary]").forEach(btn =>
    btn.addEventListener("click", () => {
      const p = btn.getAttribute("data-md-color-primary");
      document.body.setAttribute("data-md-color-primary", p);
      localStorage.setItem("data-md-color-primary", p);
    })
  );
  // 初始化
  (() => {
    const p = localStorage.getItem("data-md-color-primary");
    if (p) document.body.setAttribute("data-md-color-primary", p);
    let s = localStorage.getItem("data-md-color-scheme") || "slate";
    document.body.setAttribute("data-md-color-scheme", s);
  })();
  // 同步 Giscus 主题
  window.updateScheme = () => {
    const frame = document.querySelector(".giscus-frame");
    if (!frame) return;
    const mode = localStorage.getItem("data-md-color-scheme") === "default" ? "light" : "dark";
    frame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: mode } } },
      "https://giscus.app"
    );
  };
})();


// 可选 JavaScript 自定义行为
console.log("欢迎来到我的网站！");
