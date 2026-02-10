import DefaultTheme from 'vitepress/theme'
import SidebarLogo from './SidebarLogo.vue'
import AiDisclaimer from './AiDisclaimer.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-after': () => h(SidebarLogo),
      'layout-bottom': () => h(AiDisclaimer)
    })
  }
}
