import * as admin from "firebase-admin";
import {Firestore} from "firebase-admin/firestore";
import {getFirestore} from "./firestore.service";

describe("firestore", () => {
  jest.mock("firebase-admin");
  const mockAdmin = admin as jest.Mocked<typeof admin>;


  // This is the helper. It creates a mock function and returns it
  // when the firestore property is accessed.
  // SOURCE: https://stackoverflow.com/questions/61686830/error-mocking-firebase-admin-in-jest-typeerror-admin-firestore-is-not-a-funct
  const mockFirestoreProperty = (adminInstance:typeof admin) => {
    const firestore = jest.fn();
    Object.defineProperty(adminInstance, "firestore", {
      get: jest.fn(() => firestore),
      configurable: true,
    });
  };

  beforeEach(() => {
    mockFirestoreProperty(mockAdmin);
  });

  it("should create a firestore database and ignore undefineds", ()=>{
    const mockDb = {settings: jest.fn()};
    mockAdmin.firestore.mockReturnValue(mockDb as unknown as Firestore);

    const db = getFirestore();

    expect(mockAdmin.firestore).toBeCalled();
    expect(mockDb.settings).toBeCalledWith({ignoreUndefinedProperties: true});
    expect(mockDb).toEqual(db);
  });
});
