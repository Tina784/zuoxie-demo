const homeHero = document.querySelector(".home-hero");
const navLinks = document.querySelectorAll(".main-nav a[href^='#']");
const sections = [...document.querySelectorAll("main section[id]")];
const huaCubeField = document.querySelector(".hua-cube-field");
const huaGlyph = document.querySelector(".hua-glyph");
const heroDust = document.querySelector(".hero-dust");
let huaAnimationTimer;

const huaGridSize = 29;

function between(value, min, max) {
  return value >= min && value <= max;
}

function isHuaStroke(row, col) {
  const topCrown =
    (between(row, 2, 3) && between(col, 7, 21)) ||
    (between(row, 0, 7) && between(col, 10, 11)) ||
    (between(row, 0, 7) && between(col, 17, 18)) ||
    (between(row, 6, 7) && between(col, 4, 24));

  const upperBody =
    (between(row, 9, 10) && between(col, 6, 22)) ||
    (between(row, 12, 13) && between(col, 8, 20)) ||
    (between(row, 8, 17) && between(col, 7, 8)) ||
    (between(row, 8, 17) && between(col, 20, 21)) ||
    (between(row, 11, 15) && between(col, 13, 15));

  const lowerBody =
    (between(row, 17, 18) && between(col, 3, 25)) ||
    (between(row, 21, 22) && between(col, 2, 26)) ||
    (between(row, 24, 25) && between(col, 7, 21)) ||
    (between(row, 16, 28) && between(col, 13, 15));

  const calligraphicTaper =
    (row === 4 && between(col, 5, 8)) ||
    (row === 5 && between(col, 20, 23)) ||
    (row === 14 && between(col, 4, 6)) ||
    (row === 19 && between(col, 22, 25)) ||
    (row === 26 && between(col, 12, 16));

  return topCrown || upperBody || lowerBody || calligraphicTaper;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function setupHeroParticleSystem(container) {
  const canvas = document.createElement("canvas");
  canvas.className = "hero-particle-canvas";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const particles = [];
  const nodes = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationFrame = 0;

  function resize() {
    const rect = container.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedParticles();
  }

  function seedParticles() {
    particles.length = 0;
    nodes.length = 0;
    const particleCount = width < 760 ? 700 : 1600;
    const nodeCount = width < 760 ? 16 : 32;

    for (let i = 0; i < particleCount; i += 1) {
      const angle = rand(0, Math.PI * 2);
      const radius = Math.pow(Math.random(), .62);
      const centerX = rand(width * .62, width * .79);
      const centerY = rand(height * .36, height * .62);
      particles.push({
        x: centerX + Math.cos(angle) * radius * rand(width * .06, width * .33),
        y: centerY + Math.sin(angle) * radius * rand(height * .08, height * .42),
        size: rand(.45, 2.8),
        alpha: rand(.1, .68),
        speed: rand(.018, .105),
        drift: rand(-.22, .22),
        phase: rand(0, Math.PI * 2),
        warm: Math.random() > .72
      });
    }

    for (let i = 0; i < nodeCount; i += 1) {
      nodes.push({
        x: rand(width * .48, width * .94),
        y: rand(height * .18, height * .82),
        size: rand(1.1, 3.2),
        alpha: rand(.18, .72),
        phase: rand(0, Math.PI * 2)
      });
    }
  }

  function draw(now) {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "screen";

    const halo = ctx.createRadialGradient(width * .7, height * .42, 0, width * .7, height * .42, width * .34);
    halo.addColorStop(0, "rgba(243,230,193,.22)");
    halo.addColorStop(.28, "rgba(216,176,106,.12)");
    halo.addColorStop(1, "rgba(216,176,106,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.phase += particle.speed;
      particle.x += Math.sin(particle.phase) * .045 + particle.drift * .018;
      particle.y -= particle.speed * .16;

      if (particle.y < height * .05 || particle.x < width * .35 || particle.x > width) {
        particle.x = rand(width * .52, width * .96);
        particle.y = rand(height * .28, height * .92);
      }

      const pulse = .62 + Math.sin(now * .0012 + particle.phase) * .38;
      const alpha = Math.max(.04, particle.alpha * pulse);
      ctx.beginPath();
      ctx.fillStyle = particle.warm
        ? `rgba(243,230,193,${alpha})`
        : `rgba(216,176,106,${alpha})`;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    nodes.forEach((node, index) => {
      const x = node.x + Math.sin(now * .00035 + node.phase) * 8;
      const y = node.y + Math.cos(now * .00042 + node.phase) * 6;

      for (let j = index + 1; j < nodes.length; j += 1) {
        const other = nodes[j];
        const ox = other.x + Math.sin(now * .00035 + other.phase) * 8;
        const oy = other.y + Math.cos(now * .00042 + other.phase) * 6;
        const distance = Math.hypot(x - ox, y - oy);
        if (distance > 145) continue;
        ctx.strokeStyle = `rgba(216,176,106,${(1 - distance / 145) * .2})`;
        ctx.lineWidth = .65;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ox, oy);
        ctx.stroke();
      }

      const glow = ctx.createRadialGradient(x, y, 0, x, y, node.size * 8);
      glow.addColorStop(0, `rgba(243,230,193,${node.alpha})`);
      glow.addColorStop(.32, `rgba(216,176,106,${node.alpha * .34})`);
      glow.addColorStop(1, "rgba(216,176,106,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, node.size * 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(243,230,193,${Math.min(.9, node.alpha + .12)})`;
      ctx.beginPath();
      ctx.arc(x, y, node.size, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrame = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);
  animationFrame = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
  };
}

function setupHeroParticleMotes(container) {
  for (let i = 0; i < 22; i += 1) {
    const mote = document.createElement("span");
    mote.className = Math.random() > .58 ? "particle-cube" : "particle-node";
    mote.style.setProperty("--x", `${rand(44, 95)}%`);
    mote.style.setProperty("--y", `${rand(16, 84)}%`);
    mote.style.setProperty("--s", `${rand(5, 15)}px`);
    mote.style.setProperty("--rx", `${rand(-28, 28)}deg`);
    mote.style.setProperty("--ry", `${rand(-28, 28)}deg`);
    mote.style.setProperty("--rz", `${rand(-12, 18)}deg`);
    mote.style.setProperty("--d", `${rand(8, 18)}s`);
    mote.style.setProperty("--delay", `${rand(0, 5)}s`);
    container.appendChild(mote);
  }
}

function replayHuaCubes() {
  if (!huaCubeField || !window.gsap) return;
  const cubes = [...huaCubeField.querySelectorAll(".hua-cube")];
  if (!cubes.length) return;
  window.clearTimeout(huaAnimationTimer);
  window.gsap.killTweensOf(cubes);
  window.gsap.set(cubes, { transformPerspective: 900, transformOrigin: "50% 50%" });
  window.gsap.fromTo(cubes, {
    opacity: 0,
    x: () => rand(-520, 520),
    y: () => rand(-360, 360),
    z: () => rand(-80, 180),
    rotateX: () => rand(-64, 64),
    rotateY: () => rand(-64, 64),
    rotateZ: () => rand(-38, 38)
  }, {
    opacity: .96,
    x: 0,
    y: 0,
    z: 20,
    rotateX: (index, cube) => parseFloat(cube.style.getPropertyValue("--rx2")) || 0,
    rotateY: (index, cube) => parseFloat(cube.style.getPropertyValue("--ry2")) || 0,
    rotateZ: (index, cube) => parseFloat(cube.style.getPropertyValue("--rz2")) || 0,
    duration: 2.5,
    stagger: { amount: .72, from: "random" },
    ease: "power3.out"
  });
  huaAnimationTimer = window.setTimeout(() => {
    window.gsap.to(cubes, {
      y: () => rand(-2, 2),
      duration: () => rand(3.2, 5.8),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: { amount: 1.6, from: "random" }
    });
  }, 2600);
}

function replayHuaGlyph() {
  if (!homeHero || !huaGlyph) return;
  homeHero.classList.remove("is-visible");
  window.setTimeout(() => homeHero.classList.add("is-visible"), 80);
}

if (heroDust) {
  heroDust.replaceChildren();
}

if (huaCubeField) {
  huaCubeField.style.setProperty("--grid-size", huaGridSize);
  Array.from({ length: huaGridSize }).forEach((_, rowIndex) => {
    Array.from({ length: huaGridSize }).forEach((__, colIndex) => {
      if (!isHuaStroke(rowIndex, colIndex)) return;
      const cube = document.createElement("span");
      cube.className = "hua-cube";
      cube.style.gridColumn = `${colIndex + 1}`;
      cube.style.gridRow = `${rowIndex + 1}`;
      cube.style.setProperty("--sx", `${rand(-520, 520).toFixed(0)}px`);
      cube.style.setProperty("--sy", `${rand(-360, 360).toFixed(0)}px`);
      cube.style.setProperty("--rx", `${rand(-64, 64).toFixed(1)}deg`);
      cube.style.setProperty("--ry", `${rand(-64, 64).toFixed(1)}deg`);
      cube.style.setProperty("--rz", `${rand(-38, 38).toFixed(1)}deg`);
      cube.style.setProperty("--rx2", `${rand(-5, 5).toFixed(1)}deg`);
      cube.style.setProperty("--ry2", `${rand(-5, 5).toFixed(1)}deg`);
      cube.style.setProperty("--rz2", `${rand(-3, 5).toFixed(1)}deg`);
      cube.style.setProperty("--float", `${rand(-1.5, 1.5).toFixed(1)}px`);
      cube.style.setProperty("--delay", `${rand(.02, .86).toFixed(2)}s`);
      huaCubeField.appendChild(cube);
    });
  });

  huaCubeField.addEventListener("click", () => {
    homeHero?.classList.remove("is-visible");
    window.setTimeout(() => {
      homeHero?.classList.add("is-visible");
      replayHuaCubes();
    }, 120);
  });
  huaCubeField.addEventListener("pointermove", (event) => {
    huaCubeField.querySelectorAll(".hua-cube").forEach((cube) => {
      const rect = cube.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      cube.classList.toggle("is-near", Math.hypot(dx, dy) < 86);
    });
  });
  huaCubeField.addEventListener("pointerleave", () => {
    huaCubeField.querySelectorAll(".hua-cube.is-near").forEach((cube) => cube.classList.remove("is-near"));
  });
}

if (huaGlyph) {
  huaGlyph.addEventListener("click", replayHuaGlyph);
}

if (homeHero) {
  requestAnimationFrame(() => {
    homeHero.classList.add("is-visible");
    if (huaCubeField) replayHuaCubes();
  });
  const homeObserver = new IntersectionObserver(([entry]) => {
    homeHero.classList.toggle("is-visible", entry.isIntersecting);
    if (entry.isIntersecting && huaCubeField) replayHuaCubes();
  }, { threshold: 0.36 });
  homeObserver.observe(homeHero);
}

const countTargets = document.querySelectorAll("[data-count]");
if (countTargets.length) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = "true";
      const target = Number(entry.target.dataset.count || 0);
      const start = performance.now();
      const duration = 1300;
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = `${Math.round(target * eased)}+`;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: .4 });
  countTargets.forEach((item) => countObserver.observe(item));
}

if (sections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!active) return;
    navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${active.target.id}`));
  }, { rootMargin: "-38% 0px -52% 0px", threshold: [.1, .28, .5] });
  sections.forEach((section) => navObserver.observe(section));
}

function bindSearch(inputSelector, itemSelector, key) {
  const inputs = document.querySelectorAll(inputSelector);
  const items = document.querySelectorAll(itemSelector);
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const keyword = input.value.trim().toLowerCase();
      items.forEach((item) => {
        const text = (item.dataset[key] || item.textContent).toLowerCase();
        item.classList.toggle("is-hidden", keyword.length > 0 && !text.includes(keyword));
      });
    });
  });
}

bindSearch(".js-book-search", "[data-book]", "search");
bindSearch(".js-writer-search", "[data-writer-search]", "writerSearch");

const writerTrack = document.querySelector(".writer-wall");
const writerCarousel = document.querySelector(".writer-carousel");
const writerPrev = document.querySelector(".writer-prev");
const writerNext = document.querySelector(".writer-next");

function updateWriterNav() {
  if (!writerTrack || !writerCarousel) return;
  writerCarousel.classList.toggle("has-left", writerTrack.scrollLeft > 8);
}

function slideWriters(direction = 1) {
  if (!writerTrack) return;
  const amount = Math.max(260, writerTrack.clientWidth * 0.72);
  const nearEnd = writerTrack.scrollLeft + writerTrack.clientWidth >= writerTrack.scrollWidth - 8;
  const nearStart = writerTrack.scrollLeft <= 8;
  if (direction > 0 && nearEnd) writerTrack.scrollTo({ left: 0, behavior: "smooth" });
  else if (direction < 0 && nearStart) writerTrack.scrollTo({ left: writerTrack.scrollWidth, behavior: "smooth" });
  else writerTrack.scrollBy({ left: amount * direction, behavior: "smooth" });
  setTimeout(updateWriterNav, 240);
}

writerPrev?.addEventListener("click", () => slideWriters(-1));
writerNext?.addEventListener("click", () => slideWriters(1));

if (writerTrack) {
  let writerAuto = setInterval(() => slideWriters(1), 10000);
  updateWriterNav();
  writerTrack.addEventListener("scroll", updateWriterNav, { passive: true });
  writerTrack.addEventListener("pointerenter", () => clearInterval(writerAuto));
  writerTrack.addEventListener("pointerleave", () => {
    writerAuto = setInterval(() => slideWriters(1), 10000);
  });
}

const cartButton = document.querySelector(".cart-float");
if (false && cartButton) {
  const cartHost = cartButton.closest(".bookshop-section") || document.body;
  const cartPanel = document.createElement("aside");
  cartPanel.className = "cart-panel";
  cartPanel.innerHTML = `
    <h3>购书清单</h3>
    <p>先把想买的书放在这里，最后会连接 Google Form 下单。</p>
    <ol>
      <li>《教科书上的马华文学》</li>
      <li>《复始之地·乡土篇》</li>
    </ol>
    <a class="button dark" href="https://docs.google.com/forms/" target="_blank" rel="noopener">前往购书入口</a>
  `;
  cartHost.appendChild(cartPanel);
  cartButton.addEventListener("click", () => cartPanel.classList.toggle("is-open"));
}

if (cartButton) {
  const cartHost = cartButton.closest(".bookshop-section") || document.body;
  const cartCount = cartButton.querySelector("b");
  const cartItems = [];
  const GOOGLE_FORM_BASE = "https://docs.google.com/forms/d/e/FORM_ID/viewform";
  const FORM_ENTRY_BOOKS = "entry.1111111111";
  const FORM_ENTRY_TOTAL = "entry.2222222222";
  const cartPanel = document.createElement("aside");
  cartPanel.className = "cart-panel";
  cartHost.appendChild(cartPanel);

  function buildFormUrl() {
    const summary = cartItems.map((item) => `${item.title} x${item.qty} RM${item.price * item.qty}`).join("\n");
    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const url = new URL(GOOGLE_FORM_BASE);
    url.searchParams.set("usp", "pp_url");
    url.searchParams.set(FORM_ENTRY_BOOKS, summary || "尚未选择书籍");
    url.searchParams.set(FORM_ENTRY_TOTAL, `RM${total}`);
    return url.toString();
  }

  function renderCart() {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const count = cartItems.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = count;
    cartPanel.innerHTML = `
      <h3>购物清单</h3>
      <p>点击书本加入清单，网页先计算金额，再把书名和总额预填到 Google Form。</p>
      <ul class="cart-list">
        ${cartItems.length ? cartItems.map((item, index) => `
          <li><span>${item.title}<br><small>RM${item.price} x ${item.qty}</small></span><strong>RM${item.price * item.qty}</strong><button type="button" data-remove="${index}" aria-label="移除">-</button></li>
        `).join("") : "<li><span>还没有选择书籍</span><strong>RM0</strong></li>"}
      </ul>
      <div class="cart-total"><span>总额</span><b>RM${total}</b></div>
      <a class="button dark" href="${buildFormUrl()}" target="_blank" rel="noopener">前往购书入口</a>
    `;
  }

  document.querySelectorAll(".add-book").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-book]");
      if (!card) return;
      const title = card.dataset.title || card.querySelector("h3")?.textContent || "未命名书籍";
      const price = Number(card.dataset.price || 0);
      const existing = cartItems.find((item) => item.title === title);
      if (existing) existing.qty += 1;
      else cartItems.push({ title, price, qty: 1 });
      renderCart();
      cartPanel.classList.add("is-open");
    });
  });

  cartPanel.addEventListener("click", (event) => {
    const remove = event.target instanceof Element ? event.target.closest("[data-remove]") : null;
    if (!remove) return;
    const index = Number(remove.dataset.remove);
    const item = cartItems[index];
    if (!item) return;
    item.qty -= 1;
    if (item.qty <= 0) cartItems.splice(index, 1);
    renderCart();
  });

  renderCart();
  cartButton.addEventListener("click", () => cartPanel.classList.toggle("is-open"));
}

const modal = document.querySelector("#content-modal");
const modalArticle = modal?.querySelector(".modal-article");
const modalTitle = modal?.querySelector(".modal-title");
const modalDate = modal?.querySelector(".modal-date");
const modalKind = modal?.querySelector(".modal-kind");
const modalClose = modal?.querySelector(".modal-close");

const mediaClasses = ["book-media", "event-media", "course-media", "award-media", "talk-media"];

function mediaClass(index, preferred) {
  return index === 0 && preferred ? preferred : mediaClasses[index % mediaClasses.length];
}

function openArticleModal(trigger) {
  if (!modal || !modalArticle) return;
  const count = Math.min(Math.max(Number(trigger.dataset.gallery || 1), 1), 10);
  const paragraphs = (trigger.dataset.body || "").split("||").filter(Boolean);
  const cover = trigger.dataset.cover || "book-media";
  modalKind.textContent = trigger.dataset.kind === "event" ? "Event Report" : "News";
  modalTitle.textContent = trigger.dataset.title || "内容详情";
  modalDate.textContent = trigger.dataset.date || "";
  modalArticle.innerHTML = "";

  const coverImage = document.createElement("div");
  coverImage.className = `modal-cover ${cover}`;
  modalArticle.appendChild(coverImage);

  let imageIndex = 1;
  paragraphs.forEach((text, index) => {
    const p = document.createElement("p");
    p.textContent = text;
    modalArticle.appendChild(p);
    const shouldInsert = (index + 1) % 2 === 0 && imageIndex < count;
    if (shouldInsert) {
      const wrap = document.createElement("div");
      wrap.className = "modal-inline-images";
      for (let i = 0; i < 2 && imageIndex < count; i += 1) {
        const image = document.createElement("div");
        image.className = mediaClass(imageIndex, cover);
        wrap.appendChild(image);
        imageIndex += 1;
      }
      modalArticle.appendChild(wrap);
    }
  });

  if (paragraphs.length < 2 && count > 1) {
    const wrap = document.createElement("div");
    wrap.className = "modal-inline-images";
    while (imageIndex < count && wrap.children.length < 2) {
      const image = document.createElement("div");
      image.className = mediaClass(imageIndex, cover);
      wrap.appendChild(image);
      imageIndex += 1;
    }
    modalArticle.appendChild(wrap);
  }

  document.body.classList.add("modal-open");
  modal.showModal();
}

document.querySelectorAll(".js-open-modal").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.page) {
      window.location.href = button.dataset.page;
      return;
    }
    if (button.closest(".updates-section") && button.dataset.kind) {
      window.location.href = button.dataset.kind === "event" ? "events.html" : "news.html";
      return;
    }
    if (button.dataset.newTab === "true") {
      const payload = encodeURIComponent(JSON.stringify({
        kind: button.dataset.kind,
        title: button.dataset.title,
        date: button.dataset.date,
        gallery: button.dataset.gallery,
        cover: button.dataset.cover,
        body: button.dataset.body
      }));
      window.open(`updates-detail.html#${payload}`, "_blank", "noopener");
      return;
    }
    openArticleModal(button);
  });
});

