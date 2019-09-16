import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { withStyles, WithStyles, createStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import {
  withTicketDetail,
  WithTicketDetailProps
} from "../../state/hocs/tickets";
import { withInfo, WithInfoProps } from "../../state/hocs/info";
import { colors } from "../../theme";
import { TicketProduct } from "../../state/types/tickets";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: colors.MAIN_BACKGROUND,
      padding: "2em 5em"
    },
    saveButton: {
      color: colors.MAIN_BACKGROUND,
      backgroundColor: colors.MAIN_COLOR
    }
  });

interface ExternalProps {
  product?: TicketProduct;
  closeModal: () => void;
}

type Props = ExternalProps &
  WithInfoProps &
  WithTicketDetailProps &
  WithStyles<typeof styles> &
  RouteComponentProps;

interface State {
  product?: number;
  version: string;
  os: string;
  osVersion: string;
  errorMessage: string;
}

class ChangeProduct extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { product } = props;
    let gluuProduct: number | undefined = undefined;
    let version: string = "";
    let os: string = "";
    let osVersion: string = "";

    if (product) {
      gluuProduct = product.product;
      version = product.version;
      os = product.os;
      osVersion = product.osVersion;
    }
    this.state = {
      version,
      os,
      osVersion,
      product: gluuProduct,
      errorMessage: ""
    };
  }

  changeProduct = (event: React.ChangeEvent<HTMLInputElement>) => {
    const gluuProduct = parseInt(event.target.value, 10);
    const isProductValid =
      this.props.info.products.find(item => item.id === gluuProduct) !==
      undefined;
    if (!isNaN(gluuProduct) && isProductValid) {
      const product = gluuProduct;
      this.setState({ product });
    } else {
      this.setState({ product: undefined });
    }
  };

  changeOsVersion = (event: React.ChangeEvent<HTMLInputElement>) => {
    const osVersion = event.target.value;
    this.setState({ osVersion });
  };

  changeVersion = (event: React.ChangeEvent<HTMLInputElement>) => {
    const version = event.target.value;
    this.setState({ version });
  };

  changeOs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const os = event.target.value;
    this.setState({ os });
  };

  saveProduct = () => {
    const { product: gluuProduct, version, osVersion, os } = this.state;
    const { product, ticket, closeModal } = this.props;
    if (!ticket) return;

    let invalidFields = [];
    if (!gluuProduct) invalidFields.push("product");
    if (!version) invalidFields.push("version");
    if (!osVersion) invalidFields.push("os version");
    if (!os) invalidFields.push("os");

    if (invalidFields.length) {
      this.setState({
        errorMessage: `Invalid entry for: ${invalidFields.join(", ")}`
      });
      return;
    }

    if (product && gluuProduct) {
      this.props
        .updateTicketProduct(ticket.slug, {
          ...product,
          product: gluuProduct,
          version,
          osVersion,
          os
        })
        .then(() => {
          closeModal();
        });
    } else if (gluuProduct) {
      this.props
        .createTicketProduct(ticket.slug, {
          id: NaN,
          product: gluuProduct,
          version,
          osVersion,
          os
        })
        .then(() => {
          closeModal();
        });
    }
  };

  render() {
    const { classes, closeModal, info } = this.props;
    const ticketProduct = this.props.product;
    const { product, version, osVersion, os } = this.state;
    const { products } = info;
    const gluuProduct = products.find(item => item.id === product);
    const versionOptions = gluuProduct ? gluuProduct.version : [];
    const osOptions = gluuProduct
      ? [
          "Ubuntu",
          "CentOS",
          "RHEL",
          "Debian",
          "Docker",
          "RH Container",
          "Other"
        ]
      : [];

    return (
      <div className={classes.root}>
        <Typography variant="h6">
          {ticketProduct ? "Change Product" : "Add additional product"}
        </Typography>{" "}
        <br />
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <p>Which Product?</p>
            <TextField
              select
              required
              value={product ? product : ""}
              onChange={this.changeProduct}
              fullWidth
              margin="dense"
              variant="outlined"
            >
              {products.map(gluuProduct => (
                <MenuItem key={gluuProduct.id} value={gluuProduct.id}>
                  {gluuProduct.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <p>What Version?</p>
            <TextField
              select
              required
              value={version}
              onChange={this.changeVersion}
              fullWidth
              margin="dense"
              variant="outlined"
            >
              {versionOptions.map(item => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <p>Which OS?</p>
            <TextField
              select
              required
              value={os}
              onChange={this.changeOs}
              fullWidth
              margin="dense"
              variant="outlined"
            >
              {osOptions.map(item => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <p>What Version?</p>
            <TextField
              required
              value={osVersion}
              onChange={this.changeOsVersion}
              fullWidth
              margin="dense"
              variant="outlined"
              disabled={!gluuProduct}
            />
          </Grid>
        </Grid>
        <Box mt={4}>
          <Button
            onClick={this.saveProduct}
            classes={{ root: classes.saveButton }}
          >
            {ticketProduct ? "Update Product" : "Add Product"}
          </Button>{" "}
          &emsp;
          <Button onClick={closeModal}>Cancel</Button>
        </Box>
      </div>
    );
  }
}

export default withTicketDetail(
  withInfo(withRouter(withStyles(styles)(ChangeProduct)))
);