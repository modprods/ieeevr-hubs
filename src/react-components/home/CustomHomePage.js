import React, { useContext, useEffect, useMemo } from "react";
import { FormattedMessage, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import classNames from "classnames";
import { Page } from "../layout/Page";
import { usePublicRooms } from "./usePublicRooms";
import styles from "./HomePage.scss";
import customStyles from "../../assets/stylesheets/conference-content.scss";
import { AuthContext } from "../auth/AuthContext";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import { RoomList } from "./RoomList";
import { GroupFeaturedRooms } from "../misc/GroupFeaturedRooms"
import { useRouter } from "../misc/RouteHelper"
import '../../assets/stylesheets/common.css';
import '../../assets/stylesheets/home.css';
import IconFile from '../../assets/images/home/IconFile.svg';
import IconRocket from '../../assets/images/home/IconRocket.svg';
import IconPeople from '../../assets/images/home/IconPeople.svg';

//import './stylesheets/loading.css';

addLocaleData([...en]);

export function CustomHomePage() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  const { results: publicRooms } = usePublicRooms();
  const groupedPublicRooms = GroupFeaturedRooms(publicRooms);

  const scrollToTop = () => {
    console.log("Scrolling");
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    // Support legacy sign in urls.
    if (qs.has("sign_in")) {
      const redirectUrl = new URL("/signin", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    } else if (qs.has("auth_topic")) {
      const redirectUrl = new URL("/verify", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    }

    if (qs.has("new")) {
      createAndRedirectToNewHub(null, null, true);
    }
  }, []);

  return (
    <>
        <div class="starfield"></div>
        <div class="flex_vertical">
            <div class="header flex_horizontal">
                <img class="header_logo" src={"../../assets/images/Logo.svg"}/>
                <img />
                <div class="growing_div"></div>
                <button class="header_button transparent_header_button" onClick={(e) => router.push('/help')}>
                    Help
                </button>

                <button class="header_button blue_button" onClick={(e) => router.push('/')}>
                    Event Home
                </button>
            </div>
            <div class="flex_horizontal instructions_div">
                <div class="growing_div"></div>
                <img class="rocket_image" src={"../../assets/images/home/LargeRocket.svg"}/>
                <div class="growing_div"></div>
                <div class="flex_vertical welcome_instructions">
                    <div class="flex_vertical flex_center_vertically instructions_title">
                        <h1 class="h1_large">Welcome</h1>
                        <div class="centered_subtitle_text" style={{marginTop: '0px'}}>
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
                            ut
                            <br />labore et dolore magna aliquyam erat, sed diam voluptua.
                        </div>
                    </div>
                    <div class="flex_horizontal">
                        <div class="instruction_icon" style={{background: "url(" + IconFile +") no-repeat center/contain"}}></div>
                        <div class="flex_vertical">
                            <h3>Step 1. Signing In</h3>
                            <div class="instructions_text">
                                Know your unique id email address and have your email open/ready to access. For the best
                                experience possible, we recommend using a relatively new laptop or desktop computer with a
                                reliable internet connection
                            </div>
                        </div>
                    </div>
                    <div class="flex_horizontal">
                        <div class="instruction_icon" style={{background: "url("+ IconRocket + ") no-repeat center/contain"}}></div>
                        <div class="flex_vertical">
                            <h3>Step 2. Entering A Room</h3>
                            <div class="instructions_text">
                                To choose a room, scroll to the bottom of the page where you will see a list of rooms and
                                how many people are in each (out of the 20 person max). Once you’ve clicked “Join”, you will
                                be asked to enter your CB Insights unique ID email address to log in. You will receive an
                                email with the subject “Your CB Inisights Sign-In Link” that will contain a login link.
                            </div>
                        </div>
                    </div>
                    <div class="flex_horizontal">
                        <div class="instruction_icon" style={{background: "url(" + IconPeople + ") no-repeat center/contain"}}></div>
                        <div class="flex_vertical">
                            <h3>Step 3. Network</h3>
                            <div class="instructions_text">
                                Once inside your room, you will be asked to enter your name and choose your avatar, both of
                                which will be visible to others in the room. Once you have created a name and chosen an
                                avatar, click “Enter on Screen” You will then be asked to grant mic permissions.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="growing_div"></div>
            </div>
            <div class="home_content">
                <h2>Keynote</h2>
                <div class="h2_subtilte">Sept. 23, 6:30-7:00 pm ET</div>
                <div class="room_collection_description">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                    <br/>invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                </div>
                <div class="room_list flex_horizontal">
                    <RoomList rooms={groupedPublicRooms}/>
                </div>
                <h2>Networking</h2>
                <div class="h2_subtilte">Sept. 23, 6:30-7:00 pm ET</div>
                <div class="room_collection_description">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                    <br/>invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                </div>
                <div class="room_list flex_horizontal">
                    <RoomList rooms={groupedPublicRooms}/>
                </div>
            </div>
            <div class="flex_vertical">
                <h1>Need Help Accessing the VR World?</h1>
                <h1 class="h1_subtitle">Click below for full instructions.</h1>
                <button class="blue_button help_button_bottom" onClick={(e) => router.push('/help')}>Help</button>
            </div>
            <div class="back_to_top_container flex_vertical flex_center_vertically">
              <div class="flex_vertical flex_center_vertically" onClick={scrollToTop}>
                <img src={"../../assets/images/ArrowUp.svg"}/>
                <div class="back_to_top_text">Back To Top</div>
              </div>
            </div>
        </div>
      </>
  );
}
