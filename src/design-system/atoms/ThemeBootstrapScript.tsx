export function ThemeBootstrapScript() {
  const script = `
    (function () {
      try {
        const stored = localStorage.getItem('aj:theme');
        if (stored === 'light' || stored === 'dark') {
          document.documentElement.dataset.theme = stored;
        } else {
          const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
          document.documentElement.dataset.theme = prefersLight ? 'light' : 'dark';
        }
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
