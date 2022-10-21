const router = require('express').Router();
const brandController = require('../../controllers/brand');

router.get('/', brandController.getAll);
router.get('/:id', brandController.getById)
router.post('/', brandController.create);
router.put('/:id', brandController.update);
router.delete('/:id', brandController.delete);
router.get('/:id/model', brandController.getModelById);

module.exports = router;
