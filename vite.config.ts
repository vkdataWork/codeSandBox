import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import sass from 'sass';

// https://vitejs.dev/config/
export default defineConfig({
	optimizeDeps: {
		include: ['codemirror'],
	},
	server: {
		port: 8080,
		cors: false,
	},

	plugins: [vue()], //{script:{propsDestructure: true}
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'devextreme/ui': 'devextreme/esm/ui',
		},
	},
	esbuild: {
		treeShaking: false,
	},

	build: {
		chunkSizeWarningLimit: 5000,
		rollupOptions: {
			treeshake: false,
		},
	},
});
