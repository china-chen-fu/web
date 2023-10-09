import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
// import eslintPlugin from 'vite-plugin-eslint'

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()]
  // vitePlugins.push(
  //   eslintPlugin({
  //     include: ['src/**/*.js', 'src/**/*.vue', 'src/*.js', 'src/*.vue']
  //   })
  // )
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createSvgIcon(isBuild))
  isBuild && vitePlugins.push(...createCompression(viteEnv))
  return vitePlugins
}
