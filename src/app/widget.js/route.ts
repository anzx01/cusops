export const dynamic = "force-static";

const widgetSource = `
(function () {
  if (window.__CUSOPS_WIDGET_LOADED__) return;
  window.__CUSOPS_WIDGET_LOADED__ = true;

  var script = document.currentScript;
  if (!script) return;

  var channel = script.getAttribute("data-channel") || "demo-web-chat";
  var color = script.getAttribute("data-color") || "#155EEF";
  var label = script.getAttribute("data-label") || "在线咨询";
  var baseUrl = new URL(script.src).origin;

  var style = document.createElement("style");
  style.textContent = [
    ".cusops-widget-button{position:fixed;right:20px;bottom:20px;z-index:2147483646;min-width:112px;height:44px;border:0;border-radius:8px;background:" + color + ";color:#fff;font:600 14px system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 12px 30px rgba(15,23,42,.22);cursor:pointer}",
    ".cusops-widget-panel{position:fixed;right:20px;bottom:76px;z-index:2147483646;width:min(390px,calc(100vw - 32px));height:min(620px,calc(100vh - 110px));display:none;overflow:hidden;border:1px solid #d9dee8;border-radius:8px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.24)}",
    ".cusops-widget-panel[data-open='true']{display:block}",
    ".cusops-widget-close{position:absolute;right:8px;top:8px;z-index:2;width:32px;height:32px;border:1px solid #d9dee8;border-radius:8px;background:#fff;color:#172033;font:700 16px system-ui;cursor:pointer}",
    ".cusops-widget-frame{width:100%;height:100%;border:0;background:#fff}",
    "@media(max-width:520px){.cusops-widget-button{right:12px;bottom:12px}.cusops-widget-panel{right:0;bottom:0;width:100vw;height:100vh;border-radius:0}}"
  ].join("");
  document.head.appendChild(style);

  var panel = document.createElement("div");
  panel.className = "cusops-widget-panel";
  panel.setAttribute("data-open", "false");

  var close = document.createElement("button");
  close.className = "cusops-widget-close";
  close.type = "button";
  close.setAttribute("aria-label", "关闭聊天");
  close.textContent = "×";

  var iframe = document.createElement("iframe");
  iframe.className = "cusops-widget-frame";
  iframe.title = "AI接待员聊天窗口";
  iframe.loading = "lazy";
  iframe.src = baseUrl + "/chat/" + encodeURIComponent(channel) + "?embed=1";

  var button = document.createElement("button");
  button.className = "cusops-widget-button";
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.textContent = label;

  function setOpen(open) {
    panel.setAttribute("data-open", open ? "true" : "false");
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }

  button.addEventListener("click", function () {
    setOpen(panel.getAttribute("data-open") !== "true");
  });
  close.addEventListener("click", function () {
    setOpen(false);
  });

  panel.appendChild(close);
  panel.appendChild(iframe);
  document.body.appendChild(panel);
  document.body.appendChild(button);
})();
`;

export function GET() {
  return new Response(widgetSource, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
