process.env.JWT_SECRET = "senhasupersecreta123";

import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository:InMemoryUsersRepository;
const name1 = "user1";
const email1 = "user1@test.com";
const password1 = "user1password";

let authenticateUserUseCase:AuthenticateUserUseCase;

describe("Authenticate User Module", ()=>{
  beforeAll(async ()=>{
    usersRepository = new InMemoryUsersRepository();
    usersRepository.create({
      name: name1,
      email: email1,
      password: await hash(password1, 8)
    });
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to authenticate a existing user", async ()=>{
    const authData = await authenticateUserUseCase.execute({email:email1, password:password1});

    expect(authData.user.email).toEqual(email1);
    expect(authData.user.name).toEqual(name1);
    expect(authData.token).toBeDefined();
  });
  it("shouldn't be able to authenticate a non existing user", async ()=>{
    expect(async ()=>{
      await authenticateUserUseCase.execute({email:"notValid", password:"nonexistant"});
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
