/* DualPen Books - misurazione visite e clic WhatsApp con MODALITA' CONSENSO di Google (Consent Mode v2).
   ONLINE. Impostazione decisa da Stefano il 24/07/2026 dopo parere legale (rischio giudicato bassissimo).

   COME FUNZIONA ORA (STRICT = false):
   - Il tag Google si carica SEMPRE, ma parte in stato "consenso NEGATO" (default).
     In stato negato NON scrive cookie e NON usa identificatori: invia a Google solo
     un segnale anonimo e aggregato. Cosi' le visite e i clic sul pulsante WhatsApp
     vengono misurati per TUTTI, non solo per chi accetta, e Google Ads riceve il
     segnale di conversione (utile allo Smart Bidding).
   - Il banner NON e' piu' un cancello "accetti / rifiuti": e' un semplice avviso
     informativo che si chiude con "OK". Nessun cookie viene comunque scritto.

   PER TORNARE INDIETRO: rimettere STRICT = true qui sotto -> in stato negato non parte
   NULLA verso Google finche' l'utente non da' un consenso esplicito. */

(function () {
  var CID  = "AW-18323732686";
  var GA4  = "G-K3HBMFHEZS";
  var SEND = "AW-18323732686/M_s0CPq5_9McEM7xt6FE";
  var KEY  = "dp_notice";

  // false: misura anonima (senza cookie) per tutti, banner informativo. [impostazione attuale]
  // true:  nessun invio a Google senza consenso esplicito (banner a scelta).
  var STRICT = false;

  var lang = (document.documentElement.lang || "it").slice(0, 2).toLowerCase();
  var TXT = {
    it: { msg: "Misuriamo in forma anonima le visite e i clic sul pulsante WhatsApp, senza cookie di profilazione.", ok: "OK", more: "Privacy", priv: "/privacy/" },
    en: { msg: "We anonymously measure visits and clicks on the WhatsApp button, with no profiling cookies.", ok: "OK", more: "Privacy", priv: "/en/privacy/" },
    fr: { msg: "Nous mesurons de façon anonyme les visites et les clics sur le bouton WhatsApp, sans cookies de profilage.", ok: "OK", more: "Confidentialité", priv: "/fr/confidentialite/" },
    de: { msg: "Wir messen anonym die Besuche und Klicks auf die WhatsApp-Schaltfläche, ohne Profiling-Cookies.", ok: "OK", more: "Datenschutz", priv: "/de/datenschutz/" },
    es: { msg: "Medimos de forma anónima las visitas y los clics en el botón de WhatsApp, sin cookies de perfilado.", ok: "OK", more: "Privacidad", priv: "/es/privacidad/" }
  };
  var t = TXT[lang] || TXT.it;

  // gtag stub: accoda i comandi finche' lo script vero non e' pronto.
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function noticeShown() { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function markNotice() { try { localStorage.setItem(KEY, "1"); } catch (e) {} }

  // 1) Stato di consenso DI DEFAULT (negato): niente cookie, solo segnale anonimo/aggregato.
  gtag("consent", "default", {
    ad_storage:         "denied",
    ad_user_data:       "denied",
    ad_personalization: "denied",
    analytics_storage:  "denied",
    wait_for_update:    500
  });

  // 2) Carica il tag Google. In STRICT non si carica finche' non c'e' consenso esplicito.
  var loaded = false;
  function loadGtag() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + CID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", CID, { url_passthrough: true });
    gtag("config", GA4);
  }
  if (!STRICT) loadGtag();

  // Contatore esatto e anonimo (GoatCounter, senza cookie): conta le visite in automatico.
  (function loadGoat() {
    var g = document.createElement("script");
    g.async = true;
    g.setAttribute("data-goatcounter", "https://dualpen.goatcounter.com/count");
    g.src = "https://gc.zgo.at/count.js";
    document.head.appendChild(g);
  })();

  // 3) Clic sul pulsante WhatsApp: conta la conversione (anonima/modellata in stato negato).
  var wa = document.getElementById("wa");
  if (wa) {
    wa.addEventListener("click", function () {
      // GoatCounter: conteggio esatto e anonimo del clic, indipendente da Google.
      if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "wa-click", title: "Clic WhatsApp", event: true });
      if (STRICT) return; // in strict, senza consenso non si invia a Google
      if (!loaded) loadGtag();
      gtag("event", "conversion", { send_to: SEND, value: 1.0, currency: "EUR" });
    });
  }

  // 4) Avviso informativo: compare una sola volta, si chiude con OK. Nessun cookie coinvolto.
  if (!noticeShown()) showNotice();

  function showNotice() {
    var bar = document.createElement("div");
    bar.setAttribute("role", "note");
    bar.setAttribute("aria-live", "polite");
    bar.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#26221c;color:#f5f0e4;padding:14px 18px;font-family:Helvetica,Arial,sans-serif;font-size:.92rem;line-height:1.4;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:center;box-shadow:0 -2px 12px rgba(0,0,0,.25)";

    var msg = document.createElement("span");
    msg.textContent = t.msg;
    msg.style.cssText = "max-width:660px";

    var link = document.createElement("a");
    link.href = t.priv;
    link.textContent = t.more;
    link.style.cssText = "color:#c9a45c;text-decoration:underline;white-space:nowrap";

    var ok = document.createElement("button");
    ok.type = "button";
    ok.textContent = t.ok;
    ok.style.cssText = "background:#c9a45c;color:#26221c;border:0;border-radius:5px;padding:9px 22px;font-size:.92rem;font-weight:bold;cursor:pointer";

    ok.addEventListener("click", function () { markNotice(); bar.parentNode && bar.parentNode.removeChild(bar); });

    bar.appendChild(msg);
    bar.appendChild(link);
    bar.appendChild(ok);
    (document.body || document.documentElement).appendChild(bar);
  }
})();
