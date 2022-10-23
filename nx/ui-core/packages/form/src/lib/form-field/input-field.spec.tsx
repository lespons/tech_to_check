import { render } from '@testing-library/react';

import InputField from './input-field';
import { Form } from '@ui-core/form';

describe('FormField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Form initialValues={{}}>
        <InputField name={'testname'} />
      </Form>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should thrown render error without Form', () => {
    try {
      render(<InputField name={'testname'} />);
      expect(false).toEqual(true);
    } catch (e: any) {
      expect(e?.message).toEqual('InputField should be used with FormContext');
    }
  });

  // TODO
});
