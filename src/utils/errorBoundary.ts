import { NextFunction, Request, Response } from "express"

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>

/**
 * Wraps a controller in a try-catch block and returns a safe controller that does not crash on errors.
 */
const errorBoundary = (controller: AsyncController): AsyncController => {
  const safeController: AsyncController = async (req, res, next) => {
    try {
      await controller(req, res, next)
    }
    catch (err) {
      next(err)
    }
  }

  return safeController
}

export default errorBoundary