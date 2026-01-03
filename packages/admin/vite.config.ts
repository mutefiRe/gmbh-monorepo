import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import type { AtRule } from 'postcss';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_TARGET || "http://localhost:8080";
  const basePath = env.VITE_BASE || process.env.VITE_BASE || "/admin/";
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const shouldRedirect = normalizedBase !== "/";
  const stripLayers = () => ({
    postcssPlugin: 'strip-cascade-layers',
    AtRule: {
      layer(atRule: AtRule) {
        if (atRule.nodes && atRule.nodes.length > 0) {
          atRule.replaceWith(...atRule.nodes);
        } else {
          atRule.remove();
        }
      }
    }
  });
  const stripWhereIs = () => ({
    postcssPlugin: 'strip-where-is-selectors',
    Rule(rule: { selector?: string }) {
      if (!rule.selector) return;
      if (rule.selector.indexOf(':where(') === -1 && rule.selector.indexOf(':is(') === -1) return;
      rule.selector = rule.selector.replace(/:(where|is)\(([^()]*)\)/g, '$2');
    }
  });
  const downlevelRgbSlash = () => ({
    postcssPlugin: 'downlevel-rgb-slash',
    Declaration(decl: { value?: string }) {
      if (!decl.value || decl.value.indexOf('rgb(') === -1 || decl.value.indexOf('/') === -1) return;
      decl.value = decl.value.replace(
        /rgb\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\/\s*([0-9.]+%?)\s*\)/g,
        (_match, r, g, b, a) => {
          let alpha = a;
          if (typeof a === 'string' && a.endsWith('%')) {
            const percent = parseFloat(a.slice(0, -1));
            alpha = Number.isFinite(percent) ? String(percent / 100) : a;
          }
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
      );
    }
  });
  const downlevelTheme = () => ({
    postcssPlugin: 'downlevel-theme',
    AtRule(atRule: AtRule) {
      if (atRule.name !== 'theme') return;
      atRule.replaceWith({
        type: 'rule',
        selector: ':root',
        nodes: atRule.nodes || []
      });
    }
  });
  const downlevelLogicalProps = () => ({
    postcssPlugin: 'downlevel-logical-props',
    Declaration(decl: { prop?: string; value?: string; parent?: { nodes?: any[] } }) {
      if (!decl.prop || !decl.value || !decl.parent || !decl.parent.nodes) return;
      const prop = decl.prop;
      const value = decl.value;
      const insert = (newDecls: Array<{ prop: string; value: string }>) => {
        const idx = decl.parent!.nodes!.indexOf(decl as any);
        if (idx === -1) return;
        decl.parent!.nodes!.splice(idx, 1, ...newDecls.map((d) => ({ ...decl, prop: d.prop, value: d.value })));
      };
      const splitValues = (val: string) => {
        const parts = val.trim().split(/\s+/);
        if (parts.length <= 1) return [parts[0], parts[0]];
        return [parts[0], parts[1]];
      };
      if (prop === 'padding-inline' || prop === 'margin-inline') {
        const [start, end] = splitValues(value);
        insert([
          { prop: prop === 'padding-inline' ? 'padding-left' : 'margin-left', value: start },
          { prop: prop === 'padding-inline' ? 'padding-right' : 'margin-right', value: end }
        ]);
      } else if (prop === 'padding-block' || prop === 'margin-block') {
        const [start, end] = splitValues(value);
        insert([
          { prop: prop === 'padding-block' ? 'padding-top' : 'margin-top', value: start },
          { prop: prop === 'padding-block' ? 'padding-bottom' : 'margin-bottom', value: end }
        ]);
      } else if (prop === 'padding-inline-start') {
        insert([{ prop: 'padding-left', value }]);
      } else if (prop === 'padding-inline-end') {
        insert([{ prop: 'padding-right', value }]);
      } else if (prop === 'margin-inline-start') {
        insert([{ prop: 'margin-left', value }]);
      } else if (prop === 'margin-inline-end') {
        insert([{ prop: 'margin-right', value }]);
      } else if (prop === 'padding-block-start') {
        insert([{ prop: 'padding-top', value }]);
      } else if (prop === 'padding-block-end') {
        insert([{ prop: 'padding-bottom', value }]);
      } else if (prop === 'margin-block-start') {
        insert([{ prop: 'margin-top', value }]);
      } else if (prop === 'margin-block-end') {
        insert([{ prop: 'margin-bottom', value }]);
      }
    }
  });

  return {
    base: normalizedBase,
    build: {
      target: 'chrome81'
    },
    server: {
      port: 3000,
      http: true,
      open: normalizedBase,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/authenticate": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/socket.io": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    },
    plugins: [
      {
        name: 'admin-base-redirect',
        configureServer(server) {
          if (!shouldRedirect) return;
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            if (url === '/' || url === '') {
              res.statusCode = 302;
              res.setHeader('Location', normalizedBase);
              res.end();
              return;
            }
            if (url === normalizedBase.slice(0, -1)) {
              res.statusCode = 301;
              res.setHeader('Location', normalizedBase);
              res.end();
              return;
            }
            next();
          });
        }
      },
      react(),
      tailwindcss(),
      legacy({
        targets: ['chrome >= 37', 'android >= 5'],
        modernPolyfills: true,
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
    ],
    optimizeDeps: {
      esbuildOptions: {
        target: 'chrome81'
      }
    },
    css: {
      postcss: {
        plugins: [stripLayers(), stripWhereIs(), downlevelRgbSlash(), downlevelTheme(), downlevelLogicalProps()]
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
