import { html } from 'lit';

export const ukFlag = html`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <clipPath id="clip"><rect width="32" height="32"/></clipPath>
  </defs>
  <!-- Mavi zemin -->
  <rect width="32" height="32" fill="#012169"/>
  <g clip-path="url(#clip)">
    <!-- Beyaz diyagonaller -->
    <path d="M0 0L32 32M32 0L0 32" stroke="#FFFFFF" stroke-width="6"/>
    <!-- Kırmızı diyagonaller (basitleştirilmiş, merkezde) -->
    <path d="M0 0L32 32M32 0L0 32" stroke="#C8102E" stroke-width="3"/>
    <!-- Beyaz artı -->
    <rect x="13" y="0" width="6" height="32" fill="#FFFFFF"/>
    <rect x="0" y="13" width="32" height="6" fill="#FFFFFF"/>
    <!-- Kırmızı artı -->
    <rect x="14" y="0" width="4" height="32" fill="#C8102E"/>
    <rect x="0" y="14" width="32" height="4" fill="#C8102E"/>
  </g>
</svg>`;
