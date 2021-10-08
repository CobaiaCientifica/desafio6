import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Transfer } from "../../entities/Transfer";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransfersRepository } from "../../repositories/ITransfersRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("TransfersRepository")
    private transfersRepository: ITransfersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}
  async execute({sender_id, target_id, description, amount}: ICreateTransferDTO): Promise<Transfer> {
    const sender = await this.usersRepository.findById(sender_id);
    const receiver = await this.usersRepository.findById(target_id);
    if(!sender || !receiver) {
      throw new CreateTransferError.UserNotFound();
    }

    const statementBalance = await this.statementsRepository.getUserBalance({user_id:sender_id});
    const transferBalance = await this.transfersRepository.getUserBalance({user_id:sender_id});
    const availableFunds = Number.parseFloat(statementBalance.balance.toString()) + transferBalance.balance
    if(availableFunds < amount || amount <= 0){
      throw new CreateTransferError.InsufficientFunds();
    }

    const newEntry = await this.transfersRepository.create({sender_id, target_id, description, amount});

    return newEntry;
  }
}

export { CreateTransferUseCase }
