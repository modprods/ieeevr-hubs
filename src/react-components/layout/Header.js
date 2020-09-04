import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import IfFeature from "../if-feature";
import configs from "../../utils/configs";
import maskEmail from "../../utils/mask-email";
import styles from "./Header.scss";
import { AuthContext } from "../auth/AuthContext";
import { useRouter } from "../misc/RouteHelper"

export function Header() {
  const auth = useContext(AuthContext);
  const router = useRouter();

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
              <a href="/signin" rel="noreferrer noopener">
                <FormattedMessage id="sign-in.in" />
              </a>
            )}
                <button class="header_button transparent_header_button desktop_only" onClick={(e) => router.push('/help')}>
                    Help
                </button>

                <button class="header_button blue_button desktop_only" onClick={(e) => router.push('/')}>
                    Event Home
                </button>

				  <div class="mobile_only">
					  {/* Look at that high-quality placeholder.*/}
					  {/* TODO: Replace high-quality placeholder.*/}
					  =
					  {/* Then if the menu is open: 
					  X
					  */}
				  </div>
				</div>
			  {/* Then if the menu is open: 
			  <div class="flex_vertical">
          <button class="mobile_menu_item mobile_only" onClick={(e) => router.push('/help')}>
            Help
          </button>
				  <button class="mobile_menu_item mobile_only" onClick={(e) => router.push('/')}>
            Event Home
          </button>
			  </div>
			  */}
      {/* End of Heading */}
      </>
  );
}
