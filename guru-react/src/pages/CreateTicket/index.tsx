import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";

import { withStyles, WithStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import Lock from "@material-ui/icons/Lock";
import LockOpen from "@material-ui/icons/LockOpen";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Modal from "@material-ui/core/Modal";

import { colors } from "../../theme";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Page from "../../components/Page";
import { WithUserProps, withUser } from "../../state/hocs/profiles";
import {
  WithCreateTicketProps,
  withCreateTicket
} from "../../state/hocs/ticket";
import { WithInfoProps, withInfo } from "../../state/hocs/info";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step8 from "./Step8";
import Step9 from "./Step9";
import { paths } from "../../routes";
import TicketDetailSideBarItem, {
  MenuType
} from "../../components/TicketDetail/TicketDetailSideBarItem";

import "easymde/dist/easymde.min.css";
import { history } from "../../state/store";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: colors.SECONDARY_BACKGROUND,
      marginTop: "4em"
    },
    nextButton: {
      color: colors.MAIN_BACKGROUND,
      backgroundColor: colors.MAIN_COLOR
    }
  });

type Props = WithUserProps &
  WithCreateTicketProps &
  WithInfoProps &
  RouteComponentProps &
  WithStyles<typeof styles>;

interface State {
  isLoading: boolean;
}

class CreateTicket extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    const { newTicket, history } = this.props;
    const paramsStep = parseInt((this.props.match.params as any).step, 10);
    if (isNaN(paramsStep)) {
      history.push(paths.getCreateTicketPath(newTicket.step));
    }
  }

  next = () => {
    const newStep = this.props.newTicket.step + 1;
    this.props.setCreateTicketStep(newStep);
    history.push(paths.getCreateTicketPath(newStep));
  };

  back = () => {
    const { setCreateTicketStep, newTicket } = this.props;
    const newStep = newTicket.step - 1;
    if (newTicket.step > 1) setCreateTicketStep(newStep);
    history.push(paths.getCreateTicketPath(newStep));
  };

  createTicket = () => {
    const { createTicket, clearTicketEntry, newTicket, history } = this.props;
    createTicket(newTicket).then(ticket => {
      clearTicketEntry();
      history.push(paths.getTicketDetailPath(ticket.slug));
    });
  };

  cancel = () => {
    this.props.clearTicketEntry();
  };

  render() {
    const { classes, newTicket, user } = this.props;
    const { isLoading } = this.state;
    const {
      step,
      companyAssociation,
      createdFor,
      issueType,
      category,
      os,
      gluuServer,
      hasProducts
    } = newTicket;

    const isCommunity = user
      ? user.role
        ? user.role.name === "community"
        : true
      : true;

    return (
      <Page>
        <Navbar />
        <div className={`app-body ${classes.root}`}>
          <Container fixed>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6">Create Ticket</Typography>
                <p>Step {step} of 9</p>
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item md={8}>
                {step === 1 ? (
                  <Step1 />
                ) : step === 2 ? (
                  <Step2 />
                ) : step === 3 ? (
                  <Step3 />
                ) : step === 4 ? (
                  <Step4 />
                ) : step === 5 ? (
                  <Step5 />
                ) : step === 6 ? (
                  <Step6 />
                ) : step === 7 ? (
                  <Step7 />
                ) : step === 8 ? (
                  <Step8 />
                ) : step === 9 ? (
                  <Step9 />
                ) : null}
              </Grid>
              <Grid item md={3}>
                {companyAssociation ? (
                  <TicketDetailSideBarItem
                    menuType={MenuType.CompanyAssociation}
                    ticket={newTicket}
                    canEdit={true}
                    isNew={true}
                  />
                ) : null}
                {createdFor ? (
                  <TicketDetailSideBarItem
                    menuType={MenuType.Creator}
                    ticket={newTicket}
                    canEdit={true}
                    isNew={true}
                  />
                ) : null}
                {issueType ? (
                  <TicketDetailSideBarItem
                    menuType={MenuType.IssueType}
                    ticket={newTicket}
                    canEdit={true}
                    isNew={true}
                  />
                ) : null}
                {category ? (
                  <TicketDetailSideBarItem
                    menuType={MenuType.Category}
                    ticket={newTicket}
                    canEdit={true}
                    isNew={true}
                  />
                ) : null}
                {gluuServer ? (
                  <TicketDetailSideBarItem
                    menuType={MenuType.GluuServer}
                    ticket={newTicket}
                    canEdit={true}
                    isNew={true}
                  />
                ) : null}
                {os ? (
                  <TicketDetailSideBarItem
                    menuType={MenuType.Os}
                    ticket={newTicket}
                    canEdit={true}
                    isNew={true}
                  />
                ) : null}
                {hasProducts ? (
                  <TicketDetailSideBarItem
                    menuType={MenuType.Products}
                    ticket={newTicket}
                    canEdit={true}
                    isNew={true}
                  />
                ) : null}
                {step === 9 ? (
                  <TicketDetailSideBarItem
                    menuType={MenuType.NewProduct}
                    ticket={newTicket}
                    canEdit={true}
                    isNew={true}
                  />
                ) : null}
              </Grid>
            </Grid>
            <Box mt={2}>
              {step === 9 ? (
                <Grid container>
                  <Grid item>
                    <Button
                      classes={{ root: classes.nextButton }}
                      onClick={this.createTicket}
                    >
                      Save and Submit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={this.cancel}>Cancel</Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid container>
                  <Grid item>
                    <Button onClick={this.back}>Back</Button>
                  </Grid>
                  <Grid item>
                    <Button
                      classes={{ root: classes.nextButton }}
                      onClick={this.next}
                    >
                      Next
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Container>
          <Footer />
        </div>
      </Page>
    );
  }
}

export default withRouter(
  withInfo(withCreateTicket(withUser(withStyles(styles)(CreateTicket))))
);
