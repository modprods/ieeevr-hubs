import React from "react";
import { FormattedMessage } from "react-intl";
import IfFeature from "../if-feature";
import UnlessFeature from "../unless-feature";
import configs from "../../utils/configs";

export function Footer() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer>
      {/* Footer */}
      <div className="back_to_top_container flex_vertical flex_center_vertically">
        <div className="flex_vertical flex_center_vertically" onClick={scrollToTop}>
          <img src={"../../assets/images/ArrowUp.svg"}/>
          <div className="back_to_top_text">Back To Top</div>
        </div>
      </div>

      {/* End of Footer */}
    </footer>
  );
}
