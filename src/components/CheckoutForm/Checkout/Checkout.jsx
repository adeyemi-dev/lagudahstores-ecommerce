import React, { useState, useEffect } from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
  CssBaseline,
} from "@material-ui/core";
import { commerce } from "../../../lib/commerce";
import useStyles from "./styles";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import { Link, useHistory } from "react-router-dom";

const steps = ["Shipping address", "Payment details"];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const classes = useStyles();
  const history = useHistory();

  //generate checkout token
  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: "cart",
        });
        // console.log(token);
        setCheckoutToken(token);
      } catch (error) {
        history.pushState("/ ");
      }
    };
    generateToken();
  }, [cart]);

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const next = (data) => {
    setShippingData(data);

    nextStep();
  };
  const timeout = () => {
    setTimeout(() => {
      setIsFinished(true);
    }, 3000);
  };

  let Confirmation = () =>
    order.customer ? (
      <>
        <div>
          <Typography variant='h5'>
            Thank You For Your Purchase,{order.customer.firstname}
            {order.customer.lastname}
          </Typography>
          <Divider className={classes.divider}></Divider>
          <Typography variant='subtitle2'>
            Order ref : {order.customer_reference}
          </Typography>
        </div>
        <br />
        <Button component={Link} to='/' variant='outlined' type='button'>
          Back to Home
        </Button>
      </>
    ) : isFinished ? (
      <>
        <div>
          <Typography variant='h5'>Thank You For Your Purchase,</Typography>
          <Divider className={classes.divider}></Divider>
        </div>
        <br />
        <Button component={Link} to='/' variant='outlined' type='button'>
          Back to Home
        </Button>
      </>
    ) : (
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    );

  if (error) {
    <>
      <Typography varaint='h5'>Error:{error}</Typography>
      <br />
      <Button component={Link} to='/' variant='outlined' type='button'>
        Back to Home
      </Button>
    </>;
  }

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        nextStep={nextStep}
        backStep={backStep}
        onCaptureCheckout={onCaptureCheckout}
        timeout={timeout}
      />
    );

  return (
    <>
      <CssBaseline />
      <div className={classes.toobar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant='h4' align='center'>
            Check Out
          </Typography>
          <Stepper activeStep={0} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
