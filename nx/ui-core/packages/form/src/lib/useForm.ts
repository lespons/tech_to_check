import {
  FormFieldElement,
  FormHandlers,
  FormInnerCalls,
  FormInstance,
  FormValues,
  MainFormInstance,
} from './models';
import { useRef } from 'react';
import type { AnySchema } from 'yup';
import { ValidationError } from 'yup';

export class FormProxy {
  private initialValues: FormValues = {};
  private values: FormValues = {};
  private handlers: FormHandlers = {};
  private fields: Record<string, FormFieldElement> = {};
  private rules: AnySchema | undefined;

  public createForm = (): FormInstance => {
    return {
      getFieldsError: this.getFieldsError,
      getInnerCalls: this.getInnerCalls,
    } as MainFormInstance;
  };

  getInnerCalls = (): FormInnerCalls => {
    return {
      setInitialValues: this.setInitialValues,
      setHandlers: this.setHandlers,
      triggerValuesChanged: this.triggerValueChanged,
      triggerCompleted: this.triggerCompleted,
      getInitialValues: this.getInitialValues,
      registerFields: this.registerFields,
      unregisterFields: this.unregisterFields,
      setRules: this.setRules,
    };
  };

  getFieldsError = () => {
    throw Error('getFieldsError is not implemented');
  };

  getInitialValues = () => {
    return { ...this.initialValues };
  };

  registerFields = (name: string, field: FormFieldElement) => {
    this.fields[name] = field;
  };

  unregisterFields = (name: string) => {
    delete this.fields[name];
  };

  setInitialValues = (initialValues: FormValues, mounted: boolean) => {
    if (!mounted) {
      this.initialValues = { ...initialValues };
      this.values = { ...initialValues };
    }
  };

  setHandlers = (handlers: FormHandlers) => {
    this.handlers = handlers;
  };

  setRules = (rules: AnySchema | undefined) => {
    this.rules = rules;
  };

  triggerValueChanged = (values: FormValues) => {
    this.values = {
      ...this.values,
      ...values,
    };

    const { onValuesChanged } = this.handlers;

    onValuesChanged?.(values, this.values);
  };

  triggerCompleted = () => {
    const { onCompleted } = this.handlers;

    Object.values(this.fields).forEach((field) => {
      // TODO use reset
      field.setFieldError(undefined);
    });

    if (!this.rules) {
      onCompleted?.(this.values, null);

      return;
    }

    this.rules
      ?.validate(this.values, { abortEarly: false })
      .then(() => {
        onCompleted?.(this.values, null);
      })
      .catch((error: ValidationError) => {
        error.inner.forEach(({ errors, path }) =>
          path ? this.fields[path].setFieldError(errors) : null
        );

        onCompleted?.(
          this.values,
          error.inner.reduce((result, currentError) => {
            if (currentError?.path) {
              result[currentError.path] = currentError.errors;
            }
            return result;
          }, {} as Record<string, string[]>)
        );
      });
  };
}

export function useForm<ValuesType = any>(
  form?: FormInstance<ValuesType>
): [FormInstance<ValuesType>] {
  const formRef = useRef<FormInstance>();
  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const formStore: FormProxy = new FormProxy();
      formRef.current = formStore.createForm();
    }
  }

  return [formRef.current];
}
