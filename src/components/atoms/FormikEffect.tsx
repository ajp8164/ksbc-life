import { FormikProps, connect } from 'formik';
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Values = any;

interface OuterProps<Values> {
  onChange: (
    currentState: FormikProps<Values>,
    previousState: FormikProps<Values> | null,
  ) => void;
}

interface Props<Values> extends OuterProps<Values> {
  formik: FormikProps<Values>;
}

const FormikEffect = ({ formik, onChange }: Props<Values>) => {
  const ref = useRef<FormikProps<Values> | null>(null);

  useEffect(() => {
    onChange(formik, ref.current);
    ref.current = formik;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik]);

  return null;
};

export default connect(FormikEffect);
