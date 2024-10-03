import { ReactNode } from "react";

/**
 * # This is an interface which defines the properties of a basic form.
 *
 * FORM_PROP: interface | This is an interface which defines the properties of the form.
 *
 * name: string | This is the form's name which act like a unique identifier for the component. Note that there is no identifier uniqueness checking system. So please be careful when naming your forms.
 *
 * title: string | This is the title of the form.
 *
 * formInputs?: any[] | (Optional) This is an array of objects which is used to build the form's input elements. The order of each object will decide the appearance order of the rendered elements.
 *
 * formFieldPropInitialization: FORM_PROP | This is the form initialize object when the component is rendered.
 *
 * submitButtonText?: string | (Optional) This is the text which is displayed on the form submit button.
 *
 * onFormSubmit: (formValues: FORM_PROP) => void | This is a function which get executed when the form is submitted.
 *
 * footerChildren? ReactNode[] | (Optional) This is an array of react node of the footer section of the base form. This can be used to add additional components to the base form.
 *
 * ---
 *
 * Sample usage: Check the AuthenticationForm or RegisterForm component for sample usage.
 */
export interface FormBaseProp<FORM_PROP> {
  name: string;

  title: string;

  formInputs?: any[];

  formInitializedObject: FORM_PROP;

  submitButtonText?: string;

  onFormSubmit: (formValues: FORM_PROP) => any;

  footerChildren?: ReactNode[];
}
