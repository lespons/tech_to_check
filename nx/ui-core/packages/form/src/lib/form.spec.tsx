import { fireEvent, render, waitFor } from '@testing-library/react';

import Form from './form';
import { FormProxy, useForm } from './useForm';
import { FormElement, MainFormInstance } from './models';
import { InputField } from '@ui-core/form';
import * as yup from 'yup';

describe('Form', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Form initialValues={{}} />);
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully with wrapper', () => {
    const { baseElement } = render(<FormWrapper />);
    expect(baseElement).toBeTruthy();
  });

  it('should use form from props', async () => {
    const formInstance = new FormProxy().createForm();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    formInstance['testId'] = 'testId';
    let formRef: FormElement;

    render(
      <Form
        ref={(instance) => {
          formRef = instance!;
        }}
        form={formInstance}
        initialValues={{}}
      />
    );
    expect(formInstance).toEqual(formRef!.getForm());
  });

  it('should use initialValues from props', async () => {
    let formRef: FormElement;

    const initialValues = {
      name: 'name1',
    };
    const { container } = render(
      <Form
        ref={(instance) => {
          formRef = instance!;
        }}
        initialValues={initialValues}
      >
        <InputField name={'name'} />
      </Form>
    );
    expect(initialValues).toEqual(
      (formRef!.getForm() as MainFormInstance)
        .getInnerCalls()
        .getInitialValues()
    );

    container.querySelectorAll('input').forEach((v) => {
      expect(v.value).toBe(initialValues.name);
    });
  });

  it('should submit without rules', async () => {
    let formRef: FormElement;

    const initialValues = {
      name: '',
    };

    const onCompleted = jest.fn();
    const { container } = render(
      <Form
        ref={(instance) => {
          formRef = instance!;
        }}
        initialValues={initialValues}
        onCompleted={onCompleted}
      >
        <InputField name={'name'} />
        <button type={'submit'}>Submit</button>
      </Form>
    );

    await container.querySelector('button')?.click();

    await waitFor(() => expect(onCompleted).toBeCalledWith({ name: '' }, null));

    await waitFor(() =>
      expect(container.querySelector('.FieldError')).toBeFalsy()
    );
  });

  it('should submit with rules', async () => {
    let formRef: FormElement;

    const initialValues = {
      name: 'test',
    };

    const onCompleted = jest.fn();
    const { container } = render(
      <Form
        ref={(instance) => {
          formRef = instance!;
        }}
        initialValues={initialValues}
        rules={yup.object().shape({
          name: yup.string().required(),
        })}
        onCompleted={onCompleted}
      >
        <InputField name={'name'} />
        <button type={'submit'}>Submit</button>
      </Form>
    );

    await container.querySelector('button')?.click();

    await waitFor(() =>
      expect(onCompleted).toBeCalledWith(initialValues, null)
    );

    await waitFor(() =>
      expect(container.querySelector('.FieldError')).toBeFalsy()
    );
  });

  it('should fail submit with rules', async () => {
    let formRef: FormElement;

    const initialValues = {
      name: '',
    };

    const onCompleted = jest.fn();
    const { container, findByText } = render(
      <Form
        ref={(instance) => {
          formRef = instance!;
        }}
        initialValues={initialValues}
        rules={yup.object().shape({
          name: yup.string().required(),
        })}
        onCompleted={onCompleted}
      >
        <InputField name={'name'} />
        <button type={'submit'}>Submit</button>
      </Form>
    );

    await container.querySelector('button')?.click();

    await waitFor(() =>
      expect(onCompleted).toBeCalledWith(initialValues, {
        name: ['name is a required field'],
      })
    );

    await waitFor(() =>
      expect(container.querySelector('.FieldError')).toBeTruthy()
    );
  });

  // TODO add more
});

const FormWrapper = () => {
  const [formInstance] = useForm();

  return <Form initialValues={{}} form={formInstance} />;
};
