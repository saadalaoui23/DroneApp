import { Formik } from "formik";
import * as yup from 'yup';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

 const Forget_Password=()=> {
        const schema = yup.object().shape({
        email: yup.string().email('Email invalide').required('L\'email est requis'),
        });
        const navigate= useNavigate()
        return (<>
        <Formik
            validationSchema={schema}
            onSubmit={console.log} 
            initialValues={{
              email: '',
            }}>
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form  className="form_connexion form-center" noValidate onSubmit={handleSubmit}>
                <Row className="mb-3 justify-content-center">
                  <Form.Group as={Col} md="6" controlId="validationFormik04">
                    <Form.Label>Verifiez votre Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder=""
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isValid={touched.email && !errors.email}
                      isInvalid={touched.email && !!errors.email}
                    /><Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                    </Row>
                    </Form>)}
                    </Formik>
                    <Button  onClick={()=>navigate(-1)} className='btn btn-outline-success' >Retour</Button>
        </>
  );
}
export default  Forget_Password;