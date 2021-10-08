import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

class CreateTransferController {
  async execute(request:Request, response:Response): Promise<Response>{
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { target_id } = request.params;

    const createTransfer = container.resolve(CreateTransferUseCase);

    const transfer = await createTransfer.execute({sender_id:user_id, target_id, amount, description});

    return response.status(201).json(transfer);
  }
}

export { CreateTransferController }
