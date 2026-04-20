import { DomainDate } from '@/value-objects/DomainDate/DomainDate';
import { ValidationError } from '../../common/errors';

// TODO IMPORTANT CREATE DTO

export type ExerciseCreateProps = {
  id: string;
  name: string;
  // More props
  createdAt: Date;
  updatedAt: Date;
};

export type ExerciseProps = {
  id: string; // TODO change to Value Object
  name: string; // TODO change to Value Object
  // More props
  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export class Exercise {
  private constructor(private readonly props: ExerciseProps) {}

  static create(props: ExerciseCreateProps): Exercise {
    // Validation

    const entityProps: ExerciseProps = {
      // TODO more props validated with Value Objects
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new Exercise(entityProps);
  }

  // Getters
  get id() {
    // TODO include .value when changing to Value Object
    return this.props.id;
  }

  get name() {
    // TODO include .value when changing to Value Object
    return this.props.name;
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }
}
