// import React from "react";
// import ReactDOM from "react-dom";

// export function mountComponent(Comp: React.ReactElement, root = document.body) {
//   const div = document.createElement("div");
//   root.appendChild(div);

//   const Clone = React.cloneElement(Comp, {
//     onUnmount() {
//       ReactDOM.unmountComponentAtNode(div);
//       if (root && div) {
//         root.removeChild(div);
//       }
//     },
//   });

//   ReactDOM.render(Clone, div);

//   return div;
// }
import React from "react";
import ReactDOM from "react-dom/client";

export function mountComponent(Comp: React.ReactElement, root = document.body) {
  const div = document.createElement("div");
  root.appendChild(div);

  const rootContainer = ReactDOM.createRoot(div);

  const Clone = React.cloneElement(Comp, {
    onUnmount() {
      // 在React 18中，当使用createRoot时，不需要显���调用unmountComponentAtNode
      // 因为当rootContainer（即createRoot创建的容器）销毁时，React会自动清理
      if (root && div) {
        root.removeChild(div);
      }
    },
  });

  rootContainer.render(Clone);

  return div;
}
