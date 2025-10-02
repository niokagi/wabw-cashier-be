import Lab from "@hapi/lab";
import { expect } from "@hapi/code";
import Sinon from "sinon";
import bcrypt from "bcrypt";
import pool from "../../src/db/client.js";
import UsersService from "../../src/services/UsersService.js";
import ClientError from "../../src/exceptions/ClientError.js";

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;

describe("UsersService", () => {
  let service;
  let sandbox;
  let poolQueryStub;

  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    poolQueryStub = sandbox.stub(pool, "query");
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("addUser", () => {
    it("should return the new user id on successful creation", async () => {
      const payload = {
        username: "omkegams",
        email: "omkegams@gmail.com",
        password: "fufufafaomkegams",
      };
      const fakeUuid = crypto.randomUUID();
      const expectedId = `user-${fakeUuid}`;
      const fakeIdGenerator = () => fakeUuid;
      service = new UsersService(fakeIdGenerator);

      sandbox.stub(bcrypt, "hash").resolves("hashed_password_string");
      poolQueryStub.onCall(0).resolves({ rowCount: 0 });
      poolQueryStub.onCall(1).resolves({ rows: [{ id: expectedId }] });

      const createdUserId = await service.addUser(payload);
      expect(createdUserId).to.equal(expectedId);
    });

    it("should throw ClientError when username is already taken", async () => {
      service = new UsersService();
      const payload = {
        username: "omkegamser58",
        email: "omkeomke@proton.com",
        password: "password123",
      };
      poolQueryStub.resolves({ rowCount: 1 });

      await expect(service.addUser(payload)).to.reject(
        ClientError,
        "username already taken."
      );
    });
  });

  // test getuserbyemail
  describe("getUserByEmail", () => {
    it("should return user object when email exists", async () => {
      service = new UsersService();
      const mockUser = {
        id: "fufuf",
        email: "test@proton.com",
        password: "fufuaffafaf4542",
      };
      poolQueryStub.resolves({ rows: [mockUser] });

      const user = await service.getUserByEmail("test@proton.com");
      expect(user).to.equal(mockUser);
    });

    it("should return null when email does not exist", async () => {
      service = new UsersService();
      poolQueryStub.resolves({ rows: [] });

      const user = await service.getUserByEmail("notfound@proton.com");
      expect(user).to.be.null();
    });
  });
});
