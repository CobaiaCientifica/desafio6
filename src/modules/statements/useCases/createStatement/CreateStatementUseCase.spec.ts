import { hash } from "bcryptjs";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository:InMemoryUsersRepository;
const name1 = "testname";
const email1 = "test@test.com";
const password1 = "testpassword";
let user1:User;

let statementsRepository:InMemoryStatementsRepository;

let createStatementUseCase:CreateStatementUseCase;

describe("Create Statement Module", ()=>{
  beforeAll(async ()=>{
    usersRepository = new InMemoryUsersRepository();
    user1 = await usersRepository.create({
      name: name1,
      email: email1,
      password: await hash(password1, 8)
    });
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it("should be able to create a statement to a valid user", async ()=>{
    const statementData = new Statement();
    Object.assign(statementData,{
      type:'deposit'
    });
    const statement = await createStatementUseCase.execute({user_id:user1.id as string, description:"test operation", amount:1000.00, type:statementData.type});

    expect(statement.user_id).toEqual(user1.id);
  });
  it("shouldn't be able to create a statement to a invalid user", async ()=>{
    const statementData = new Statement();
    Object.assign(statementData,{
      type:'deposit'
    });

    expect(async ()=>{
      await createStatementUseCase.execute({user_id:"wat", description:"test operation", amount:1000.00, type:statementData.type});
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
  it("shouldn't be able to withdraw more money than available for a user", async ()=>{
    const statementData = new Statement();
    Object.assign(statementData,{
      type:'withdraw'
    });

    expect(async ()=>{
      await createStatementUseCase.execute({user_id:user1.id as string, description:"test operation", amount:2000.00, type:statementData.type});
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
