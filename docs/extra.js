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

  // 初始化主题
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

  // 返回顶部按钮
  const createBackToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--md-primary-fg-color);
      color: white;
      border: none;
      font-size: 18px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
    `;

    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(button);

    // 滚动显示/隐藏
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        button.style.opacity = '1';
        button.style.visibility = 'visible';
      } else {
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
      }
    });
  };

  // 首页卡片：点击卡片空白区域也可跳转到主链接
  const setupHomeCardLinks = () => {
    document.querySelectorAll('.home-card').forEach((card) => {
      if (card.dataset.clickReady === 'true') return;
      card.dataset.clickReady = 'true';

      const mainLink = card.querySelector('h3 a[href]') || card.querySelector('a[href]');
      if (!mainLink) return;

      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'link');
      card.setAttribute('aria-label', `Open ${mainLink.textContent?.trim() || 'card link'}`);

      card.addEventListener('click', (event) => {
        if (event.target.closest('a, button, input, textarea, select, label, summary')) return;
        window.location.href = mainLink.href;
      });

      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          window.location.href = mainLink.href;
        }
      });
    });
  };

  // 页面加载完成后初始化功能
  document.addEventListener('DOMContentLoaded', () => {
    createBackToTopButton();
    setupHomeCardLinks();

    // 代码块复制成功提示
    document.addEventListener('click', (e) => {
      if (e.target.matches('.md-clipboard')) {
        setTimeout(() => {
          const tooltip = document.createElement('div');
          tooltip.textContent = '已复制！';
          tooltip.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 9999;
            animation: fadeInOut 2s ease-in-out forwards;
          `;

          if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
              @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                20%, 80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
              }
            `;
            document.head.appendChild(style);
          }

          document.body.appendChild(tooltip);
          setTimeout(() => tooltip.remove(), 2000);
        }, 100);
      }
    });

    // 图片懒加载优化
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }

    // 外链新窗口打开
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      try {
        if (!link.hostname.includes(window.location.hostname)) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      } catch (e) {
        // ignore malformed links
      }
    });
  });

  console.log("🚀 网站功能已加载完成！");
  console.log("📚 欢迎来到 Samuel 的学习笔记！");

  // ================= MathJax 配置 =================
  // 请确保在 mkdocs.yml 的 extra_javascript 中把 mathjax 脚本放在本文件之后
  window.MathJax = {
    loader: {
      load: ['[tex]/boldsymbol']
    },
    tex: {
      packages: {
        '[+]': ['boldsymbol']
      },
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      displayMath: [["$$", "$$"], ["\\[", "\\]"]],
      processEscapes: true,
      processEnvironments: true
    },
    options: {
      // 跳过 code/pre 等（通常不需要处理）
      skipHtmlTags: ["script", "noscript", "style", "textarea", "pre"],
      // 与 arithmatex(generic: true) 配套，仅处理 arithmatex 包裹的内容
      ignoreHtmlClass: ".*|",
      processHtmlClass: "arithmatex"
    }
  };

  // 渲染 MathJax 公式（safe wrapper）
  function renderMathJax() {
    if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
      MathJax.typesetPromise()
        .then(() => console.debug("MathJax 渲染完成"))
        .catch(err => console.error("MathJax 渲染错误：", err));
    }
  }

  // 兼容脚本延迟加载：重试几次，确保 MathJax 可用后触发渲染
  function renderMathJaxWithRetry(retries = 10, delayMs = 300) {
    if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
      renderMathJax();
      return;
    }
    if (retries <= 0) {
      console.warn("MathJax 未就绪，跳过本次渲染");
      return;
    }
    setTimeout(() => renderMathJaxWithRetry(retries - 1, delayMs), delayMs);
  }

  // ================= Mermaid 配置 =================
  function renderMermaid() {
    if (!window.mermaid) return;

    try {
      // 初始化（只要调用一次也安全）
      mermaid.initialize({ startOnLoad: false, theme: 'default' });

      // 把 <pre><code class="language-mermaid">...</code></pre> 替换成 <div class="mermaid">...</div>
      document.querySelectorAll('code.language-mermaid').forEach((codeBlock) => {
        const pre = codeBlock.closest('pre');
        if (!pre) return;
        const container = document.createElement('div');
        container.className = 'mermaid';
        // 使用 textContent 保持原始文本（避免 innerHTML 注入风险）
        container.textContent = codeBlock.textContent;
        pre.parentNode.replaceChild(container, pre);
        // 渲染这个 container
        try {
          mermaid.init(undefined, container);
        } catch (e) {
          console.warn('Mermaid 渲染单个图时出错：', e);
        }
      });

      // 若页面存在多个 .mermaid，初始化全量渲染（兼容老版本 API）
      try {
        if (typeof mermaid.run === 'function') mermaid.run();
        else mermaid.init(undefined, document.querySelectorAll('.mermaid'));
      } catch (e) {
        console.debug('mermaid run/init 异常（可忽略）：', e);
      }

      console.debug("Mermaid 渲染完成");
    } catch (e) {
      console.error("Mermaid 渲染错误：", e);
    }
  }

  // 绑定初次加载
  document.addEventListener('DOMContentLoaded', () => {
    renderMathJaxWithRetry();
    renderMermaid();
  });

  // 兼容 Material 的 instant navigation（页面切换后重新渲染公式/流程图）
  if (window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(() => {
      renderMathJaxWithRetry();
      renderMermaid();
    });
  }

  // 兜底：窗口资源加载完成后再触发一次
  window.addEventListener('load', () => {
    renderMathJaxWithRetry();
  });

  // Material 的 instant navigation 事件：页面切换完成
  if (window.document$ && typeof document$.subscribe === 'function') {
    document$.subscribe(() => {
      // 小延迟避免 race condition（DOM 未完全就绪）
      setTimeout(() => {
        setupHomeCardLinks();
        renderMathJax();
        renderMermaid();
      }, 60);
    });
  } else {
    // 兼容 fallback
    document.addEventListener('navigation:end', () => {
      setTimeout(() => {
        setupHomeCardLinks();
        renderMathJax();
        renderMermaid();
      }, 60);
    });
  }

})();
