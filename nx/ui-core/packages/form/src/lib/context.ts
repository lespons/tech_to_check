import React from 'react';
import { FormInstance } from './models';

export interface FieldsContextProps {
  formName?: string;
  form: FormInstance | undefined;
}

export const FieldsContext = React.createContext<FieldsContextProps>({
  form: undefined,
});
