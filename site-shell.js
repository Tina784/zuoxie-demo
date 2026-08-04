const siteHeaderHost = document.querySelector("[data-site-header]");
if (siteHeaderHost) {
  siteHeaderHost.innerHTML = `
    <a class="brand" href="index.html#home" aria-label="回到首页">
      <img src="images/zuoxie-logo-cutout.png" alt="马来西亚华文作家协会 logo">
      <span>马来西亚华文作家协会<small>Malaysia Chinese Writers Association</small></span>
    </a>
    <nav class="main-nav" aria-label="主要导航">
      <div class="nav-group"><a href="index.html#about">关于作协</a><div class="nav-submenu"><a href="about.html" target="_blank" rel="noopener">作协简介</a><a href="council.html" target="_blank" rel="noopener">作协理事会</a></div></div>
      <div class="nav-group"><a href="index.html#events">活动动态</a><div class="nav-submenu"><a href="events.html#activity" target="_blank" rel="noopener">活动</a><a href="events.html#course" target="_blank" rel="noopener">课程</a><a href="events.html#articles" target="_blank" rel="noopener">文章发表</a><a href="events.html#visits" target="_blank" rel="noopener">拜访交流</a><a href="event-tea.html" target="_blank" rel="noopener">与作家的下午茶</a><a href="event-landscape.html" target="_blank" rel="noopener">我爱山河文学写生</a></div></div>
      <div class="nav-group"><a href="index.html#course">课程</a><div class="nav-submenu"><a href="course-creative.html" target="_blank" rel="noopener">深耕文学创作班</a><a href="course-appreciation.html" target="_blank" rel="noopener">扎根文学鉴赏班</a></div></div>
      <div class="nav-group"><a href="index.html#writers">作家专栏</a><div class="nav-submenu"><a href="writer-council.html" target="_blank" rel="noopener">理事文章</a><a href="writer-members.html" target="_blank" rel="noopener">会员文章</a><a href="writer-young.html" target="_blank" rel="noopener">青年作家</a><a href="https://zuoxie.wordpress.com/" target="_blank" rel="noopener">投稿</a></div></div>
      <a href="index.html#award">文学奖</a><a href="index.html#bookshop">书店</a><a href="index.html#contact">联系我们</a><a href="index.html#zhongzi">种字网</a>
    </nav>
    <button class="nav-search-icon" type="button" aria-label="搜索">⌕</button>
    <button class="google-login" type="button">Google 登录</button>
  `;

  const currentPage = location.pathname.split("/").pop() || "index.html";
  let currentNavHref = "";
  if (currentPage.startsWith("event") || currentPage === "events.html") currentNavHref = "events.html";
  if (currentPage.startsWith("course") || currentPage === "course.html") currentNavHref = "course.html";
  if (currentPage.startsWith("writer")) currentNavHref = "writer-columns.html";
  if (currentPage === "about.html" || currentPage === "council.html") currentNavHref = "about.html";
  if (currentPage === "award.html") currentNavHref = "award.html";
  if (currentPage === "bookshop.html") currentNavHref = "bookshop.html";
  if (currentPage === "contact.html") currentNavHref = "contact.html";
  if (currentPage === "zhongzi.html") currentNavHref = "zhongzi.html";
  const currentNavLink = currentNavHref ? siteHeaderHost.querySelector(`.main-nav a[href="${currentNavHref}"]`) : null;
  if (currentNavLink) currentNavLink.classList.add("is-current");
}

const siteFooterHost = document.querySelector("[data-site-footer]");
if (siteFooterHost) {
  siteFooterHost.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand"><img src="images/zuoxie-logo-cutout.png" alt="马来西亚华文作家协会 logo"><div><h2>马来西亚华文作家协会</h2><p>书写马华文学 · 保存时代回声</p></div></div>
      <div class="footer-columns">
        <section class="footer-col"><h3>资源</h3><nav><a href="events.html">活动动态</a><a href="course.html">课程</a><a href="writer-columns.html">作家专栏</a><a href="award.html">文学奖</a><a href="bookshop.html">书店</a><a href="zhongzi.html">种字网</a></nav></section>
        <section class="footer-col"><h3>协会</h3><nav><a href="about.html">作协简介</a><a href="council.html">作协理事会</a><a href="contact.html">联系我们</a></nav></section>
        <section class="footer-col"><h3>联系</h3><div class="footer-contact"><span>mychinesewriters@gmail.com</span><span>作协活动中心 · Unit 12-03, 1, Jln 19/3, Seksyen 19, 46300 Petaling Jaya, Selangor.</span></div></section>
      </div>
      <div class="footer-bottom"><span>© 2026 Malaysia Chinese Writers Association · Designed &amp; Developed by Tina</span><span class="footer-legal"><a href="legal.html" target="_blank" rel="noopener">用户协议与隐私政策</a></span></div>
    </div>
  `;
}
