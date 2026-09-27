import { app } from './app.js';

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express + Postgres listo en http://localhost:${PORT}`);
});
