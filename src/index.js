import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import registerTelemetry from "./telemetry";
import Store from "./storage/store";
import "./utils/theme";
import { HomePage } from "./react-components/home/HomePage";
import { CustomHomePage } from "./react-components/home/CustomHomePage";
import { CustomHelpPage } from "./react-components/home/CustomHelpPage";
import { SignInPage } from "./react-components/auth/SignInPage";

import { lang, messages } from "./utils/i18n";
//import "./assets/stylesheets/globals.scss";
import { AuthContextProvider } from "./react-components/auth/AuthContext";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ScrollToTop from './react-components/misc/ScrollToTop';

registerTelemetry("/home", "Hubs Home Page");

const store = new Store();
window.APP = { store };

function Root() {
  return (
    <IntlProvider locale={lang} messages={messages}>
      <AuthContextProvider store={store}>
        <Router>
          <ScrollToTop>
            <Switch>
              <Route exact path="/">
                <CustomHomePage />
              </Route>
              <Route path="/help">
                <CustomHelpPage />
              </Route>
              <Route path="/signin">
                <SignInPage />
              </Route>
            </Switch>
          </ScrollToTop>
        </Router>
      </AuthContextProvider>
    </IntlProvider>
  );
}

ReactDOM.render(<Root />, document.getElementById("home-root"));
