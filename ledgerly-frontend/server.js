const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 4173;
app.use(express.static(path.join(__dirname, 'public')));
// Source modules stay organized under src/ while being served as browser ES modules.
app.use('/js', express.static(path.join(__dirname, 'src', 'js')));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(port, () => console.log(`Ledgerly frontend listening on http://localhost:${port}`));
