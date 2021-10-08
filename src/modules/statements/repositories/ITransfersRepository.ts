import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { IGetTransferDTO } from "../useCases/createTransfer/IGetTransferDTO";

export interface ITransfersRepository{
  create(data: ICreateTransferDTO): Promise<Transfer>;
  findReceivedTransfersByUser(user_id: string): Promise<Transfer[] | undefined>;
  findSentTransfersByUser(user_id: string): Promise<Transfer[] | undefined>;
  getUserBalance(data: IGetTransferDTO): Promise<{ balance: number } | { balance: number, statement: Transfer[] }>;
}
