import { v4 as uuidv4 } from "uuid";

import { IdGenerator } from "@/application-layer/services/IdGenerator.port";

export class Uuidv4IdGenerator implements IdGenerator {
  generateId(): string {
    return uuidv4();
  }
}
