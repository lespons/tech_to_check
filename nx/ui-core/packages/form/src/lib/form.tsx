import React, {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { FieldsContext } from './context';
import { useForm } from './useForm';
import {
  FormElement,
  FormInstance,
  FormValues,
  MainFormInstance,
} from './models';
import * as yup from 'yup';

type HtmlFormProps = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'children'
>;

export type FormChildrenRender = (
  values: any,
  formInstance: any
) => React.ReactNode;

export interface FormProps extends HtmlFormProps {
  name?: string;
  children?: FormChildrenRender | React.ReactNode;
  component?: 'form' | 'fieldset' | React.FC<any>;
  form?: FormInstance<FormValues>;
  initialValues: FormValues;
  rules?: yup.AnySchema;
  onValuesChanged?(
    changedValues: Partial<FormValues>,
    values: FormValues
  ): void;
  onCompleted?(
    values: FormValues,
    errors: Record<string, string[]> | null
  ): void;
}

export const Form = forwardRef<FormElement, FormProps>(
  (
    {
      component: Component = 'form',
      children,
      name: formName,
      form,
      rules,
      onValuesChanged,
      onCompleted,
      initialValues,
      ...restProps
    }: FormProps,
    ref
  ) => {
    const mounted = useRef(false);
    const [formInstance] = useForm(form);

    useEffect(() => {
      (formInstance as MainFormInstance).getInnerCalls().setHandlers({
        onValuesChanged,
        onCompleted,
      });
    }, [formInstance, onValuesChanged, onCompleted]);

    useEffect(() => {
      (formInstance as MainFormInstance).getInnerCalls().setRules(rules);
    }, [formInstance, rules]);

    (formInstance as MainFormInstance)
      .getInnerCalls()
      .setInitialValues(initialValues, mounted.current);

    useImperativeHandle(ref, () => ({
      getForm: () => formInstance,
    }));

    useEffect(() => {
      mounted.current = true;
    }, []);

    return (
      <FieldsContext.Provider
        value={{
          formName,
          form: formInstance,
        }}
      >
        <Component
          {...restProps}
          role="form"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.stopPropagation();
            e.preventDefault();
            (formInstance as MainFormInstance)
              .getInnerCalls()
              .triggerCompleted();
          }}
        >
          {children}
        </Component>
      </FieldsContext.Provider>
    );
  }
);

export default Form;
