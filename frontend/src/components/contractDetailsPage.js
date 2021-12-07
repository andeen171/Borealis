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
  Grid,
  TextField,
  Modal,
  Rating,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Link, useHistory } from "react-router-dom";
const theme = createTheme();
const steps = ["Shipping", "Diagnostics", "Fixing work", "Devolution / Review"];

export default function ContractDetailsPage(props) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user_id = useSelector((state) => state.auth.user.id);
  const stages = useSelector((state) => state.main.stages);
  const contract = useSelector((state) => state.main.contract);
  const dispatch = useDispatch();
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { loadUser, getContractInfo, progressContract, finishContract } =
    bindActionCreators(actionCreators, dispatch);
  const [activeStep, setActiveStep] = React.useState(contract.level);
  const [value, setValue] = React.useState(2);
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    progressContract(
      contractCode,
      data.get("description"),
      data.get("ending_prediction")
    );
    handleClose();
  };
  const contractCode = props.match.params.contractCode;

  useEffect(() => {
    loadUser();
    getContractInfo(contractCode, history);
    setActiveStep(contract.level);
  }, [contract.level, contract.closed, stages.length]);

  if (contract.closed) {
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
                <Grid spacing="10" container alignItems="center" align="center">
                  <Grid item xs={12}>
                    <Typography variant="h4" component="h5">
                      How would you rate the technician work
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Rating
                      size="large"
                      name="half-rating"
                      defaultValue={2.5}
                      precision={0.5}
                      value={value}
                      onChange={(event, newValue) => {
                        setValue(newValue);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      name="review"
                      id="review"
                      placeholder="Comments"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" to="/" component={Link}>
                      Send review
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Container>
          </div>
        </Container>
      </ThemeProvider>
    );
  }

  const stageSelector = () => {
    switch (activeStep - 1) {
      case 0:
        return (
          <React.Fragment>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h2" variant="h5" align="center">
                  Shipping in progress
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  component="h5"
                  variant="h6"
                  align="center"
                  paragraph
                >
                  Please wait until the technician gets your device and update
                  the order with further information.
                </Typography>
              </Grid>
            </Grid>
          </React.Fragment>
        );
      case 1:
        return (
          <Grid container alignItems="left" spacing={2}>
            <Grid item xs={12}>
              <Typography component="p" color="text.secondary">
                {stages[activeStep - 2].started_at}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography xs={12} component="h4" paragraph>
                The order is currently in the diagnostic stage, right now the
                technician is making a diagnosis of what is going to be done to
                your device.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="p" paragraph>
                Technician description about this stage:
                <br />
                {stages[activeStep - 2].description}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="p">
                {`Ending prediction: ${
                  stages[activeStep - 2].ending_prediction
                }`}
              </Typography>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container alignItems="left" spacing={2}>
            <Grid item xs={12}>
              <Typography component="p" color="text.secondary">
                {stages[activeStep - 2].started_at}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography xs={12} component="h4" paragraph>
                The order is currently in the fixing stage, right now the
                technician is doing the proper work to fix your device.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="p" paragraph>
                Technician description about this stage:
                <br />
                {stages[activeStep - 2].description}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="p">
                {`Ending prediction: ${
                  stages[activeStep - 2].ending_prediction
                }`}
              </Typography>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container alignItems="left" spacing={2}>
            <Grid item xs={12}>
              <Typography component="p" color="text.secondary">
                {stages[activeStep - 2].started_at}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography xs={12} component="h4" paragraph>
                The order is currently at the final stage, now you only have to
                get your device back and review the order. If you already got
                your device back wait until the technician update the order so
                you can do your review
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="p" paragraph>
                Technician description about this stage:
                <br /> {stages[activeStep - 2].description}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography component="p">
                {`Ending prediction: ${
                  stages[activeStep - 2].ending_prediction
                }`}
              </Typography>
            </Grid>
          </Grid>
        );
    }
  };

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
                Order Progress
              </Typography>
              <Stepper activeStep={activeStep - 1} sx={{ pt: 3, pb: 5 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <React.Fragment>
                {stageSelector()}
                <React.Fragment>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    {activeStep !== 1 && (
                      <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                        Back
                      </Button>
                    )}
                    {activeStep !== contract.level && (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 3, ml: 1 }}
                      >
                        Next
                      </Button>
                    )}
                    {user_id === contract.technician && (
                      <Grid>
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={
                            contract.level === 4
                              ? () => finishContract(contractCode)
                              : handleOpen
                          }
                          sx={{ mt: 3, ml: 1 }}
                        >
                          {contract.level === 4 ? "Finish" : "Advance"}
                        </Button>
                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 400,
                              bgcolor: "background.paper",
                              boxShadow: 24,
                              p: 4,
                            }}
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                          >
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={12}>
                                <TextField
                                  autoComplete="description"
                                  name="description"
                                  required
                                  fullWidth
                                  id="description"
                                  label="Describe what you'll do"
                                  autoFocus
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  id="ending_prediction"
                                  label="Prediction To End"
                                  type="datetime-local"
                                  defaultValue="2017-05-24T10:30"
                                  sx={{ width: 250 }}
                                  name="ending_prediction"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Typography
                              id="modal-modal-description"
                              sx={{ mt: 2 }}
                            >
                              <Button
                                variant="outlined"
                                size="large"
                                color="success"
                                type="submit"
                              >
                                Advance Stage
                              </Button>
                            </Typography>
                          </Box>
                        </Modal>
                      </Grid>
                    )}
                  </Box>
                </React.Fragment>
              </React.Fragment>
            </Paper>
            <Copyright />
          </Container>
        </div>
      </Container>
    </ThemeProvider>
  );
}
