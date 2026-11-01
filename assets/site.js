(() => {
    const body = document.body;
    const toggle = document.querySelector("#language-toggle");
    const storageKey = "zixiong-language";

    if (!toggle) {
        return;
    }

    function applyLanguage(language, persist = true) {
        const useChinese = language === "zh";

        body.classList.toggle("en-mode", !useChinese);
        body.classList.toggle("zh-mode", useChinese);
        document.documentElement.lang = useChinese ? "zh-CN" : "en";

        toggle.setAttribute(
            "aria-label",
            useChinese ? "Switch language to English" : "切换到中文"
        );
        toggle.title = useChinese ? "Switch to English" : "切换到中文";

        if (persist) {
            try {
                localStorage.setItem(storageKey, useChinese ? "zh" : "en");
            } catch {
                // Language switching still works when storage is unavailable.
            }
        }
    }

    try {
        const savedLanguage = localStorage.getItem(storageKey);
        if (savedLanguage === "zh" || savedLanguage === "en") {
            applyLanguage(savedLanguage, false);
        }
    } catch {
        // Storage can be disabled by browser privacy settings.
    }

    toggle.addEventListener("click", () => {
        applyLanguage(body.classList.contains("zh-mode") ? "en" : "zh");
    });
})();
