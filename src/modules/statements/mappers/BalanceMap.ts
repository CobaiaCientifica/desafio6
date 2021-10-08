import { Statement } from "../entities/Statement";
import { Transfer } from "../entities/Transfer";

export class BalanceMap {
  static toDTO({statement, balance, transfer}: { statement: Statement[], balance: number, transfer: Transfer[]}) {
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    ));

    const parsedTransfer = transfer.map(({
      id,
      amount,
      description,
      created_at,
      updated_at,
      sender_id,
      target_id
    }) => (
      {
        id,
        amount: Number(amount),
        sender_id,
        target_id,
        description,
        created_at,
        updated_at
      }
    ));

    return {
      statement: parsedStatement,
      transfer: parsedTransfer,
      balance: Number(balance)
    }
  }
}
