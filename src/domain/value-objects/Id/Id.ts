import { ValidationDomainError } from "@/domain/common/domainErrors";

import { ValueObject } from "../ValueObject";

type IdProps = {
  value: string;
};

export class Id extends ValueObject<IdProps> {
  private readonly _value: string;

  private constructor(props: IdProps) {
    super(props);

    this._value = props.value;
  }

  public static create(value: string) {
    if (!value) throw new ValidationDomainError("Id: value cannot be empty");

    if (typeof value !== "string")
      throw new ValidationDomainError("Id: value must be a string");

    if (value.trim() === "")
      throw new ValidationDomainError("Id: value cannot be empty");

    return new Id({ value: value.trim() });
  }

  get value(): string {
    return this._value;
  }
}
