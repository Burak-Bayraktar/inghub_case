import {configureLocalization} from '@lit/localize';

export const {getLocale, setLocale} = configureLocalization({
  sourceLocale: 'en',
  targetLocales: ['tr'],
  loadLocale: (locale) => import(`./i18n/${locale}.js`).catch(() => {}),
});

window.appGetLocale = getLocale;
window.appSetLocale = setLocale;

async function initializeApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const localeFromUrl = urlParams.get('locale');
  
  if (localeFromUrl && ['en', 'tr'].includes(localeFromUrl)) {
    await setLocale(localeFromUrl);
  }
  
  await import('./components/app-root.js');
}

// Initialize the app
initializeApp();
