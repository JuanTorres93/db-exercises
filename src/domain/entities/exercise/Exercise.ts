import { DomainDate } from "@/value-objects/DomainDate/DomainDate";
import { Id } from "@/value-objects/Id/Id";
import { Text, TextOptions } from "@/value-objects/Text/Text";

// TODO NEXT IMPORTANT CREATE DTO

export type ExerciseCreateProps = {
  id: string;
  name: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ExerciseProps = {
  id: Id;
  name: Text;
  userId?: Id;
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export class Exercise {
  private constructor(private readonly props: ExerciseProps) {}

  static create(props: ExerciseCreateProps): Exercise {
    const entityProps: ExerciseProps = {
      id: Id.create(props.id),
      name: Text.create(props.name, nameTextOptions),
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
      userId: props.userId ? Id.create(props.userId) : undefined,
    };

    return new Exercise(entityProps);
  }

  rename(newName: string) {
    this.props.name = Text.create(newName, nameTextOptions);

    this.props.updatedAt = DomainDate.create(new Date());
  }

  get id() {
    return this.props.id.value;
  }

  get userId() {
    return this.props.userId?.value;
  }

  get name() {
    return this.props.name.value;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }

  toCreateProps(): ExerciseCreateProps {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId,
    };
  }
}

export const nameTextOptions: TextOptions = {
  maxLength: 100,
  canBeEmpty: false,
};
