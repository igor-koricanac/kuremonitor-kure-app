"use strict";(self.webpackChunkkuremonitor_kure_app=self.webpackChunkkuremonitor_kure_app||[]).push([[462],{462(e,t,n){n.r(t),n.d(t,{default:()=>g});var r=n(959),o=n.n(r),a=n(558),i=n(7),l=n(89),s=n(531);function c(e,t,n,r,o,a,i){try{var l=e[a](i),s=l.value}catch(e){return void n(e)}l.done?t(s):Promise.resolve(s).then(r,o)}function d(e){return function(){var t=this,n=arguments;return new Promise(function(r,o){var a=e.apply(t,n);function i(e){c(a,r,o,i,l,"next",e)}function l(e){c(a,r,o,i,l,"throw",e)}i(void 0)})}}function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){u(e,t,n[t])})}return e}function f(e,t){return t=null!=t?t:{},Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):function(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}(Object(t)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}),e}const m="/api/plugin-proxy/kuremonitor-kure-app/proxy",h="s5Wsb8fuRooCKC6PLNmXsW3Ku36nQ4V-8Svtc8kaA-4=";function g(e){const t=(0,i.useStyles2)(v),[n,l]=(0,r.useState)("failures"),[c,u]=(0,r.useState)([]),[g,y]=(0,r.useState)(!1),[b,x]=(0,r.useState)(null),[k,E]=(0,r.useState)({}),[C,w]=(0,r.useState)({}),[O,P]=(0,r.useState)(""),[S,_]=(0,r.useState)(!1),j=(0,r.useRef)(null),I=(0,r.useMemo)(()=>b&&k[b]?k[b]:[],[b,k]),$=!!b&&c.some(e=>e.pod_name===b),N=!b||!$;let T="Select a pod from the left pane...";b&&(T=$?"Ask a question...":"Pod resolved/deleted (Chat disabled)"),(0,r.useEffect)(()=>{j.current&&"function"==typeof j.current.scrollIntoView&&j.current.scrollIntoView({behavior:"smooth"})},[I]);const D=(e=!1)=>d(function*(){e||y(!0);try{const e={"X-Service-Token":h},t=(t,n)=>d(function*(){try{const n=yield fetch(`${m}${t}`,{headers:e,credentials:"include"});if(n.ok)return yield n.json();throw new Error("Failed to fetch")}catch(e){return n}})(),n=yield t("/api/pods/failed",[]),r=n&&n.length>0?n:[{pod_name:"frontend-7c8589-abcd",namespace:"default",status:"CrashLoopBackOff",failure_reason:"OOMKilled"},{pod_name:"backend-worker-1234",namespace:"production",status:"Pending",failure_reason:"Insufficient CPU"}];u(r);const o=yield t(`/api/chat/sessions?user_id=${encodeURIComponent(s.config.bootData.user.login)}`,[]);o&&o.length>0&&w(e=>{const t=p({},e);for(const e of o)t[e.pod_name]={count:e.message_count,namespace:e.namespace};return t})}catch(e){console.error("Error fetching insights",e)}finally{e||y(!1)}})();(0,r.useEffect)(()=>{var e;if(!b)return;const t=k[b],n=(null===(e=C[b])||void 0===e?void 0:e.count)||0;if(void 0!==t&&!(0===t.length&&n>0))return;const r=c.find(e=>e.pod_name===b),o=C[b];if(!r&&!o)return;const a=r?r.namespace:o.namespace;d(function*(){try{const e=yield fetch(`${m}/api/chat/history?pod_name=${b}&namespace=${a}&user_id=${encodeURIComponent(s.config.bootData.user.login)}`,{headers:{"X-Service-Token":h},credentials:"include"});if(e.ok){const t=yield e.json();(t.length>0||0===n)&&E(e=>f(p({},e),{[b]:t}))}}catch(e){console.error("Failed to fetch chat history",e)}})()},[b,c,C,k]);const B=e=>{var t;x(e);((null===(t=C[e])||void 0===t?void 0:t.count)||0)>0&&(!k[e]||0===k[e].length)&&E(t=>{const n=p({},t);return delete n[e],n})};(0,r.useEffect)(()=>{D();const e=setInterval(()=>{D(!0)},5e3);return()=>clearInterval(e)},[]);const M=()=>d(function*(){if(!O.trim()||!b)return;const e=[...I,{role:"user",text:O}];E(t=>f(p({},t),{[b]:e})),P(""),_(!0);try{var t;const n=c.find(e=>e.pod_name===b),r=n?n.namespace:(null===(t=C[b])||void 0===t?void 0:t.namespace)||"default",o=yield fetch(`${m}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json","X-Service-Token":h},credentials:"include",body:JSON.stringify({prompt:O,pod_name:b,namespace:r,user_id:s.config.bootData.user.login})});if(!o.ok){const e=yield o.json().catch(()=>({}));throw new Error(e.detail||"Chat API failed")}{const t=yield o.json();E(n=>f(p({},n),{[b]:[...e,{role:"bot",text:t.response}]})),w(e=>{var t;return f(p({},e),{[b]:{count:((null===(t=e[b])||void 0===t?void 0:t.count)||0)+2,namespace:r}})})}}catch(t){var n,r,o,a;if((null===(n=t.message)||void 0===n?void 0:n.includes("Failed to fetch"))||(null===(r=t.message)||void 0===r?void 0:r.includes("NetworkError"))||(null===(o=t.message)||void 0===o?void 0:o.includes("Chat API failed"))||(null===(a=t.message)||void 0===a?void 0:a.includes("Network request failed"))||!t.message){var i;const t=c.find(e=>e.pod_name===b),n=(null==t?void 0:t.failure_reason)||"CrashLoopBackOff",r=(null==t?void 0:t.namespace)||(null===(i=C[b])||void 0===i?void 0:i.namespace)||"default",o=`🤖 **[Demo / Offline Mode] Simulated AI Analysis for \`${b}\`**\n\nI analyzed the recent logs and Kubernetes event stream for this pod. The primary failure driver is **\`${n}\`**.\n\n### Root Cause Identification\n- **Telemetry:** The container process terminated unexpectedly after failing liveness probes or exceeding resource quotas.\n- **Event Log:** \`Warning BackOff: Back-off restarting failed container\` in namespace \`${r}\`.\n\n### Actionable Remediation\n1. **Check Container Logs:** Run \`kubectl logs -n ${r} ${b} --previous\` to view the exact stack trace before crash.\n2. **Verify Resource Quotas:** Ensure your cluster nodes have sufficient CPU/Memory headroom.\n3. **Inspect ConfigMaps:** Check if any required environment variables or mounted secrets are missing.`;E(t=>f(p({},t),{[b]:[...e,{role:"bot",text:o}]})),w(e=>{var t;return f(p({},e),{[b]:{count:((null===(t=e[b])||void 0===t?void 0:t.count)||0)+2,namespace:r}})})}else E(n=>f(p({},n),{[b]:[...e,{role:"bot",text:`Error: ${t.message||"The backend failed to process this request. You may have hit an LLM API rate limit!"}`}]}))}finally{_(!1)}})();return o().createElement("div",{className:t.container},o().createElement("div",{className:t.leftPane},o().createElement("h2",null,"Kure Insights"),g?o().createElement(i.Spinner,null):o().createElement(o().Fragment,null,o().createElement(i.TabsBar,null,o().createElement(i.Tab,{label:"Failure Feed",active:"failures"===n,onChangeTab:()=>l("failures")}),o().createElement(i.Tab,{label:"Chat History",active:"history"===n,onChangeTab:()=>l("history")})),o().createElement(i.TabContent,{className:t.tabContent},"failures"===n&&o().createElement("div",{className:t.listContainer},c.map((e,n)=>o().createElement(i.Card,{key:n,onClick:()=>B(e.pod_name),className:b===e.pod_name?t.selectedCard:""},o().createElement(i.Card.Heading,null,e.pod_name),o().createElement(i.Card.Description,null,"Namespace: ",e.namespace," | Status: ",o().createElement("strong",null,e.status)," | Reason: ",e.reason||e.failure_reason)))),"history"===n&&o().createElement("div",{className:t.listContainer},0===Object.keys(C).length?o().createElement("div",{style:{color:"#888"}},"No chat history yet."):Object.keys(C).map(e=>{var n,r;return o().createElement(i.Card,{key:e,onClick:()=>B(e),className:b===e?t.selectedCard:""},o().createElement(i.Card.Heading,null,e),o().createElement(i.Card.Description,null,(null===(n=C[e])||void 0===n?void 0:n.count)||(null===(r=k[e])||void 0===r?void 0:r.length)||0," messages"),o().createElement(i.Card.Actions,null,o().createElement(i.IconButton,{name:"trash-alt",onClick:t=>((e,t)=>d(function*(){var n;e.stopPropagation();const r=c.find(e=>e.pod_name===t),o=r?r.namespace:(null===(n=C[t])||void 0===n?void 0:n.namespace)||"default";try{yield fetch(`${m}/api/chat/history?pod_name=${t}&namespace=${o}&user_id=${encodeURIComponent(s.config.bootData.user.login)}`,{method:"DELETE",headers:{"X-Service-Token":h},credentials:"include"}),E(e=>{const n=p({},e);return delete n[t],n}),w(e=>{const n=p({},e);return delete n[t],n}),b===t&&x(null)}catch(e){console.error("Failed to delete chat history",e)}})())(t,e),tooltip:"Delete Chat"})))}))))),o().createElement("div",{className:t.rightPane},o().createElement("h2",null,"Chatbot ",b&&`(${b})`),o().createElement("div",{className:t.chatHistory},0===I.length?o().createElement("div",{style:{color:"#888"}},b?`Ask a question about ${b}...`:"Select a pod from the left pane to start chatting."):I.map((e,n)=>{return o().createElement("div",{key:n,className:"user"===e.role?t.chatMsgUser:t.chatMsgBot},o().createElement("strong",null,"user"===e.role?"You":"KureBot",":"),o().createElement("div",{className:t.markdownWrapper},"user"===e.role?e.text:o().createElement(a.oz,null,(r=e.text)?r.replace(/<think>[\s\S]*?<\/think>/gi,"").trim():"")));var r}),S&&o().createElement("div",{className:t.chatMsgBot},o().createElement("strong",null,"KureBot:")," ",o().createElement(i.Spinner,{inline:!0})," ",o().createElement("em",{style:{marginLeft:"8px"}},"Thinking...")),o().createElement("div",{ref:j})),o().createElement("div",{className:t.chatInputContainer},o().createElement(i.Input,{value:O,onChange:e=>P(e.currentTarget.value),onKeyDown:e=>{"Enter"!==e.key||N||M()},placeholder:T,disabled:N}),o().createElement(i.Button,{onClick:M,icon:"message",disabled:N},"Send"))))}const v=()=>({container:l.css`
      display: flex;
      height: calc(100vh - 65px);
      gap: 16px;
      padding: 16px;
      box-sizing: border-box;
      overflow: hidden;
    `,leftPane:l.css`
      flex: 1;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #ccc;
      padding-right: 16px;
      overflow: hidden;
    `,rightPane:l.css`
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `,tabContent:l.css`
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `,listContainer:l.css`
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
      flex: 1;
    `,selectedCard:l.css`
      border: 2px solid #3274d9;
    `,chatHistory:l.css`
      flex: 1;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 16px;
      overflow-y: auto;
      margin-bottom: 16px;
      background: #f9f9f9;
      color: #333;
    `,chatMsgUser:l.css`
      text-align: right;
      margin-bottom: 8px;
      background: #e1f5fe;
      padding: 8px;
      border-radius: 4px;
    `,chatMsgBot:l.css`
      text-align: left;
      margin-bottom: 8px;
      background: #eee;
      padding: 8px;
      border-radius: 4px;
    `,chatInputContainer:l.css`
      display: flex;
      gap: 8px;
    `,markdownWrapper:l.css`
      margin-top: 8px;
      line-height: 1.5;
      pre {
        background: #f4f5f5;
        color: #333;
        padding: 8px;
        border-radius: 4px;
        overflow-x: auto;
      }
      pre code {
        font-weight: normal;
        background: transparent;
        color: inherit;
        padding: 0;
      }
      code {
        font-family: monospace;
        background: #f4f5f5;
        color: #000;
        font-weight: bold;
        padding: 2px 4px;
        border-radius: 4px;
      }
      p {
        margin-bottom: 8px;
      }
      ul, ol {
        margin-left: 20px;
        margin-bottom: 8px;
      }
    `})}}]);
//# sourceMappingURL=462.js.map?_cache=e3edb39f071c75d097e2