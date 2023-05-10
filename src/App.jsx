import { Form as FinalForm, Field as FinalFormField } from "react-final-form";
import { setIn } from "final-form";
import { Container, Form, Button } from "semantic-ui-react";
import * as yup from "yup";

const validateFormValues =
  ({ schema, initialValues }) =>
  async (values) => {
    // if initialValues exist then we pass schema the form values and initialValues so that we can check for a change
    const schemaToValidate =
      typeof schema === "function"
        ? schema(initialValues ? values : undefined, initialValues)
        : schema;

    try {
      await schemaToValidate.validate(values, { abortEarly: false });
    } catch (err) {
      const errors = err.inner.reduce(
        (formError, innerError) =>
          setIn(formError, innerError.path, innerError.message),
        {}
      );

      return errors;
    }
    return {};
  };

export const schema = yup.object().shape(
  {
    firstName: yup.string().when("nickName", {
      is: (nickName) => nickName === null || nickName === undefined,
      then: yup
        .string()
        .required("you must provide either a firstName or a nickName"),
      otherwise: yup
        .string()
        .test(
          "mustSupplyEitherFirstNameOrNickname",
          "you cannot provide both firstName and nickName",
          (value) => value === null || value === undefined
        ),
    }),
    nickName: yup.string().when("firstName", {
      is: (firstName) => firstName === null || firstName === undefined,
      then: yup
        .string()
        .required("you must provide either a firstName or a nickName"),
      otherwise: yup
        .string()
        .test(
          "mustSupplyEitherFirstNameOrNickname",
          "you cannot provide both firstName and nickName",
          (value) => value === null || value === undefined
        ),
    }),
  },
  ["firstName", "nickName"]
);

const validate = validateFormValues({ schema });

function App() {
  return (
    <Container>
      <FinalForm
        validate={validate}
        onSubmit={(values) => alert(JSON.stringify(values))}
        render={({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <FinalFormField
                name="firstName"
                render={({ input, meta }) => (
                  <Form.Input
                    label="First Name"
                    id="firstName"
                    {...input}
                    {...meta}
                    error={meta.touched && meta.error ? meta.error : null}
                  />
                )}
              />
            </Form.Group>
            <Form.Group>
              <FinalFormField
                name="nickName"
                render={({ input, meta }) => (
                  <Form.Input
                    label="Nickname"
                    id="nickName"
                    {...input}
                    {...meta}
                    error={meta.touched && meta.error ? meta.error : null}
                  />
                )}
              />
            </Form.Group>
            <Button type="submit">Submit</Button>
          </Form>
        )}
      />
    </Container>
  );
}

export default App;
