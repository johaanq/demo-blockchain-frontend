# Demo Blockchain — Frontend

UI en **Next.js** + Tailwind. Consume la API del backend.

Skills de agente instalados con [autoskills](https://www.autoskills.sh/) (Next.js, React, Tailwind, frontend-design).

## Arranque

1. Levanta el backend en el puerto 4000 (local o Docker):

```bash
cd ../demo-blockchain-backend
docker compose up --build
```

2. Luego:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Flujo para la clase

1. **Iniciar cadena** — bloque génesis.
2. **Añadir bloque** — transacción sin minería (rápido).
3. **Minar (PoW)** — busca nonce hasta hash con `0000…`.
4. **Manipular bloque** — cambia datos sin recalcular hash.
5. **Validar cadena** — debe fallar tras manipular.

## Variables

Copia `.env.local.example` si hace falta. Por defecto apunta a `http://localhost:4000/api`.
