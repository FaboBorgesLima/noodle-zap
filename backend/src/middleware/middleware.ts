import { NextFunction, Request, Response } from "express";

export abstract class Middleware {
    abstract middleware(req: Request, res: Response, next: NextFunction): void;
}
