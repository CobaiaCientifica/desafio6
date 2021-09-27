import { hash } from "bcryptjs";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository:InMemoryUsersRepository;
const name1 = "testname";
const email1 = "test@test.com";
const password1 = "testpassword";
let user1:User;

let statementsRepository:InMemoryStatementsRepository;
const amount = 1000;
const description = "test deposit";
const type = "deposit";
let statement1:Statement;
let dummyStatement = new Statement();
Object.assign(dummyStatement,{type});

let getStatementOperationUseCase:GetStatementOperationUseCase;

describe("Get Statement Module", ()=>{
  beforeAll(async ()=>{
    usersRepository = new InMemoryUsersRepository();
    user1 = await usersRepository.create({
      name: name1,
      email: email1,
      password: await hash(password1, 8)
    });
    statementsRepository = new InMemoryStatementsRepository();
    statement1 = await statementsRepository.create({user_id:user1.id as string, amount, description, type:dummyStatement.type});

    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it("should be able to get a valid statement from a valid user", async ()=>{
    const statementData = await getStatementOperationUseCase.execute({user_id:user1.id as string, statement_id:statement1.id as string});

    expect(statementData).toBeDefined();
    expect(statementData.amount).toEqual(amount);
  });
  it("shouldn't be able to get a statement from a invalid user", async ()=>{
    expect(async ()=>{
      await getStatementOperationUseCase.execute({user_id:"wat",statement_id:statement1.id as string});
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
  it("shouldn't be able to get a invalid statement from a valid user", async ()=>{
    expect(async ()=>{
      await getStatementOperationUseCase.execute({user_id:user1.id as string,statement_id:"wut"});
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
