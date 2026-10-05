export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);

  applyProps(node, props);
  appendChildren(node, children);

  return node;
}

export function applyProps(node, props) {
  for (const [key, value] of Object.entries(props)) {
    if (value == null || value === false) continue;

    if (key === 'className') {
      node.className = value;
    } else if (key === 'textContent') {
      node.textContent = value;
    } else if (key === 'dataset') {
      for (const [dataKey, dataValue] of Object.entries(value)) {
        node.dataset[dataKey] = dataValue;
      }
    } else if (key === 'style' && typeof value === 'object') {
      for (const [styleKey, styleValue] of Object.entries(value)) {
        node.style[styleKey] = styleValue;
      }
    } else if (key.startsWith('on') && typeof value === 'function') {      
      const eventName = key.slice(2).toLowerCase();
      node.addEventListener(eventName, value);
    } else {
      node.setAttribute(key, value);
    }
  }
}

export function appendChildren(node, children) {
  if (children == null) return;

  const list = Array.isArray(children) ? children : [children];

  for (const child of list) {
    if (child == null) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      node.append(document.createTextNode(String(child)));
    } else {
      node.append(child);
    }
  }
}

export function clear(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}