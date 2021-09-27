import { hash } from "bcryptjs";
import { Connection, createConnection } from "typeorm";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let connection: Connection;
let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let newUser:User;

describe("Create user module", ()=>{
  beforeAll(async () => {
    const name = "Test User";
    const email = "newuser@test.com";
    const password = await hash("test", 8);
    usersRepository = new InMemoryUsersRepository();
    newUser = await usersRepository.create({name, email, password});
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
});
  it("should be able to retrieve a user profile from a existing user", async()=>{
    const userData = await showUserProfileUseCase.execute(newUser.id as string);

    expect(userData.id).toEqual(newUser.id);
    expect(userData.name).toEqual(newUser.name);
    expect(userData.password).toEqual(newUser.password);
    expect(userData.email).toEqual(newUser.email);
  });
  it("should not be able to retrieve data from a non-existant user", async()=>{
    expect(showUserProfileUseCase.execute("not a valid user id")).rejects.toBeInstanceOf(ShowUserProfileError);
  });
})
