import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

export const whitespaceValidator = (
  form: FormControl
): ValidationErrors | null => {
  return form.value.startsWith(' ') || form.value.endsWith(' ')
    ? { whitespace: true }
    : null;
};

export const passwordsMatch = (pass: string, passConfirm: string) => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get(pass);
    const passwordConfirm = formGroup.get(passConfirm);

    if (password?.value !== passwordConfirm?.value) {
      passwordConfirm?.setErrors({ passwordDoesMatch: true });
      return { passwordNotMatch: true };
    }

    passwordConfirm?.setErrors(null);

    return null;
  };
};

export const duplicatedValue = (arg1: string, arg2: string | string[]) => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(arg1);

    if (
      (arg2 instanceof String && control?.value === arg2) ||
      (arg2 instanceof Array && arg2.includes(control?.value))
    ) {
      control?.setErrors({ duplicated: true });

      return { duplicated: true };
    }

    control?.setErrors(control.errors);

    return null;
  };
};