function closeModal() {
  document.body.classList.remove("modal-open");
  modal?.close();
}

modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => {
  const rect = modal.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeModal();
});

if (document.body.classList.contains("detail-page") && location.hash.length > 1) {
  try {
    const data = JSON.parse(decodeURIComponent(location.hash.slice(1)));
    requestAnimationFrame(() => openArticleModal({ dataset: data }));
  } catch {
    // Keep the detail page readable even if the shared hash is invalid.
  }
}

const displayBooks = document.querySelectorAll(".display-book");
const museumBooks = document.querySelector(".museum-books");
const bookDetail = document.querySelector("#book-detail");
displayBooks.forEach((book) => {
  book.addEventListener("pointerenter", () => {
    museumBooks?.classList.add("is-hovering");
    displayBooks.forEach((item) => item.classList.remove("active"));
    book.classList.add("active");
    if (bookDetail) {
      const title = book.dataset.title || "马华文学电子图书馆";
      const desc = book.dataset.desc || "书影、作者、文类和阅读入口集中展示。";
      bookDetail.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;
    }
  });
});
museumBooks?.addEventListener("pointerleave", () => {
  museumBooks.classList.remove("is-hovering");
  displayBooks.forEach((item) => item.classList.remove("active"));
  if (bookDetail) bookDetail.innerHTML = "";
});

