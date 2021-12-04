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
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
const theme = createTheme();
const steps = ["Shipping", "Diagnostics", "Fixing work", "Review Service"];

export default function ContractDetailsPage(props) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user_id = useSelector((state) => state.auth.user.id);
  const stages = useSelector((state) => state.main.stages);
  const contract = useSelector((state) => state.main.contract);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { loadUser, getContractInfo, progressContract, finishContract } =
    bindActionCreators(actionCreators, dispatch);
  const [activeStep, setActiveStep] = React.useState(contract.level);
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (contract.level === 4) {
      finishContract(contractCode);
      return;
    }
    progressContract(
      contractCode,
      data.get("description"),
      data.get("ending_prediction")
    );
  };
  const contractCode = props.match.params.contractCode;

  useEffect(() => {
    loadUser();
    getContractInfo(contractCode);
    setActiveStep(contract.level);
  }, [contract.level, contract.closed]);

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
                {activeStep > 1 ? (
                  <Grid container alignItems="left">
                    <Typography
                      component="h4"
                      variant="h5"
                      color="text.secondary"
                    >
                      {stages[activeStep - 2].started_at}
                    </Typography>
                    <Typography component="h4" variant="h5" paragraph>
                      {stages[activeStep - 2].description}
                    </Typography>
                    <Typography component="h5" variant="h5">
                      Ending prediction:{" "}
                      {stages[activeStep - 2].ending_prediction}
                    </Typography>
                  </Grid>
                ) : (
                  <React.Fragment>
                    <Typography component="h2" variant="h5" align="center">
                      Shipping in progress
                    </Typography>
                    <Typography
                      component="h5"
                      variant="h6"
                      align="center"
                      paragraph
                    >
                      Please wait until the technician gets your device and
                      update the order with further information.
                    </Typography>
                  </React.Fragment>
                )}
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
                          variant="outline"
                          onClick={
                            contract.level === 4
                              ? () => finishContract(contractCode)
                              : handleOpen
                          }
                          sx={{ mt: 3, ml: 1 }}
                        >
                          Advance
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
                                {contract.level < 4
                                  ? "Advance Stage"
                                  : "Finish contract"}
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
