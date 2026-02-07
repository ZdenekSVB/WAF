# Vuetify Project

Tato webová aplikace je postavena na moderním stacku Vue 3 s využitím Vite pro rychlý vývoj a Vuetify pro UI komponenty.

## 🛠 Použité technologie

* Framework: Vue 3 (+ TypeScript)
* Build Tool: Vite
* UI Knihovna: Vuetify 3 (Material Design)
* State Management: Pinia (a Vuex)
* Routing: Vue Router (s automatickým importem)
* HTTP Client: Axios
* Grafy: Chart.js & vue-chartjs
* Testování: Cypress

## 📋 Požadavky

Před spuštěním se ujisti, že máš nainstalováno:
* Node.js (obsahuje npm)

## 🚀 Instalace a spuštění (Jak zapnout)

### 1. Instalace závislostí
Stáhni všechny potřebné knihovny příkazem:

npm install

### 2. Spuštění vývojového serveru (Dev mód)
Pro spuštění aplikace na lokálním počítači použij:

npm run dev

Aplikace poběží na adrese: http://localhost:3000

## 🧪 Testování (Cypress)

Projekt obsahuje E2E testy.

Otevření interaktivního okna Cypress:
npm run cypress:open

Spuštění testů v příkazové řádce (headless mód):
npm run cypress:run

## 📂 Struktura projektu

* src/ - Zdrojové kódy aplikace
    * components/ - Vue komponenty
    * pages/ - Stránky aplikace
    * styles/ - SCSS a nastavení vzhledu
* vite.config.mts - Konfigurace Vite
