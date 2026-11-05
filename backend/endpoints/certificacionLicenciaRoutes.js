const express = require('express');
const router = express.Router();
const {
  getAllCertificacionesLicencias,
  getCertificacionLicenciaById,
  createCertificacionLicencia,
  updateCertificacionLicencia,
  deleteCertificacionLicencia
} = require('../controllers/certificacionLicenciaController');

router.get('/', getAllCertificacionesLicencias);
router.get('/:id', getCertificacionLicenciaById);
router.post('/', createCertificacionLicencia);
router.put('/:id', updateCertificacionLicencia);
router.delete('/:id', deleteCertificacionLicencia);

module.exports = router;

