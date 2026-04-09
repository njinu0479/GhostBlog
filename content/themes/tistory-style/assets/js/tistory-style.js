function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

function normalizeTagLabel(label) {
  if (!label) return;
  if (label.textContent.includes(" - ")) {
    label.textContent = label.textContent.replace(" - ", " / ");
  }
  if (label.textContent.trim().startsWith("-")) {
    label.textContent = label.textContent.trim().slice(1).trim();
  }
}

onReady(() => {
  // Sidebar tag navigation: build parent/child view
  const navUl = document.querySelector(".widget ul.nav");
  if (navUl) {
    const customOrder = [];

    const items = Array.from(navUl.querySelectorAll("li"));
    const tagData = [];

    for (const item of items) {
      if (item.classList.contains("tag-item-all")) continue;

      const nameSpan = item.querySelector(".tag-name");
      const countSpan = item.querySelector(".post-count");
      const originalText = (nameSpan ? nameSpan.innerText : item.innerText).trim();
      const countText = countSpan ? countSpan.innerText.trim() : "";

      const linkEl = item.querySelector("a");
      const link = linkEl ? linkEl.getAttribute("href") : "#";

      let parent = originalText;
      let child = null;

      if (originalText.includes(" - ")) {
        [parent, child] = originalText.split(" - ").map((s) => s.trim());
      }

      tagData.push({ parent, child, countText, link, originalText });
    }

    const allParents = Array.from(new Set(tagData.map((d) => d.parent)));
    allParents.sort((a, b) => {
      let indexA = customOrder.indexOf(a);
      let indexB = customOrder.indexOf(b);
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;
      return indexA !== indexB ? indexA - indexB : a.localeCompare(b);
    });

    const allViewItem = navUl.querySelector(".tag-item-all");
    navUl.innerHTML = "";
    if (allViewItem) navUl.appendChild(allViewItem);

    for (const pName of allParents) {
      const parentTag = tagData.find((d) => d.originalText === pName);
      const pLi = document.createElement("li");
      pLi.className = "tag-item";

      const parentHref = parentTag ? parentTag.link : "#";
      const parentCount = parentTag ? parentTag.countText : "";
      const parentPointerEvents = parentTag ? "" : "pointer-events:none;";

      pLi.innerHTML = `
        <a href="${parentHref}" style="${parentPointerEvents} display:flex; justify-content:flex-start; align-items:center; gap:4px; padding: 4px 0 0 0;">
          <span class="tag-name" style="font-weight:500; color:#333;">${pName}</span>
          ${
            parentTag
              ? `<span class="post-count" style="font-size:10px; color:#bbb;">${parentCount}</span>`
              : ""
          }
        </a>`;
      navUl.appendChild(pLi);

      const children = tagData.filter((d) => d.parent === pName && d.child);
      children.sort((a, b) => a.child.localeCompare(b.child));

      for (const c of children) {
        const cLi = document.createElement("li");
        cLi.className = "tag-item";
        cLi.innerHTML = `
          <a href="${c.link}" style="display:flex; justify-content:flex-start; align-items:center; gap:4px; padding: 1px 0 1px 16px;">
            <span class="tag-name" style="font-size:11px; color:#888; font-weight:normal;">- ${c.child}</span>
            <span class="post-count" style="font-size:10px; color:#bbb;">${c.countText}</span>
          </a>`;
        navUl.appendChild(cLi);
      }
    }
  }

  // Calendar highlight days where posts exist
  const postDatesRaw = document.getElementById("ghost-post-dates");
  const postDates = postDatesRaw
    ? JSON.parse(postDatesRaw.textContent || "[]")
    : [];

  const calBody = document.getElementById("cal-body");
  const calYearMonth = document.getElementById("cal-year-month");
  if (calBody && calYearMonth) {
    let today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();

    function renderCalendar(year, month) {
      calBody.innerHTML = "";
      calYearMonth.textContent = `${year}.${String(month + 1).padStart(2, "0")}`;

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      let date = 1;
      for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
          const cell = document.createElement("td");
          cell.style.padding = "1px 0";

          if (i === 0 && j < firstDay) {
            cell.textContent = "";
          } else if (date > daysInMonth) {
            break;
          } else {
            const formattedDate = `${year}-${String(month + 1).padStart(
              2,
              "0",
            )}-${String(date).padStart(2, "0")}`;

            cell.textContent = String(date);
            if (postDates.includes(formattedDate)) {
              cell.style.fontWeight = "700";
              cell.style.color = "#111";
              cell.style.textDecoration = "underline";
            } else {
              cell.style.fontWeight = "400";
              cell.style.color = "#bbb";
            }

            date++;
          }

          row.appendChild(cell);
        }
        calBody.appendChild(row);
        if (date > daysInMonth) break;
      }
    }

    renderCalendar(currentYear, currentMonth);

    const prev = document.getElementById("cal-prev");
    const next = document.getElementById("cal-next");

    if (prev) {
      prev.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
      });
    }

    if (next) {
      next.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
      });
    }
  }

  // Replace " - " with " / " for labels on list and tag pages
  document.querySelectorAll(".tag-label").forEach(normalizeTagLabel);
  normalizeTagLabel(document.querySelector(".category-title"));

  // Post page: normalize category label
  const catTag = document.getElementById("post-category");
  if (catTag && catTag.innerText.includes(" - ")) {
    catTag.innerText = catTag.innerText.replace(" - ", " / ");
  }

  // Umami tracking (skip local/admin)
  const isExcluded =
    window.location.hostname === "100.111.122.127" ||
    window.location.hostname === "localhost" ||
    localStorage.getItem("ignore-me") === "true";

  if (!isExcluded) {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = "https://umami.njinu.kr/script.js";
    script.setAttribute(
      "data-website-id",
      "0e15d6b5-6ba4-425f-9dc5-099da99621f0",
    );
    document.head.appendChild(script);
  }

  async function fetchUmamiV3Stats() {
    const shareId = "I69QL78nSlMXoRYi";
    try {
      const shareRes = await fetch(`https://umami.njinu.kr/api/share/${shareId}`);
      if (!shareRes.ok) throw new Error("Share ID 인증 실패");

      const shareData = await shareRes.json();
      const { websiteId, token } = shareData;

      const statsBaseUrl = `https://umami.njinu.kr/api/websites/${websiteId}/stats`;
      const headers = { "x-umami-share-token": token };

      const now = Date.now();
      const todayStart = new Date().setHours(0, 0, 0, 0);
      const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

      const [totalRes, todayRes, yesterdayRes] = await Promise.all([
        fetch(`${statsBaseUrl}?startAt=0&endAt=${now}`, { headers }),
        fetch(`${statsBaseUrl}?startAt=${todayStart}&endAt=${now}`, { headers }),
        fetch(`${statsBaseUrl}?startAt=${yesterdayStart}&endAt=${todayStart}`, {
          headers,
        }),
      ]);

      const total = await totalRes.json();
      const today = await todayRes.json();
      const yesterday = await yesterdayRes.json();

      const getViewCount = (data) => data?.pageviews?.value ?? data?.pageviews ?? 0;

      const totalEl = document.getElementById("umami-total");
      const todayEl = document.getElementById("umami-today");
      const yesterdayEl = document.getElementById("umami-yesterday");

      if (totalEl) totalEl.innerText = getViewCount(total).toLocaleString();
      if (todayEl) todayEl.innerText = getViewCount(today).toLocaleString();
      if (yesterdayEl)
        yesterdayEl.innerText = getViewCount(yesterday).toLocaleString();
    } catch (e) {
      // Intentionally silent in production UI; keep console for debugging.
      // eslint-disable-next-line no-console
      console.error("데이터 로드 실패:", e);
    }
  }

  fetchUmamiV3Stats();
  setInterval(fetchUmamiV3Stats, 60_000);
});

