import type { Request, Response } from 'express';
import { StallService } from '../services/stallService.ts';
import { ReviewService } from '../services/reviewService.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { TokenPayload } from '../services/tokenService.ts';
import type {
  CreateStallInput,
  IdParam,
  StallQuery,
  UpdateStallInput,
} from '../schemas/stallSchema.ts';
import type { CreateReviewBody } from '../schemas/reviewSchema.ts';

export class StallController {
  private stallService: StallService;
  private reviewService: ReviewService;

  constructor(
    stallService: StallService = new StallService(),
    reviewService: ReviewService = new ReviewService(),
  ) {
    this.stallService = stallService;
    this.reviewService = reviewService;
  }

  getStalls = async (_req: Request, res: Response): Promise<void> => {
    const { search, category, page, limit } = getValidated<StallQuery>(res, 'query');
    const { data, total } = await this.stallService.getAllStalls({ search, category, page, limit });
    res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
  };

  getStallById = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const stall = await this.stallService.getStallById(id);
    res.status(200).json({ status: 'success', data: stall });
  };

  getStallMenus = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const menus = await this.stallService.getStallMenus(id);
    res.status(200).json({ status: 'success', data: menus });
  };

  createStall = async (_req: Request, res: Response): Promise<void> => {
    const body = getValidated<CreateStallInput>(res, 'body');
    const user = res.locals.user as TokenPayload;
    const stall = await this.stallService.createStall(body, user.userId);
    res.status(201).json({ status: 'success', data: stall });
  };

  updateStall = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const body = getValidated<UpdateStallInput>(res, 'body');
    const user = res.locals.user as TokenPayload;
    const stall = await this.stallService.updateStall(id, body, user);
    res.status(200).json({ status: 'success', data: stall });
  };

  deleteStall = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const stall = await this.stallService.deleteStall(id);
    res.status(200).json({ status: 'success', data: stall });
  };

  createReview = async (_req: Request, res: Response): Promise<void> => {
    const { id } = getValidated<IdParam>(res, 'params');
    const body = getValidated<CreateReviewBody>(res, 'body');
    const user = res.locals.user as TokenPayload;
    await this.stallService.getStallById(id); // 404 kalau warung tidak ada
    const review = await this.reviewService.createReview({
      stallId: id,
      userId: user.userId,
      rating: body.rating,
      comment: body.comment,
    });
    res.status(201).json({ status: 'success', data: review });
  };
}