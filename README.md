# Acta digital — Frontend

Interfaz **institucional clara** (tema acta electoral / papel peruano) para la **segunda vuelta Perú 2026 (demo académica)**: **Keiko Fujimori** vs **Roberto Sánchez**, balotaje **7 jun 2026**. Cada registro en la cadena es un voto o acta sellado con SHA-256 y PoW. No está afiliado al JNE/ONPE.

## UI

- **Navbar** con 5 vistas: Inicio · Debate 31/05 · Jornada · Sellado · Cadena.
- Fotos oficiales (Wikimedia Commons) de Keiko Fujimori y Roberto Sánchez.
- Resumen del debate del **domingo 31 mayo 2026** en `src/lib/debate-2026.ts`.
- Tipografía: **Fraunces** + **Source Sans 3** + JetBrains Mono.
- Componentes: `ui/`, `views/`, `controls/`, `candidates/`, `layout/`.

## Arranque

1. Backend en el puerto 4000:

```bash
cd ../demo-blockchain-backend
docker compose up --build
```

2. Frontend:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Flujo para la clase

1. **Abrir jornada** — acta de apertura (génesis: Keiko vs Sánchez).
2. **Sellar voto (PoW)** — registra un voto con sellado (terminal en vivo).
3. Más votos con chips rápidos (Keiko / Sánchez / cierre de mesa).
4. **Simular fraude** — cambia un voto sin recalcular hash.
5. **Validar escrutinio** — debe fallar si hubo manipulación.

## Variables

Copia `.env.local.example` → `.env.local` si hace falta (`http://localhost:4000/api`).
