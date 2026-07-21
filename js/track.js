/* DualPen Books - misurazione clic WhatsApp con consenso.
   Il tag Google viene caricato SOLO dopo l'accettazione dell'utente.
   Se l'utente rifiuta o non sceglie, nessun cookie e nessun tag. */
(function () {
  var CID = "AW-18323732686";
  var SEND = "AW-18323732686/M_s0CPq5_9McEM7xt6FE";
  var KEY = "dp_consent";

  var lang = (document.documentElement.lang || "it").slice(0, 2).toLowerCase();
  var TXT = {
    it: { msg: "Usiamo un solo cookie di Google per misurare i clic sul pulsante WhatsApp. Lo accetti?", ok: "Accetto", no: "Rifiuto", more: "Privacy", priv: "/privacy/" },
    en: { msg: "We use a single Google cookie to measure clicks on the WhatsApp button. Do you accept?", ok: "Accept", no: "Decline", more: "Privacy", priv: "/en/privacy/" },
    fr: { msg: "Nous utilisons un seul cookie Google pour mesurer les clics sur le bouton WhatsApp. Acceptez-vous ?", ok: "Accepter", no: "Refuser", more: "Confidentialité", priv: "/fr/confidentialite/" },
    de: { msg: "Wir verwenden ein einziges Google-Cookie, um Klicks auf die WhatsApp-Schaltfläche zu messen. Sind Sie einverstanden?", ok: "Akzeptieren", no: "Ablehnen", more: "Datenschutz", priv: "/de/datenschutz/" },
    es: { msg: "Usamos una sola cookie de Google para medir los clics en el botón de WhatsApp. ¿Acepta?", ok: "Aceptar", no: "Rechazar", more: "Privacidad", priv: "/es/privacidad/" }
  };
  var t = TXT[lang] || TXT.it;

  function loadGtag() {
    if (window.__dpGtagLoaded) return;
    window.__dpGtagLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + CID;
    document.head.appendChild(s);
    window.gtag("js", new Date());
    window.gtag("config", CID);
  }

  function fireConversion() {
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", { send_to: SEND, value: 1.0, currency: "EUR" });
    }
  }

  function readConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function writeConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var consent = readConsent();
  if (consent === "yes") loadGtag();

  // Aggancia il clic sul pulsante WhatsApp: la conversione parte solo col consenso.
  var wa = document.getElementById("wa");
  if (wa) {
    wa.addEventListener("click", function () {
      if (readConsent() === "yes") fireConversion();
    });
  }

  if (!consent) showBanner();

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

    ok.addEventListener("click", function () { writeConsent("yes"); loadGtag(); bar.parentNode && bar.parentNode.removeChild(bar); });
    no.addEventListener("click", function () { writeConsent("no"); bar.parentNode && bar.parentNode.removeChild(bar); });

    bar.appendChild(msg);
    bar.appendChild(link);
    bar.appendChild(ok);
    bar.appendChild(no);
    (document.body || document.documentElement).appendChild(bar);
  }
})();
