import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsFutureUtcDate', async: false })
export class IsFutureUtcDateConstraint implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments): boolean {
    const date = new Date(value);
    const now = new Date();

    return (
      !isNaN(date.getTime()) && // valid date
      value === date.toISOString() && // must be strict UTC ISO format
      date > now // must be in the future
    );
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'desireDate must be a valid UTC ISO date string in the future (e.g. 2025-07-12T10:00:00.000Z)';
  }
}
