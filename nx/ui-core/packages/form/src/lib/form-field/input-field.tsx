import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FieldsContext } from '../context';
import { FormFieldElement, MainFormInstance } from '../models';
import styled from 'styled-components';
import type { StyledComponentBase } from 'styled-components';

type HtmlFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

export interface FormFieldProps extends HtmlFieldProps {
  name: string;
  label?: string;
  component?: 'div' | React.FC<any> | StyledComponentBase<any, any>;
  // TODO labelComponent, errorComponent
  // other props
}

// ClassComponent would be better?
export const InputField = React.forwardRef<FormFieldElement, FormFieldProps>(
  (
    { name, label, component: Component = 'div', ...restProps }: FormFieldProps,
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const formContext = useContext(FieldsContext);
    const formFieldName = `${formContext.formName || ''}_${name}`;

    const [value, setValue] = useState<any>(null);
    const [error, setError] = useState<string[] | null | undefined>(null);

    const fieldsHandlers: FormFieldElement = useMemo(
      () => ({
        setFieldValue: (value) => {
          setValue(value);
        },
        setFieldError: (error) => {
          setError(error);
        },
      }),
      [setValue]
    );

    useLayoutEffect(() => {
      const form = formContext.form as MainFormInstance;

      if (!form) {
        throw Error('InputField should be used with FormContext');
      }
      const initialValue = (formContext.form as MainFormInstance)
        .getInnerCalls()
        .getInitialValues()[name];

      setValue(() => initialValue);
    }, []);

    useEffect(() => {
      const calls = (formContext.form as MainFormInstance).getInnerCalls();

      calls.registerFields(name, fieldsHandlers);

      return () => {
        calls.unregisterFields(name);
      };
    }, [fieldsHandlers, name, formContext.form]);

    useImperativeHandle(ref, () => fieldsHandlers);

    return (
      <Component className={'InputField'}>
        {label ? <label htmlFor={formFieldName}>{label}</label> : null}
        <DefaultInput
          {...restProps}
          className={`InputField ${error ? ' FailedInput' : ''}`}
          failed={!!error}
          ref={inputRef}
          id={formFieldName}
          value={controlledValue(value)}
          onChange={(e) => {
            setValue(e.target.value);
            (formContext.form as MainFormInstance)
              .getInnerCalls()
              .triggerValuesChanged({
                [name]: e.target.value,
              });
          }}
        />
        {error ? (
          <DefaultErrorStyled className={`FieldError`}>
            {error.join(',')}
          </DefaultErrorStyled>
        ) : null}
      </Component>
    );
  }
);

export default InputField;

function controlledValue(value: any) {
  if (value === null || value === undefined) {
    return '';
  }
  return value;
}

const DefaultInput = styled.input<{ failed: boolean }>`
  border-color: ${({ theme, failed }) =>
    failed ? theme['red'] || 'red' : null};
  font-size: 13px;
`;

const DefaultErrorStyled = styled.div`
  color: ${({ theme }) => theme['red'] || 'red'};
  font-size: 13px;
`;
