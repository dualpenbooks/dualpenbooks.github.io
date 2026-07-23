/* DualPen Books - misurazione clic WhatsApp con MODALITA' CONSENSO di Google (Consent Mode v2).
   PROPOSTA da rivedere col legale prima di pubblicare. Non ancora online.

   Differenza rispetto alla versione attuale:
   - PRIMA: il tag Google si caricava SOLO dopo "Accetto". Quasi nessuno accetta,
     quindi non veniva misurato quasi niente (contatore fermo a 0 con 160 visite).
   - ADESSO: il tag si carica sempre, ma parte in stato "consenso NEGATO" (default).
     In stato negato Google NON scrive cookie e NON usa identificatori: manda solo
     un segnale anonimo e aggregato (conversione "modellata"). Se l'utente clicca
     "Accetto", il consenso passa a "concesso" e la misura diventa piena (con cookie).
   - Il clic sul pulsante WhatsApp viene quindi contato in entrambi gli stati.

   >>> PUNTO PER IL LEGALE: in stato "negato" il tag invia comunque a Google un segnale
       anonimo e senza cookie. E' il meccanismo standard della modalita' consenso, ma
       e' anche il punto che va approvato. Se il legale preferisce "nessun dato a Google
       finche' l'utente non accetta", mettere STRICT = true qui sotto: in quel caso in
       stato negato non parte NULLA (identico alla filosofia attuale, ma col tag gia'
       pronto a scattare appena si accetta). */

(function () {
  var CID  = "AW-18323732686";
  var GA4  = "G-K3HBMFHEZS";
  var SEND = "AW-18323732686/M_s0CPq5_9McEM7xt6FE";
  var KEY  = "dp_consent";

  // Se true: in stato "negato" non si invia NULLA a Google (scelta piu' prudente).
  // Se false: modalita' consenso piena con conversioni modellate anche senza consenso.
  var STRICT = true;

  var lang = (document.documentElement.lang || "it").slice(0, 2).toLowerCase();
  var TXT = {
    it: { msg: "Usiamo i cookie di Google per misurare le visite e i clic sul pulsante WhatsApp. Li accetti?", ok: "Accetto", no: "Rifiuto", more: "Privacy", priv: "/privacy/" },
    en: { msg: "We use Google cookies to measure visits and clicks on the WhatsApp button. Do you accept?", ok: "Accept", no: "Decline", more: "Privacy", priv: "/en/privacy/" },
    fr: { msg: "Nous utilisons des cookies Google pour mesurer les visites et les clics sur le bouton WhatsApp. Acceptez-vous ?", ok: "Accepter", no: "Refuser", more: "Confidentialité", priv: "/fr/confidentialite/" },
    de: { msg: "Wir verwenden Google-Cookies, um Besuche und Klicks auf die WhatsApp-Schaltfläche zu messen. Sind Sie einverstanden?", ok: "Akzeptieren", no: "Ablehnen", more: "Datenschutz", priv: "/de/datenschutz/" },
    es: { msg: "Usamos cookies de Google para medir las visitas y los clics en el botón de WhatsApp. ¿Acepta?", ok: "Aceptar", no: "Rechazar", more: "Privacidad", priv: "/es/privacidad/" }
  };
  var t = TXT[lang] || TXT.it;

  // gtag stub: accoda i comandi finche' lo script vero non e' pronto.
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function readConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function writeConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var saved = readConsent(); // "yes" | "no" | null
  var granted = (saved === "yes");

  // 1) Stato di consenso DI DEFAULT, impostato PRIMA di caricare il tag.
  gtag("consent", "default", {
    ad_storage:         granted ? "granted" : "denied",
    ad_user_data:       granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
    analytics_storage:  granted ? "granted" : "denied",
    wait_for_update:    500
  });

  // 2) In modalita' STRICT non si carica il tag finche' non c'e' consenso esplicito.
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
  if (!STRICT || granted) loadGtag();

  // 3) Clic sul pulsante WhatsApp: conta la conversione (piena se consenso, modellata se negato).
  var wa = document.getElementById("wa");
  if (wa) {
    wa.addEventListener("click", function () {
      if (STRICT && readConsent() !== "yes") return; // in strict, senza consenso non si invia
      if (!loaded) loadGtag();
      gtag("event", "conversion", { send_to: SEND, value: 1.0, currency: "EUR" });
    });
  }

  // 4) Banner: compare solo se l'utente non ha ancora scelto.
  if (!saved) showBanner();

  function grantAll() {
    gtag("consent", "update", {
      ad_storage: "granted", ad_user_data: "granted",
      ad_personalization: "granted", analytics_storage: "granted"
    });
    loadGtag();
  }

  function showBanner() {
    var bar = document.createElement("div");
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-live", "polite");
    bar.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#26221c;color:#f5f0e4;padding:14px 18px;font-family:Helvetica,Arial,sans-serif;font-size:.92rem;line-height:1.4;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:center;box-shadow:0 -2px 12px rgba(0,0,0,.25)";

    var msg = document.createElement("span");
    msg.textContent = t.msg;
    msg.style.cssText = "max-width:620px";

    var link = document.createElement("a");
    link.href = t.priv;
    link.textContent = t.more;
    link.style.cssText = "color:#c9a45c;text-decoration:underline;white-space:nowrap";

    var ok = document.createElement("button");
    ok.type = "button";
    ok.textContent = t.ok;
    ok.style.cssText = "background:#c9a45c;color:#26221c;border:0;border-radius:5px;padding:9px 22px;font-size:.92rem;font-weight:bold;cursor:pointer";

    var no = document.createElement("button");
    no.type = "button";
    no.textContent = t.no;
    no.style.cssText = "background:transparent;color:#f5f0e4;border:1px solid #6e675c;border-radius:5px;padding:9px 22px;font-size:.92rem;cursor:pointer";

    ok.addEventListener("click", function () { writeConsent("yes"); grantAll(); bar.parentNode && bar.parentNode.removeChild(bar); });
    no.addEventListener("click", function () { writeConsent("no"); bar.parentNode && bar.parentNode.removeChild(bar); });

    bar.appendChild(msg);
    bar.appendChild(link);
    bar.appendChild(ok);
    bar.appendChild(no);
    (document.body || document.documentElement).appendChild(bar);
  }
})();
