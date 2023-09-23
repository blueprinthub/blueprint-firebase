/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable new-cap */
import "reflect-metadata";
import { container } from "tsyringe";

const VALID_API_KEY = "abc123";
const VALID_UID = "123";
const apiKeyService = { getUserByKey: jest.fn() };
container.register("api-key", { useValue: apiKeyService });

import { ApiKeyCurrentUser } from "./api-key.middleware";

const mockRequest = (headers: any = {}): any => {
  return { headers };
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("ApiKeyCurrentUser middleware", () => {
  beforeEach(() => {
    container.register("api-key", { useValue: apiKeyService });
  });

  it("should allow access with a valid authorization header", async () => {
    const req = mockRequest({ authorization: `Token ${VALID_API_KEY}` });
    const res = mockResponse();

    apiKeyService.getUserByKey.mockReturnValue(VALID_UID);

    const result = await ApiKeyCurrentUser(req, res);

    expect(req.headers.uid).toEqual(VALID_UID);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it("should send an error response for an invalid authorization header", async () => {
    const req = mockRequest({ authorization: `Bearer ${VALID_API_KEY}` });
    const res = mockResponse();

    apiKeyService.getUserByKey.mockReturnValue(VALID_UID);
    const result = await ApiKeyCurrentUser(req, res);

    expect(req.headers.uid).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(result).toBeFalsy();
  });

  it("should send an error response if the api key service returns null", async () => {
    const req = mockRequest({ authorization: `Token ${VALID_API_KEY}` });
    const res = mockResponse();

    apiKeyService.getUserByKey.mockReturnValue(null);
    const result = await ApiKeyCurrentUser(req, res);

    expect(apiKeyService.getUserByKey).toHaveBeenCalledWith(VALID_API_KEY);
    expect(req.headers.uid).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(result).toBeFalsy();
  });

  it("should send an error response if the token keyword is not 'Token'", async () => {
    const req = mockRequest({ authorization: `Bearer ${VALID_API_KEY}` });
    const res = mockResponse();

    apiKeyService.getUserByKey.mockReturnValue(VALID_UID);
    const result = await ApiKeyCurrentUser(req, res);

    expect(req.headers.uid).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(result).toBeFalsy();
  });

  it("should send an error response if the api key is an empty string", async () => {
    const req = mockRequest({ authorization: "Token" });
    const res = mockResponse();

    apiKeyService.getUserByKey.mockReturnValue(VALID_UID);
    const result = await ApiKeyCurrentUser(req, res);

    expect(req.headers.uid).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(result).toBeFalsy();
  });
});
