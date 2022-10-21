const router = require('express').Router();
const modelController = require('../../controllers/model');

router.get('/', modelController.getAll);
router.get('/:id', modelController.getById)
router.post('/', modelController.create);
router.put('/:id', modelController.update);
router.delete('/:id', modelController.delete);

module.exports = router;
