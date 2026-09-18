const siteHeaderHost = document.querySelector("[data-site-header]");
if (siteHeaderHost) {
  if (!document.querySelector(".skip-link")) {
    siteHeaderHost.insertAdjacentHTML("beforebegin", '<a class="skip-link" href="#main-content">跳到主要内容</a>');
  }
  siteHeaderHost.innerHTML = `
    <a class="brand" href="index.html#home" aria-label="回到首页">
      <img src="images/zuoxie-logo-cutout.png" alt="马来西亚华文作家协会 logo">
      <span>马来西亚华文作家协会<small>Malaysia Chinese Writers Association</small></span>
    </a>
    <nav class="main-nav" aria-label="主要导航">
      <div class="nav-group"><a href="about.html">关于作协</a><div class="nav-submenu"><a href="about.html">作协简介</a><a href="council.html">作协理事会</a></div></div>
      <div class="nav-group"><a href="events.html">活动</a><div class="nav-submenu"><a href="event-tea.html">与作家的下午茶</a><a href="event-landscape.html">爱我山河·文学写生</a></div></div>
      <div class="nav-group"><a href="course.html">课程报名</a><div class="nav-submenu"><a href="course-registration.html?programme=creative">报名深耕文学创作班</a><a href="course-registration.html?programme=appreciation">报名扎根文学鉴赏班</a></div></div>
      <div class="nav-group"><a href="writer-columns.html">作家专栏</a><div class="nav-submenu"><a href="writer-council.html">理事文章</a><a href="writer-members.html">会员文章</a><a href="writer-young.html">青年作家</a></div></div>
      <a href="award.html">文学奖资讯</a>
      <a href="membership.html">注册会员</a>
      <a href="support.html">支持作协</a>
      <a href="bookshop.html">书店</a>
      <a href="contact.html">联系我们</a>
      <a href="https://zuoxie.wordpress.com/" target="_blank" rel="noopener">种字网</a>
    </nav>
  `;

  const currentPage = location.pathname.split("/").pop() || "index.html";
  let currentNavHref = "";
  if (currentPage.startsWith("event") || currentPage === "events.html") currentNavHref = "events.html";
  if (currentPage.startsWith("course") || currentPage === "course.html") currentNavHref = "course.html";
  if (currentPage.startsWith("writer") || currentPage === "read-book.html") currentNavHref = "writer-columns.html";
  if (currentPage === "about.html" || currentPage === "council.html") currentNavHref = "about.html";
  if (currentPage === "award.html") currentNavHref = "award.html";
  if (currentPage === "membership.html") currentNavHref = "membership.html";
  if (currentPage === "bookshop.html") currentNavHref = "bookshop.html";
  if (currentPage === "support.html") currentNavHref = "support.html";
  if (currentPage === "contact.html") currentNavHref = "contact.html";
  if (currentPage === "zhongzi.html") currentNavHref = "zhongzi.html";
  const currentNavLink = currentNavHref ? siteHeaderHost.querySelector(`.main-nav a[href="${currentNavHref}"]`) : null;
  if (currentNavLink) {
    currentNavLink.classList.add("is-current");
    currentNavLink.setAttribute("aria-current", "page");
  }
}

const siteMain = document.querySelector("main");
if (siteMain && !siteMain.id) siteMain.id = "main-content";
if (siteMain && !siteMain.hasAttribute("tabindex")) siteMain.tabIndex = -1;

const siteFooterHost = document.querySelector("[data-site-footer]");
if (siteFooterHost) {
  siteFooterHost.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand"><img src="images/zuoxie-logo-cutout.png" alt="马来西亚华文作家协会 logo"><div><h2>马来西亚华文作家协会</h2><p>书写马华文学 · 保存时代回声</p></div></div>
      <div class="footer-columns">
        <section class="footer-col"><h3>浏览</h3><nav><a href="events.html">活动与消息</a><a href="course.html">文学课程</a><a href="writer-columns.html">文学阅读</a><a href="bookshop.html">出版品</a></nav></section>
        <section class="footer-col"><h3>协会</h3><nav><a href="about.html">会史与使命</a><a href="council.html">第21届理事会</a><a href="award.html">文学奖资讯</a><a href="membership.html">注册会员</a><a href="support.html">支持作协</a><a href="https://zuoxie.wordpress.com/" target="_blank" rel="noopener">种字网</a></nav></section>
        <section class="footer-col"><h3>联系</h3><div class="footer-contact"><a href="mailto:mychinesewriters@gmail.com">mychinesewriters@gmail.com</a><a href="https://www.facebook.com/mychinesewriters" target="_blank" rel="noopener">Facebook · 马华作协</a><span>实体活动地点请以最新活动公告为准</span></div></section>
      </div>
      <div class="footer-bottom"><span>© 2026 Malaysia Chinese Writers Association · Designed &amp; Developed by Tina</span><span class="footer-legal"><a href="legal.html" target="_blank" rel="noopener">用户协议与隐私政策</a></span></div>
    </div>
  `;
}
