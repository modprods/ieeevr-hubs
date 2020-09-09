import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import IfFeature from "../if-feature";
import configs from "../../utils/configs";
import maskEmail from "../../utils/mask-email";
import styles from "./Header.scss";
import { AuthContext } from "../auth/AuthContext";

export function Header() {
  const auth = useContext(AuthContext);

  return (
    <>
      {/* Heading */}
      <div class="header flex_horizontal">
          <img class="header_logo" src={"../../assets/images/Logo.svg"}/>
          <img />
          <div class="growing_div"></div>

            {auth.isSignedIn ? (
              <div>
                <span>
                  <FormattedMessage id="sign-in.as" /> {maskEmail(auth.email)}
                </span>{" "}
                <a href="#" onClick={auth.signOut}>
                  <FormattedMessage id="sign-in.out" />
                </a>
              </div>
            ) : (
              <button class="header_button transparent_header_button" onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        window.location.href='/signin';
                                                                                        }}>
                  Sign In
              </button>
            )}

          <button class="header_button transparent_header_button" onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    window.location.href='/help';
                                                                                    }}>
              Help
          </button>

          <button class="header_button blue_button" onClick={(e) => {
                                                                      e.preventDefault();
                                                                      window.location.href='/';
                                                                      }}>
              Event Home
          </button>

      </div>
      {/* End of Heading */}
      </>
  );
}
