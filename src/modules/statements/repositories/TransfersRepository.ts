import { getRepository, Repository } from "typeorm";
import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { IGetTransferDTO } from "../useCases/createTransfer/IGetTransferDTO";
import { ITransfersRepository } from "./ITransfersRepository";

export class TransfersRepository implements ITransfersRepository{
  private repository: Repository<Transfer>;

  constructor(){
    this.repository = getRepository(Transfer);
  }
  async create({sender_id, target_id, description, amount}: ICreateTransferDTO): Promise<Transfer> {
    const newEntry = this.repository.create({sender_id, target_id, description, amount});
    return this.repository.save(newEntry);
  }
  async findReceivedTransfersByUser(user_id: string): Promise<Transfer[] | undefined> {
    return this.repository.find({target_id: user_id});
  }
  async findSentTransfersByUser(user_id: string): Promise<Transfer[] | undefined> {
    return this.repository.find({sender_id: user_id});
  }
  async getUserBalance({user_id, with_statement}: IGetTransferDTO): Promise<{ balance: number; } | { balance: number; statement: Transfer[]; }> {
    let received = await this.findReceivedTransfersByUser(user_id);
    let total = 0.0;
    if(received){
      total = received.reduce((total, entry) => {
        return total + entry.amount;
      }, 0);
    } else {
      received = [];
    }

    let sent = await this.findSentTransfersByUser(user_id);
    if(sent){
      total = sent.reduce((total, entry) => {
        return total - entry.amount;
      }, total);
    } else {
      sent = [];
    }

    if (with_statement) {
      return {
        statement: received.concat(sent),
        balance: total
      }
    }

    return { balance: total }
  }
}
