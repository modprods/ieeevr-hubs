import React from "react";
import PropTypes from "prop-types";
import "./Page.scss";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Page({ children, ...rest }) {
  return (
    <>
      <Header />
        <main {...rest}>
          <div class="starfield"></div>
          {children}
        </main>
      <Footer />
    </>
  );
}

Page.propTypes = {
  children: PropTypes.node
};
