(function () {
  const configuredBase = String(window.ZUOXIE_API_BASE || document.querySelector('meta[name="zuoxie-api-base"]')?.content || "").replace(/\/$/, "");
  const localBase = ["localhost", "127.0.0.1"].includes(location.hostname) ? "http://127.0.0.1:8000/api" : "";
  const apiBase = configuredBase || localBase;

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  document.querySelectorAll("[data-public-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector('button[type="submit"]');
    const programme = new URLSearchParams(location.search).get("programme");
    const programmeSelect = form.querySelector('[name="programme"]');
    if (programmeSelect && programme) programmeSelect.value = programme === "appreciation" ? "扎根文学鉴赏班" : "深耕文学创作班";

    form.querySelectorAll("textarea[maxlength]").forEach((field) => {
      const counter = form.querySelector(`[data-count-for="${field.name}"]`);
      const updateCounter = () => {
        if (counter) counter.textContent = `${field.value.length} / ${field.maxLength} 字`;
      };
      field.addEventListener("input", updateCounter);
      updateCounter();
    });

    const announce = (message, type = "") => {
      status.textContent = message;
      status.className = `form-status${type ? ` ${type}` : ""}`;
      status.tabIndex = -1;
      status.focus({ preventScroll: true });
      status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!apiBase) {
        announce("报名后端尚待上线。请暂时电邮 mychinesewriters@gmail.com；网站上线时只需填入 CMS 地址即可启用此表格。", "is-error");
        return;
      }

      submit.disabled = true;
      form.setAttribute("aria-busy", "true");
      status.textContent = "正在安全提交……";
      status.className = "form-status";
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.consent = form.elements.consent?.checked || false;
      payload.source = location.href;

      try {
        const response = await fetch(`${apiBase}${form.dataset.endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || Object.values(result.errors || {})[0]?.[0] || "提交失败，请检查资料。 ");
        form.reset();
        if (programmeSelect && programme) programmeSelect.value = programme === "appreciation" ? "扎根文学鉴赏班" : "深耕文学创作班";
        form.querySelectorAll("textarea[maxlength]").forEach((field) => field.dispatchEvent(new Event("input")));
        announce(`${result.message} 参考编号：${result.reference}`, "is-success");
      } catch (error) {
        announce(error.message || "暂时无法提交，请稍后再试。", "is-error");
      } finally {
        submit.disabled = false;
        form.removeAttribute("aria-busy");
      }
    });
  });

  const feed = document.querySelector("[data-facebook-feed-list]");
  if (feed) {
    if (!apiBase) {
      feed.innerHTML = '<p class="feed-status">Facebook 自动同步会在 CMS 上线并由专页管理员完成授权后启用。现阶段可前往官方专页查看最新动态。</p>';
      return;
    }
    fetch(`${apiBase}/facebook-posts`, { headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("无法读取动态")))
      .then(({ data }) => {
        if (!data?.length) {
          feed.innerHTML = '<p class="feed-status">目前还没有已同步的 Facebook 贴文。</p>';
          return;
        }
        feed.innerHTML = data.map((post) => `
          <article class="facebook-feed-card">
            ${post.image ? `<img src="${escapeHtml(post.image)}" alt="" loading="lazy">` : ""}
            <div><time datetime="${escapeHtml(post.published_at)}">${new Date(post.published_at).toLocaleDateString("zh-MY")}</time><h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.summary)}</p><a href="${escapeHtml(post.url)}" target="_blank" rel="noopener">查看 Facebook 原贴 →</a></div>
          </article>`).join("");
      })
      .catch(() => { feed.innerHTML = '<p class="feed-status">暂时无法读取同步内容，请前往 Facebook 官方专页查看。</p>'; });
  }
})();
