# Énergie France — tableau de bord de la production d'énergie

SPA affichant la **production d'électricité en France** par filière, alimentée par les
données ouvertes de **RTE** (API [Actual Generation](https://data.rte-france.com/catalog/-/api/doc/user-guide/Actual+Generation/1.1)).

- **Page d'accueil** (`/`) : par filière, la dernière puissance injectée sur le réseau (MW) et sa
  date de mise à jour, avec un filtre par catégorie (Renouvelable / Non-renouvelable / Nucléaire).
- **Page graphique** (`/generation/:type`) : évolution d'une filière sur les 7 derniers jours
  (line chart, librairie [recharts](https://recharts.org)). Accessible au clic sur une carte.

## Stack

| Concern            | Tool                                          |
| ------------------ | --------------------------------------------- |
| Build / dev server | Vite 6 (SWC)                                  |
| UI kit             | antd 5                                        |
| Routing            | TanStack Router (file-based)                  |
| Server state       | TanStack Query 5                              |
| Client state       | Zustand                                       |
| Validation         | Zod                                           |
| API RTE            | fetch client maison (`src/lib/api-client.ts`) |
| Charts             | recharts                                      |
| Linting            | oxlint                                        |
| Formatting         | oxfmt                                         |
| Testing            | Vitest + Testing Library + MSW                |
| Git hooks          | husky + lint-staged                           |

## Démarrage rapide

Prérequis : Node >= 20, `pnpm@9`.

```bash
pnpm install
cp .env.example .env   # → mocks MSW par défaut ; cf. « Données RTE »
pnpm dev               # http://localhost:5173
```

Le premier `pnpm dev`/`pnpm build` génère `src/routeTree.gen.ts` (ne pas l'éditer à la main).

### Données RTE : du simulé au réel

Avec `VITE_ENABLE_MOCKS=true`, l'application tourne **hors ligne** avec **MSW** : le worker interrompt
les appels et renvoie des données simulées déterministes (`src/mocks/generationData.ts`), partagées
entre le dev et les tests. Aucune clé RTE n'est nécessaire.

Pour utiliser de **vraies données**, une clé active (`.env`) + `VITE_ENABLE_MOCKS=false` suffisent :
la clé `MTY5...NjQ5NQ==` fournie fonctionne (12 filières, valeurs horaires). Vérifiée en direct via
`curl` (jeton + données OK).

Flux d'authentification (OAuth2, conforme au guide RTE) :

1. `POST {base}/token/oauth/` avec `Authorization: Basic <VITE_RTE_IDENTIFIER>` (base64 de
   `client_id:client_secret`) et `grant_type=client_credentials` → jeton Bearer (cache 1h) ;
2. `GET {base}/open_api/actual_generation/v1/actual_generations_per_production_type?start_date=...&end_date=...`
   avec `Authorization: Bearer <jeton>`. Les dates (ISO 8601) couvrent les 7 derniers jours.

**CORS** : la passerelle RTE ne renvoie pas d'en-tête CORS et rejette les requêtes navigateur
portant un entête `Origin` (403). `VITE_RTE_BASE_URL` pointe donc directement sur l'hôte RTE pour
les appels réels ; en production, relayez ces appels derrière un proxy serveur côté app
(entête `Origin`/`Referer` retirée) pour éviter le blocage navigateur. Un proxy de dev `/rte`
(same-origin, retire `Origin`/`Referer`) demeure disponible dans `vite.config.ts` → `server.proxy`
si besoin.

## Scripts

| Script                         | Rôle                                                  |
| ------------------------------ | ----------------------------------------------------- |
| `pnpm dev`                     | Serveur de dev Vite                                   |
| `pnpm build`                   | Typecheck + build de production                       |
| `pnpm test` / `test:watch`     | Vitest (une fois / watch)                             |
| `pnpm coverage`                | Vitest avec couverture V8                             |
| `pnpm lint` / `lint:fix`       | oxlint (`--deny-warnings`)                            |
| `pnpm format` / `format:check` | oxfmt                                                 |
| `pnpm typecheck`               | `tsc -b --noEmit`                                     |
| `pnpm generate`                | Regénère `src/api/gen` depuis `openapi.yaml` via Kubb |
| `pnpm check`                   | typecheck + lint + format:check + test (comme la CI)  |

## Structure

```
src/
  routes/                # TanStack Router (index.tsx, generation/$productionType.tsx)
  components/            # UI (+ tests *.test.tsx)
  api/                   # generation.ts : hooks Query vers l'API RTE (pattern posts.ts)
  schemas/               # generation.ts : schémas Zod du payload RTE
  shared/                # dates.ts, format.ts, generationMeta.ts (catégories/labels/couleurs)
  mocks/                 # handlers.ts + generationData.ts (payload RTE simulé)
  lib/                   # api-client, query client, theme antd
  config/                # app.config.ts (base URL, cookie, config RTE)
  test/                  # setup Vitest + renderWithProviders
```

## Points notables

- `strict` + `noUncheckedIndexedAccess` actifs : penser à gérer `undefined` sur les indexations.
- oxlint remplace ESLint ; tout warning fait échouer `pnpm lint` (dont `no-console`).
- La clé RTE voyage dans le bundle client (`VITE_`). Pour une mise en production publique,
  acheminez les appels RTE via un proxy serveur qui injecte l'entête `Authorization`.
- Le thème de la marque vit dans `src/lib/theme.ts`, les couleurs par filière dans
  `src/shared/generationMeta.ts`.
- `vite.config.ts` proxy `/api` → `http://localhost:4000` (backend) et `/rte` → RTE (entête
  `Origin` retirée, sinon passe 403).
