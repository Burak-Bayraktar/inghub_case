import {configureLocalization} from '@lit/localize';

// Localization configuration
export const {getLocale, setLocale} = configureLocalization({
  sourceLocale: 'en',
  targetLocales: ['tr'],
  loadLocale: (locale) => import(`./i18n/${locale}.js`).catch(() => {}),
});

// Global functions
window.appGetLocale = getLocale;
window.appSetLocale = setLocale;

// Set locale before loading components
async function initializeApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const localeFromUrl = urlParams.get('locale');
  
  if (localeFromUrl && ['en', 'tr'].includes(localeFromUrl)) {
    await setLocale(localeFromUrl);
  }
  
  // Load app components after locale is set
  await import('./components/app-root.js');
}

// Initialize the app
initializeApp();
