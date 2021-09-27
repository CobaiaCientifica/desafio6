import { hash } from "bcryptjs";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

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

let getBalanceUseCase:GetBalanceUseCase;

describe("Get Balance Module", ()=>{
  beforeAll(async ()=>{
    usersRepository = new InMemoryUsersRepository();
    user1 = await usersRepository.create({
      name: name1,
      email: email1,
      password: await hash(password1, 8)
    });
    statementsRepository = new InMemoryStatementsRepository();
    statementsRepository.create({user_id:user1.id as string, amount, description, type:dummyStatement.type});

    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
  });

  it("should be able to list the full balance from a valid user", async ()=>{
    const balanceData = await getBalanceUseCase.execute({user_id:user1.id as string});

    expect(balanceData).toBeDefined();
    expect(balanceData.balance).toEqual(amount);
  });
  it("shouldn't be able to list the balance from a invalid user", async ()=>{
    expect(async ()=>{
      await getBalanceUseCase.execute({user_id:"wat"});
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
