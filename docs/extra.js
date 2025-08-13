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
  
  // 页面加载完成后初始化功能
  document.addEventListener('DOMContentLoaded', () => {
    createBackToTopButton();
    
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
          
          // 添加动画样式
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
      if (!link.hostname.includes(window.location.hostname)) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });
  });
  
  console.log("🚀 网站功能已加载完成！");
  console.log("📚 欢迎来到 Samuel 的学习笔记！");


  // === 追加 MathJax 配置 ===
  window.MathJax = {
    tex: {
      inlineMath: [["\\(", "\\)"]],
      displayMath: [["\\[", "\\]"]],
      processEscapes: true,
      processEnvironments: true
    },
    options: {
      ignoreHtmlClass: ".*|",
      processHtmlClass: "arithmatex"
    }
  };

  // navigation.instant 切换页面时重新渲染
  document$.subscribe(() => {
    MathJax.startup.output.clearCache();
    MathJax.typesetClear();
    MathJax.texReset();
    MathJax.typesetPromise();
  });

  console.log("🚀 网站功能已加载完成！");

  document.addEventListener('DOMContentLoaded', () => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      MathJax.typesetPromise()
        .then(() => console.log('MathJax 初始渲染完成'))
        .catch(err => console.error(err));
    }
  });

  document.addEventListener('navigation:end', () => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      MathJax.typesetPromise()
        .then(() => console.log('MathJax 页面切换后渲染完成'))
        .catch(err => console.error(err));
    }
  });
})();
