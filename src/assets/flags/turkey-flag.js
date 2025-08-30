import { html } from 'lit';

export const turkeyFlag = html`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <!-- Kırmızı zemin -->
  <rect width="32" height="32" fill="#E30A17"/>
  <!-- Hilal -->
  <circle cx="14" cy="16" r="6" fill="#FFFFFF"/>
  <circle cx="16" cy="16" r="5" fill="#E30A17"/>
  <!-- Yıldız (5 köşeli) -->
  <polygon fill="#FFFFFF"
    points="
      23,13
      23.764,14.948
      25.853,15.073
      24.236,16.402
      24.763,18.427
      23,17.3
      21.237,18.427
      21.764,16.402
      20.147,15.073
      22.236,14.948
    "/>
</svg>`;
