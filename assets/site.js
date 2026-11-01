(() => {
    const body = document.body;
    const nav = document.querySelector("#site-nav");
    const menu = document.querySelector("#site-menu");
    const menuToggle = document.querySelector("#menu-toggle");
    const menuToggleLabel = menuToggle?.querySelector(".menu-toggle-label");
    const languageToggle = document.querySelector("#language-toggle");
    const storageKey = "zixiong-language";

    function isChinese() {
        return body.classList.contains("zh-mode");
    }

    function syncMenuLabel() {
        if (!menuToggle || !menu) {
            return;
        }

        const isOpen = nav.classList.contains("menu-open");
        const chinese = isChinese();

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            chinese ? (isOpen ? "关闭菜单" : "打开菜单") : isOpen ? "Close menu" : "Open menu"
        );

        if (menuToggleLabel) {
            menuToggleLabel.textContent = chinese ? "菜单" : "Menu";
        }
    }

    function setMenu(open) {
        if (!nav || !menuToggle) {
            return;
        }

        nav.classList.toggle("menu-open", open);
        body.classList.toggle("menu-open", open);
        syncMenuLabel();
    }

    function applyLanguage(language, persist = true) {
        const chinese = language === "zh";

        body.classList.toggle("en-mode", !chinese);
        body.classList.toggle("zh-mode", chinese);
        document.documentElement.lang = chinese ? "zh-CN" : "en";

        nav?.setAttribute("aria-label", chinese ? "主导航" : "Main navigation");

        if (languageToggle) {
            languageToggle.setAttribute(
                "aria-label",
                chinese ? "Switch language to English" : "切换到中文"
            );
            languageToggle.title = chinese ? "Switch to English" : "切换到中文";
        }

        syncMenuLabel();

        if (persist) {
            try {
                localStorage.setItem(storageKey, chinese ? "zh" : "en");
            } catch {
                // Language switching still works when storage is unavailable.
            }
        }
    }

    if (languageToggle) {
        languageToggle.addEventListener("click", () => {
            applyLanguage(isChinese() ? "en" : "zh");
        });

        try {
            const savedLanguage = localStorage.getItem(storageKey);
            if (savedLanguage === "zh" || savedLanguage === "en") {
                applyLanguage(savedLanguage, false);
            }
        } catch {
            // Storage can be disabled by browser privacy settings.
        }
    }

    if (nav && menuToggle) {
        menuToggle.addEventListener("click", () => {
            setMenu(!nav.classList.contains("menu-open"));
        });

        menu?.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setMenu(false));
        });

        document.addEventListener("click", (event) => {
            if (nav.classList.contains("menu-open") && !nav.contains(event.target)) {
                setMenu(false);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && nav.classList.contains("menu-open")) {
                setMenu(false);
                menuToggle.focus();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                setMenu(false);
            }
        });

        function updateNav() {
            nav.classList.toggle("is-scrolled", window.scrollY > 28);
        }

        updateNav();
        window.addEventListener("scroll", updateNav, { passive: true });
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = document.querySelectorAll("[data-reveal]");

    if (!reduceMotion && "IntersectionObserver" in window && revealItems.length) {
        body.classList.add("reveal-ready");

        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.14,
                rootMargin: "0px 0px -5% 0px",
            }
        );

        revealItems.forEach((item) => revealObserver.observe(item));
    }
})();
