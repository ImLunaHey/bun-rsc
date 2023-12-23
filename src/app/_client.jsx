import { createRoot } from "react-dom/client";
import { createFromFetch } from 'react-server-dom-webpack/client';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

createFromFetch(fetch("/rsc")).then((component) => {
    root.render(component);
});
