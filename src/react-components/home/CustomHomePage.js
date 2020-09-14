import React, { useContext, useEffect, useState } from "react";
import { addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import { usePublicRooms } from "./usePublicRooms";
import { RoomList } from "./RoomList";
import { GroupFeaturedRooms } from "../misc/GroupFeaturedRooms"
import IconFile from '../../assets/images/home/IconFile.svg';
import IconRoom from '../../assets/images/home/IconRoom.svg';
import IconPeople from '../../assets/images/home/IconPeople.svg';
import IconUnicorn from '../../assets/images/home/IconUnicorn.svg';
import Menu from '../../assets/images/hamburger.svg'
import CloseMenu from '../../assets/images/exit_menu.svg'
import { Page } from '../layout/Page'
import { AuthContext } from "../auth/AuthContext";
import { FormattedMessage } from "react-intl";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import { CustomHelpPage } from './CustomHelpPage';
import maskEmail from "../../utils/mask-email";
import '../../assets/stylesheets/common.css';
import '../../assets/stylesheets/common_mobile.css';
import '../../assets/stylesheets/home.css';
import '../../assets/stylesheets/home_mobile.css';
import '../../assets/stylesheets/help.css';
import '../../assets/stylesheets/help_mobile.css';

addLocaleData([...en]);

export function CustomHomePage() {
  const auth = useContext(AuthContext);
  const { results: publicRooms } = usePublicRooms();
  console.log(publicRooms);
  const [groupedKeynoteRooms, groupedNetworkRooms] = GroupFeaturedRooms(publicRooms, 'keynote');

  const [showHome, setShowHome] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const scrollToTop = () => {
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
    {/* Header */}
    <div className="header flex_horizontal">
        <img className="header_logo" src={"../../assets/images/Logo.svg"}/>
        <img />
        <div className="growing_div"></div>

        {/* Sign in functionality for Desktop */}
          {auth.isSignedIn ? (

              <button className="header_button transparent_header_button desktop_only" onClick={auth.signOut}>
                  Sign Out
              </button>

          ) : (
            <button className="header_button transparent_header_button desktop_only" onClick={(e) => {
                                                                                      e.preventDefault();
                                                                                      window.location.href='/signin';
                                                                                      }}>
                Sign In
            </button>
          )}
        {/* End of sign in functionality for Desktop */}

        <button className="header_button transparent_header_button desktop_only" onClick={() => {setShowHome(false)}}>
            Help
        </button>

        <button className="header_button blue_button desktop_only" onClick={() => {setShowHome(true)}}>
            Event Home
        </button>

        <img className="mobile_only" onClick={() => {setShowMenu(!showMenu)}} src={showMenu ? CloseMenu : Menu}/>
      </div>
      {/* End of Header */}

      {/* Main Page */}
      {/* Mobile Menu */}
      {showMenu ?
        <>
          {/* Sign in functionality for Mobile */}
          {auth.isSignedIn ? (
            <button className="mobile_menu_item mobile_menu_only" onClick={auth.signOut}>
                Sign Out
            </button>
          ) : (
            <button className="mobile_menu_item mobile_menu_only" onClick={(e) => {
                                                                          e.preventDefault();
                                                                          window.location.href='/signin';
                                                                          setShowMenu(false);}}>
              Sign In
            </button>
          )}
          {/* End of sign in functionality for Mobile */}

          <button className="mobile_menu_item mobile_menu_only" onClick={() => {setShowHome(false); setShowMenu(false);}}>
            Help
          </button>
          <button className="mobile_menu_item mobile_menu_only" onClick={() => {setShowHome(true); setShowMenu(false);}}>
            Event Home
          </button>
        </>
        :
      [(showHome ?
      <Page>
        <div className="flex_vertical">

            {/* Body */}
            <div className="flex_horizontal instructions_div mobile_vertical mobile_vertically_centered">
                <div className="growing_div"></div>
                <img className="rocket_image" src={"../../assets/images/home/LargeRocket.svg"}/>
                <div className="growing_div"></div>
                <div className="flex_vertical welcome_instructions">
                    <div className="flex_vertical flex_center_vertically instructions_title">
                        <h1 className="h1_large">Welcome</h1>
                        <div className="centered_subtitle_text" style={{marginTop: '0px'}}>
                          The next phase in your journey to the Future of Health takes place in a virtual world.
                          With or without a 3D headset, get ready to hear from Karen DeSalvo, Chief Health Officer
                          at Google (6:30-7:00pm) and join topic-oriented meetups with other attendees (7:00-8:00pm)
                        </div>
                    </div>
                    <div className="flex_horizontal mobile_vertical">
                      <h4>HOW TO PARTICIPATE:</h4>
                    </div>
                    <div className="flex_horizontal mobile_vertical">
                        <div className="instruction_icon_file" style={{backgroundImage: "url(" + IconFile +")"}}></div>
                        <div className="flex_vertical">
                            <h3>Step 1.</h3>
                            <div className="instructions_text">
                                Begin your journey by boarding a keynote ship (listed below).
                                Look for one that hasn’t reached the 20 person capacity.
                            </div>
                        </div>
                    </div>
                    <div className="flex_horizontal mobile_vertical">
                        <div className="instruction_icon" style={{backgroundImage: "url("+ IconRoom + ")"}}></div>
                        <div className="flex_vertical">
                            <h3>Step 2.</h3>
                            <div className="instructions_text">
                                Select the “Join” button and from there you will be asked to select your name and an avatar.
                                We encourage you to use your real name and company!
                            </div>
                        </div>
                    </div>
                    <div className="flex_horizontal mobile_vertical">
                        <div className="instruction_icon" style={{backgroundImage: "url(" + IconPeople + ")"}}></div>
                        <div className="flex_vertical">
                            <h3>Step 3.</h3>
                            <div className="instructions_text">
                              Follow the entry screen prompts and your avatar will be dropped into the bridge of the spaceship.
                              Walk to the front of the room and tune in for the keynote address.
                              Use W-A-S-D keys or the arrow keys on your keyboard to move around.
                              Enable your microphone for proximity-based voice chat or use the text box down below.
                            </div>
                        </div>
                    </div>
                    <div className="flex_horizontal mobile_vertical">
                        <div className="instruction_icon" style={{backgroundImage: "url(" + IconUnicorn + ")"}}></div>
                        <div className="flex_vertical">
                            <h3>Step 4.</h3>
                            <div className="instructions_text">
                              After the keynote, use the back arrow in your browser to return to this page.
                              Scroll down to find the topic meetup locations and get ready to explore other
                              virtual worlds and meet and voice chat with other attendees who have similar interests.
                              You can visit different rooms by using the back button and re-entering.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="growing_div"></div>
            </div>
            <div className="home_content mobile_vertically_centered">
                <h2>Keynote: Karen DeSalvo, <br/>Chief Health Officer, Google</h2>
                <div className="h2_subtitle">Sept. 23, 6:30-7:00 pm ET</div>
                <div className="room_collection_description">
                    Choose a ship for your journey and follow the instructions on screen.
                </div>
            </div>
            <div className="room_list flex_horizontal">
                <RoomList rooms={groupedKeynoteRooms}/>
            </div>
            <div className="home_content mobile_vertically_centered">
                <h2>Topic Meetups & Networking</h2>
                <div className="h2_subtitle">7:00-8:00 pm ET</div>
                <div className="room_collection_description">
                    Explore other virtual worlds and meet and voice chat with other attendees who have similar interests.
                </div>
            </div>
            <div className="room_list flex_horizontal">
                <RoomList rooms={groupedNetworkRooms}/>
            </div>
            <div className="flex_vertical">
                <h1>Need Help Accessing the VR World?</h1>
                <h1 className="h1_subtitle">Click below for full instructions.</h1>
                <button className="blue_button help_button_bottom" onClick={() => {setShowHome(false)}}>Help</button>
            </div>
            {/* End of Body */}

        </div>
      </Page> :
      <CustomHelpPage />
    )] }
    </>
  );
}
