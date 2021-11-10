import React, { useEffect } from "react";
import Header from "./layout/Header";
import UserHeader from "./layout/UserHeader";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../actionCreators";
import Copyright from "./layout/Copyright";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useHistory } from "react-router-dom";
import FirstStep from "./contractSteps/step1";
import SecondStep from "./contractSteps/step2";
import ThirdStep from "./contractSteps/step3";

const theme = createTheme();

const steps = ["Shipping address", "Payment details", "Review your order"];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <FirstStep />;
    case 1:
      return <SecondStep />;
    case 2:
      return <ThirdStep />;
    default:
      throw new Error("Unknown step");
  }
}

export default function ContractDetailsPage(props) {
  const is_staff = useSelector((state) => state.auth.user.is_staff);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const history = useHistory();
  const dispatch = useDispatch();
  const { loadUser } = bindActionCreators(actionCreators, dispatch);
  const contractCode = props.match.params.contractCode;
  console.log(contractCode);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        {isAuthenticated ? <UserHeader /> : <Header />}
        <div
          style={{
            marginLeft: "75px",
            marginRight: "75px",
            marginBottom: "75px",
            color: "#494949",
          }}
        >
          <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper
              variant="outlined"
              sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            >
              <Typography component="h1" variant="h4" align="center">
                Checkout
              </Typography>
              <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <React.Fragment>
                {activeStep === steps.length ? (
                  <React.Fragment>
                    <Typography variant="h5" gutterBottom>
                      Thank you for your order.
                    </Typography>
                    <Typography variant="subtitle1">
                      Your order number is #2001539. We have emailed your order
                      confirmation, and will send you an update when your order
                      has shipped.
                    </Typography>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {getStepContent(activeStep)}
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      {activeStep !== 0 && (
                        <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                          Back
                        </Button>
                      )}

                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 3, ml: 1 }}
                      >
                        {activeStep === steps.length - 1
                          ? "Place order"
                          : "Next"}
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
              </React.Fragment>
            </Paper>
            <Copyright />
          </Container>
        </div>
      </Container>
    </ThemeProvider>
  );
}
