import { Exercise, ExerciseCreateProps } from '../Exercise';
import { ValidationError } from '@/domain/common/errors';
import { validExerciseProps } from '@/../tests/createProps/exerciseTestProps';

describe('Exercise', () => {
  let exercise: Exercise;
  let validExerciseProps: ExerciseCreateProps;

  beforeEach(() => {
    validExerciseProps = {
      ...validExerciseProps,
    };
    exercise = Exercise.create(validExerciseProps);
  });

  it('should create a valid exercise', () => {
    expect(exercise).toBeInstanceOf(Exercise);
  });
});
