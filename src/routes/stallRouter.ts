import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { validate } from '../middlewares/validate.ts';
import { auth } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import {
  createStallSchema,
  idParamSchema,
  stallQuerySchema,
  updateStallSchema,
} from '../schemas/stallSchema.ts';
import { createReviewSchema } from '../schemas/reviewSchema.ts';

const stallRouter = Router();
const stallController = new StallController();

stallRouter.get('/', validate(stallQuerySchema, 'query'), (req, res) => {
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar warung (filter + pagination)' }
  return stallController.getStalls(req, res);
});

stallRouter.post('/', auth, authorize('owner', 'admin'), validate(createStallSchema, 'body'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[201] = { description: 'Warung dibuat' }
  // #swagger.responses[401] = { description: 'Belum login' }
  // #swagger.responses[403] = { description: 'Role tidak diizinkan' }
  return stallController.createStall(req, res);
});

stallRouter.get('/:id', validate(idParamSchema, 'params'), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail warung' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallById(req, res);
});

stallRouter.get('/:id/menus', validate(idParamSchema, 'params'), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu milik warung' }
  return stallController.getStallMenus(req, res);
});

stallRouter.put('/:id', auth, authorize('owner', 'admin'), validate(idParamSchema, 'params'), validate(updateStallSchema, 'body'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[200] = { description: 'Warung ter-update' }
  // #swagger.responses[403] = { description: 'Bukan pemilik warung' }
  return stallController.updateStall(req, res);
});

stallRouter.delete('/:id', auth, authorize('admin'), validate(idParamSchema, 'params'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Warung terhapus' }
  // #swagger.responses[403] = { description: 'Hanya admin' }
  return stallController.deleteStall(req, res);
});

stallRouter.post('/:id/reviews', auth, validate(idParamSchema, 'params'), validate(createReviewSchema, 'body'), (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ReviewCreateInput' } }
  // #swagger.responses[201] = { description: 'Review dibuat' }
  return stallController.createReview(req, res);
});

export { stallRouter };