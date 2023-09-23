import { withMiddlewares } from "./apply-middlewares";

describe("withMiddlewares", () => {
  test("Should run the handler if there are no middlewares", () => {
    const handler = jest.fn();
    const onRequest = withMiddlewares()(handler);
    const request = { query: {}, body: {} };
    const response = {};

    onRequest(request as never, response as never);
    expect(handler).toHaveBeenCalledWith(request, response);
  });

  test("Should run the handler if all middlewares return true", async () => {
    const handler = jest.fn();
    const middleware1 = jest.fn().mockReturnValue(true);
    const middleware2 = jest.fn().mockReturnValue(true);
    const onRequest = withMiddlewares(middleware1, middleware2)(handler);
    const request = { query: {}, body: {} };
    const response = {};

    await onRequest(request as never, response as never);
    expect(middleware1).toHaveBeenCalledWith(request, response);
    expect(middleware2).toHaveBeenCalledWith(request, response);
    expect(handler).toHaveBeenCalledWith(request, response);
  });

  test("Should stop running middlewares if one of them returns false", async () => {
    const handler = jest.fn();
    const middleware1 = jest.fn().mockReturnValue(true);
    const middleware2 = jest.fn().mockReturnValue(false);
    const middleware3 = jest.fn();
    const onRequest = withMiddlewares(middleware1, middleware2, middleware3)(handler);
    const request = { query: {}, body: {} };
    const response = {};

    await onRequest(request as never, response as never);
    expect(middleware1).toHaveBeenCalledWith(request, response);
    expect(middleware2).toHaveBeenCalledWith(request, response);
    expect(middleware3).not.toHaveBeenCalled();
    expect(handler).not.toHaveBeenCalled();
  });

  test("Should run async middlewares in the correct order", async () => {
    const handler = jest.fn();
    const middleware1 = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 50);
      });
    });
    const middleware2 = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 25);
      });
    });
    const onRequest = withMiddlewares(middleware1, middleware2)(handler);
    const request = { query: {}, body: {} };
    const response = {};

    await onRequest(request as never, response as never);
    expect(middleware1).toHaveBeenCalledWith(request, response);
    expect(middleware2).toHaveBeenCalledWith(request, response);
    expect(handler).toHaveBeenCalledWith(request, response);
  });
});
