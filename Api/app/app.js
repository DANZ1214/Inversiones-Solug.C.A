'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const App = express();

// CORS
App.use(cors({ origin: '*' }));

// Body parsers
App.use(express.json({ limit: '10mb' }));
App.use(express.urlencoded({ extended: false }));

// ✅ SERVIR ARCHIVOS DESDE app/uploads (donde realmente están)
App.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// ✅ RUTA EXTRA MANUAL (por si express.static no responde)
App.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  fs.access(filePath, fs.constants.F_OK, err => {
    if (err) {
      return res.status(404).send('Archivo no encontrado');
    }
    res.sendFile(filePath);
  });
});

// Rutas API
const userRoutes = require('./routes/userRoutes');
App.use('/api/unicah/user', userRoutes);

module.exports = App;
