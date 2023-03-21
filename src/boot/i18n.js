import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export const i18n = createI18n({
  fallbackLocale: 'en-US',
  messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true
})

export default ({ app, store }) => {
  // Tell app to use the I18n instance
  app.use(i18n)
}
