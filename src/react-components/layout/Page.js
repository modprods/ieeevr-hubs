import React from "react";
import PropTypes from "prop-types";
import "./Page.scss";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Page({ children, ...rest }) {
  return (
    <>
    <div class="starfield"></div>
        <main {...rest}>

          {children}
        </main>
      <Footer />
    </>
  );
}

Page.propTypes = {
  children: PropTypes.node
};
