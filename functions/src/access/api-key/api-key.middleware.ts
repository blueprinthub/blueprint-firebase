import {container} from "tsyringe";
import {Middleware} from "../http/middleware/apply-middlewares";
import {ApiKeyService} from "./api-key.service";

const apiKeyService = container.resolve<ApiKeyService>("api-key");

export const ApiKeyCurrentUser:Middleware = async (req, res) => {
  let next = false;
  const header = req.headers.authorization;
  if (header) {
    const [tokenKeyword, key] = header.split(" ");
    if (tokenKeyword === "Token" && !!key) {
      const uid = await apiKeyService.getUserByKey(key);
      if (uid) {
        req.headers["uid"]= uid;
        next = true;
      }
    }
  }

  if (!next) res.status(401).json();

  return next;
};
