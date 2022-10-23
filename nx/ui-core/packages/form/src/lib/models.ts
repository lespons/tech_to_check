import type { AnySchema } from 'yup';

export interface FormInstance<ValuesType = any> {
  getFieldsError: () => Record<string, string>;
}

export interface FormInnerCalls {
  triggerValuesChanged: (value: FormValues) => void;
  triggerCompleted: () => void;

  registerFields: (fieldName: string, field: FormFieldElement) => void;
  unregisterFields: (fieldName: string) => void;
  getInitialValues: () => FormValues;
  setInitialValues: (values: FormValues, mounted: boolean) => void;
  setHandlers: (handlers: FormHandlers) => void;
  setRules: (rules: AnySchema | undefined) => void;
}

export interface MainFormInstance extends FormInstance {
  getInnerCalls(): FormInnerCalls;
}

export type FormValues = Record<string, any>;

export interface FormHandlers<Values = any> {
  onValuesChanged?: (changedValues: any, values: Values) => void;
  onCompleted?: (
    values: Values,
    errors: Record<string, string[]> | null
  ) => void;
}

export interface FormFieldElement {
  setFieldValue: (value: any) => void;
  setFieldError: (error?: string[] | null) => void;
}

export interface FormElement {
  getForm: () => FormInstance;
}