const ratingScore = document.querySelector(".js-rating-score");
const ratingHint = document.querySelector(".js-rating-hint");
document.querySelectorAll(".rating-stars button").forEach((button) => {
  button.addEventListener("click", () => {
    const rating = Number(button.dataset.rating || 5);
    if (ratingScore) ratingScore.textContent = rating.toFixed(1);
    if (ratingHint) ratingHint.textContent = `谢谢，你给了 ${rating} 星。`;
  });
});

const reviewInput = document.querySelector(".js-review-input");
document.querySelector(".js-review-submit")?.addEventListener("click", () => {
  if (!reviewInput) return;
  reviewInput.value = "";
  reviewInput.placeholder = "书评已提交示范。正式上线后会进入后台审核。";
});

const writerProfiles = {
  "pan-bihua": {
    name: "潘碧华",
    photo: "images/writer-pan-bihua.jpg",
    tags: ["散文", "学术研究", "马华文学", "作协会长"],
    intro: "潘碧华，1965 年生于马来西亚吉打州，马来亚大学中文系毕业，马大文学硕士，北京大学古代文学博士。曾任马来亚大学中文系副教授兼主任，并曾任马来西亚华文作家协会会长。研究领域包括中国古代诗词、马来西亚华文文学与华人文化；著有散文集《传火人》《我会在长城上想起你》《在北大看中国》等，也参与主编多种马华文学评论与作家研究书系。",
    source: "资料参考：大将文化作者页、马来亚大学中文系资料、作协理事会页面。",
    works: [
      ["《传火人》", "散文集 / 马华文学写作与文化记忆", "images/cover-course-archive.jpg"],
      ["《马华文学的时代记忆》", "学术专著 / 马华文学研究", "images/cover-nanyang-archive.jpg"],
      ["《马华作家评论100家》", "主编 / 作家评论资料", "images/cover-textbook.jpg"]
    ]
  },
  "dai-xiaohua": {
    name: "戴小华",
    photo: "images/writer-dai-xiaohua.jpg",
    tags: ["童诗", "儿童文学", "文化教育", "活动推广"],
    intro: "戴小华在这个 demo 中先作为童诗与儿童文学活动相关的写书人档案展示。正式资料库上线时，可以补入完整出生地、履历、出版书目、活动照片、获奖记录，以及与作协童诗活动、文学教育活动的关联。",
    source: "资料状态：公开资料不足，建议后续由作协后台补全正式作者履历。",
    works: [
      ["童诗创作活动", "关联：童诗、儿童文学教育", "images/cover-course-archive.jpg"],
      ["作协活动记录", "关联：Facebook 动态与活动报道", "images/cover-nanyang-archive.jpg"],
      ["作者档案待补", "后台可继续添加代表作与照片", "images/cover-textbook.jpg"]
    ]
  },
  "youjin": {
    name: "尤今",
    photo: "images/writer-youjin.webp",
    tags: ["小说", "散文", "游记", "新华文学"],
    intro: "尤今出生于马来西亚怡保，后迁居新加坡。她的写作涵盖短篇小说、长篇小说、游记与散文，作品以温暖、细腻、可读性强见称。公开资料显示，她长期为报刊写作，作品数量丰富，并曾获新加坡文化奖等重要荣誉。",
    source: "资料参考：尤今个人网站、香港作家联会作者简介、中国作家网相关访谈。",
    works: [
      ["旅行文学作品", "文类：游记 / 散文", "images/cover-nanyang-archive.jpg"],
      ["小说与小品文", "文类：小说 / 小品", "images/cover-course-archive.jpg"],
      ["教材选文", "关联：学校读本与文学教育", "images/cover-textbook.jpg"]
    ]
  },
  "liu-yulong": {
    name: "刘育龙",
    photo: "images/zuoxie-logo-cutout.png",
    tags: ["诗歌", "童诗", "理事", "活动档案"],
    intro: "刘育龙为马来西亚华文作家协会第 19 届理事会成员之一。此 demo 先以诗歌、童诗与活动档案作为资料切入点，后续可由后台补入完整作者照片、履历、作品列表和《导盲犬》等作品关联。",
    source: "资料参考：作协第 19 届理事会页面；作品关联待作协后台补全。",
    works: [
      ["《导盲犬》", "文类：童诗 / 诗歌，资料待核实补全", "images/cover-course-archive.jpg"],
      ["作协理事会档案", "第 19 届理事会成员", "images/cover-nanyang-archive.jpg"],
      ["活动报道", "可连接 Facebook 与资讯活动", "images/cover-textbook.jpg"]
    ]
  },
  "wu-yanling": {
    name: "伍燕翎",
    photo: "images/writer-wu-yanling.png",
    tags: ["文学评论", "教材", "马华文学", "中文教育"],
    intro: "伍燕翎为新纪元大学学院中文系教授、文学与社会科学院院长，研究方向包括中国古典小说、马来西亚华文文学与海外华文文学。她主编《华文教科书上的马华文学（国中篇）》，并长期从事马华文学研究、教学与文化书写。",
    source: "资料参考：新纪元大学学院教师资料、大将书行书籍资料、作协新书预购页面。",
    works: [
      ["《华文教科书上的马华文学（国中篇）》", "主编 / 马华文学教材阅读", "images/cover-textbook.jpg"],
      ["《写在家国之内》", "阅读札记 / 马华文学", "images/cover-nanyang-archive.jpg"],
      ["马华文学研究论文", "研究方向：文学史、现代性、教材", "images/cover-course-archive.jpg"]
    ]
  },
  "bicheng": {
    name: "碧澄",
    photo: "images/zuoxie-logo-cutout.png",
    tags: ["短篇小说", "马华文学", "文学史料", "新书推介"],
    intro: "碧澄为马华文学相关作者。作协原网页曾刊载“碧澄短篇小说自选集《过尽流波》推介”，约 300 位文学同好参与线上活动；作协会史资料也注明部分内容取自碧澄关于马来西亚华文作家的文章。",
    source: "资料参考：作协原网页《过尽流波》推介、关于作协会史页面。",
    works: [
      ["《过尽流波》", "短篇小说自选集", "images/cover-nanyang-archive.jpg"],
      ["马华作家史料文章", "关联：作协会史与资料库", "images/cover-course-archive.jpg"],
      ["活动报道", "线上新书推介与文学交流", "images/cover-textbook.jpg"]
    ]
  },
  "qinlin": {
    name: "秦林",
    photo: "images/zuoxie-logo-cutout.png",
    tags: ["现代诗", "狮城诗人", "纪念档案", "新华文学"],
    intro: "秦林为新加坡诗人。作协原网页曾发布“致哀：狮城诗人秦林逝世”，记录他于 2020 年 6 月逝世，消息在马新文艺圈传开。此页适合作为纪念型作者档案，串联诗作、悼文与文学史位置。",
    source: "资料参考：作协原网页“致哀：狮城诗人秦林逝世”。",
    works: [
      ["现代诗作品", "文类：现代诗，书目待补", "images/cover-course-archive.jpg"],
      ["纪念报道", "关联：作协悼文与文学圈记忆", "images/cover-nanyang-archive.jpg"],
      ["新华文学关联", "可连接研究资料与诗歌文类", "images/cover-textbook.jpg"]
    ]
  },
  young: {
    name: "青年作者",
    photo: "images/zuoxie-logo-cutout.png",
    tags: ["文学奖", "新生代", "短篇小说", "散文 / 新诗"],
    intro: "青年作者档案用于承接海鸥青年文学奖、新人作品、征稿与得奖作品。海鸥青年文学奖公开给年龄不超过 35 岁的大马公民参加，文类包括短篇小说、散文和新诗。",
    source: "资料参考：作协原网页“海鸥青年文学奖收件”。",
    works: [
      ["海鸥青年文学奖作品", "文类：小说 / 散文 / 新诗", "images/cover-course-archive.jpg"],
      ["新人作品库", "可作为后台投稿与作品展示入口", "images/cover-nanyang-archive.jpg"],
      ["金牌作者机制", "可由评分与书评长期累积产生", "images/cover-textbook.jpg"]
    ]
  }
};

const writerName = document.querySelector("[data-writer-name]");
if (writerName) {
  const params = new URLSearchParams(location.search);
  const profile = writerProfiles[params.get("writer") || "pan-bihua"] || writerProfiles["pan-bihua"];
  document.title = `${profile.name} | 写书人档案`;
  const photo = document.querySelector("[data-writer-photo]");
  const tags = document.querySelector("[data-writer-tags]");
  const intro = document.querySelector("[data-writer-intro]");
  const works = document.querySelector("[data-writer-works]");
  const source = document.querySelector("[data-writer-source]");
  writerName.textContent = profile.name;
  if (photo) {
    photo.src = profile.photo;
    photo.alt = `${profile.name}照片`;
  }
  if (tags) tags.innerHTML = profile.tags.map((tag) => `<span>${tag}</span>`).join("");
  if (intro) intro.textContent = profile.intro;
  if (works) {
    works.innerHTML = profile.works.map(([title, text, image]) => `
      <article class="work-item"><img src="${image}" alt="${title}"><h3>${title}</h3><p>${text}</p><a href="read-book.html">查看关联</a></article>
    `).join("");
  }
  if (source) source.textContent = profile.source;
}
