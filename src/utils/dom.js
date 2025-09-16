export function createElement(tag, options = {}) {
  const {
    classNames = [],
    attrs = {},
    dataset = {},
    text,
    html,
    children = [],
  } = options;

  const element = document.createElement(tag);

  const classList = Array.isArray(classNames) ? classNames : [classNames];
  classList.filter(Boolean).forEach((cls) => element.classList.add(cls));

  Object.entries(attrs).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    element.setAttribute(key, value);
  });

  Object.entries(dataset).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    element.dataset[key] = value;
  });

  if (typeof text === 'string') {
    element.textContent = text;
  }

  if (typeof html === 'string') {
    element.innerHTML = html;
  }

  children.forEach((child) => {
    if (!child) return;
    element.appendChild(child);
  });

  return element;
}

export function clearElement(element) {
  if (!element) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function applyText(element, text) {
  if (!element) return;
  element.textContent = text ?? '';
}
