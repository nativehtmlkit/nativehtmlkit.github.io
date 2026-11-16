/* Hover menus for the top tabs: each tab shows its section's sub-pages (two levels), built from
   the site's own navigation tree so it always matches the sidebar. */
(function () {
  function label(li) {
    var el = li.querySelector(":scope > a.md-nav__link .md-ellipsis, :scope > .md-nav__container > a.md-nav__link .md-ellipsis, :scope > label.md-nav__link .md-ellipsis, :scope > .md-nav__link .md-ellipsis");
    return el ? el.textContent.trim() : "";
  }
  function href(li) {
    var a = li.querySelector(":scope > a.md-nav__link, :scope > .md-nav__container > a.md-nav__link");
    return a ? a.getAttribute("href") : null;
  }
  function children(li) {
    var ul = li.querySelector(":scope > nav > .md-nav__list");
    return ul ? Array.prototype.filter.call(ul.children, function (c) { return c.tagName === "LI"; }) : [];
  }
  function link(text, url, cls) {
    var node = document.createElement(url ? "a" : "span");
    if (url) node.href = url;
    node.className = cls;
    node.textContent = text;
    return node;
  }
  function build() {
    var tabs = document.querySelectorAll(".md-tabs__item");
    var top = document.querySelectorAll(".md-nav--primary > .md-nav__list > .md-nav__item");
    Array.prototype.forEach.call(tabs, function (tab, i) {
      if (tab.querySelector(".nhk-dd") || !top[i]) return;
      var groups = children(top[i]);
      if (!groups.length) return;
      var dd = document.createElement("div");
      dd.className = "nhk-dd";
      var loose = document.createElement("div");
      loose.className = "nhk-dd__col";
      groups.forEach(function (g) {
        var sub = children(g);
        if (!sub.length) {                       // plain page directly under the section
          var t = label(g);
          if (t) loose.appendChild(link(t, href(g), "nhk-dd__link"));
          return;
        }
        var col = document.createElement("div");
        col.className = "nhk-dd__col";
        col.appendChild(link(label(g), href(g), "nhk-dd__head"));
        sub.forEach(function (s) {
          var t = label(s);
          if (t) col.appendChild(link(t, href(s) || href(children(s)[0] || s), "nhk-dd__link"));
        });
        dd.appendChild(col);
      });
      if (loose.children.length) dd.insertBefore(loose, dd.firstChild);
      tab.appendChild(dd);
      tab.classList.add("nhk-has-dd");
    });
  }
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(build);
  } else if (document.readyState !== "loading") {
    build();
  } else {
    document.addEventListener("DOMContentLoaded", build);
  }
})();
