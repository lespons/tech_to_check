// Button.stories.ts|tsx

import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';
import styled from 'styled-components';
import Form from './form';
import InputField from './form-field/input-field';

import * as yup from 'yup';
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Form',
  component: Form,
  subcomponents: { FormField: InputField },
} as ComponentMeta<typeof Form>;

export const BaseForm: ComponentStory<typeof Form> = () => (
  <Form
    name={'userForm'}
    onChange={(...args) => console.log(...args)}
    rules={yup.object().shape({
      firstName: yup.string().required(),
      secondName: yup.string(),
      areaCode: yup.number(),
      phoneNumber: yup
        .string()
        .matches(
          /(\+48)(\d{8})/gi,
          'Please use this format +48xxxyyydd (8  numbers after the code)'
        ),
    })}
    onCompleted={(values, errors) => {
      console.log(values, errors);
      if (!errors) {
        alert('Thanks for registration!');
      }
    }}
    onValuesChanged={(...args) => console.log(...args)}
    initialValues={{
      phoneNumber: '+48',
    }}
  >
    <FormFieldStyled>
      <InputField
        component={StyledFormInput}
        name={'firstName'}
        label={'First name'}
      />
      <InputField
        component={StyledFormInput}
        name={'secondName'}
        label={'Second name'}
      />
    </FormFieldStyled>
    <InputField
      component={StyledFormInput}
      name={'areaCode'}
      type={'number'}
      label={'Area code'}
    />
    <InputField
      component={StyledFormInput}
      name={'phoneNumber'}
      type={'text'}
      label={'Phone number'}
    />
    <SubmitButton type="submit">Submit</SubmitButton>
  </Form>
);

const SubmitButton = styled.button`
  margin-top: 1.5rem;
  font-size: 1rem;
`;

const StyledFormInput = styled.form`
  label {
    display: flex;
  }
`;

const FormFieldStyled = styled.div`
  display: flex;

  ${StyledFormInput} {
    label {
      font-weight: bold;
    }

    :not(:first-child) {
      margin-left: 1rem;
    }
  }
`;

export const BaseFormSet: ComponentStory<typeof Form> = () => (
  <Form initialValues={{}} component={'fieldset'}>
    <InputField
      component={StyledFormInput}
      name={'phoneNumber'}
      type={'text'}
      label={'Phone number'}
    />
  </Form>
);

export const FormWithStyles: ComponentStory<typeof Form> = () => (
  <Form initialValues={{}} component={StyledForm}>
    <InputField name={'phoneNumber'} type={'text'} label={'Phone number'} />
  </Form>
);

const StyledForm = styled.form`
  background: bisque;
`;

export const UnitForm = () => (
  <Form
    initialValues={{ name: '' }}
    onCompleted={() => {
      console.log('completed');
    }}
  >
    <InputField name={'name'} />
    <button type={'submit'}>Submit</button>
  </Form>
);
