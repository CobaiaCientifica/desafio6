import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user module", ()=>{
  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
});
  it("should be able to create a new user", async()=>{
    const name = "Test User";
    const email = "newuser@test.com";
    const password = "test";

    const newUser = await createUserUseCase.execute({name, email, password});

    expect(newUser.name).toEqual(name);
    expect(newUser.email).toEqual(email);
  });
  it("should not be able to create a new user if the informed e-mail is already in use", async()=>{
    expect(async()=>{
      const name = "Test User 2";
      const email = "newuser@test.com";
      const password = await hash("test", 8);

      const newUser = await createUserUseCase.execute({name, email, password});
    }).rejects.toBeInstanceOf(CreateUserError);
  });
})
