(function () {
  const panels = [...document.querySelectorAll("[data-panel]")];
  const title = document.querySelector("[data-panel-title]");
  const labels = { dashboard: "首页概览", content: "内容与发布", submissions: "报名与会员申请", facebook: "Facebook 同步", security: "账号与权限" };
  document.querySelectorAll("[data-panel-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.panelTarget;
      panels.forEach((panel) => panel.classList.toggle("is-visible", panel.dataset.panel === target));
      document.querySelectorAll(".preview-sidebar nav button").forEach((item) => item.classList.toggle("is-active", item.dataset.panelTarget === target));
      if (title) title.textContent = labels[target] || "CMS 外观预览";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
})();
