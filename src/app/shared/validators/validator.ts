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
