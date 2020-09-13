import React from "react";
import { addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import { Page } from '../layout/Page'
import maskEmail from "../../utils/mask-email";
import '../../assets/stylesheets/common.css';
import '../../assets/stylesheets/common_mobile.css';
import '../../assets/stylesheets/help.css';
import '../../assets/stylesheets/help_mobile.css';

addLocaleData([...en]);

export function CustomHelpPage() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      <Page>
        <div className="flex_vertical">

            {/* Body */}
            <div className="flex_vertical heading_container">
                <h1 className="h1_large">Having Trouble?</h1>
                <h1 className="h1_large">We Can help.</h1>
                <div className="centered_subtitle_text">
                    Here are some help instructions to guide you through our virtual experience.
                </div>
            </div>
            <div className="flex_vertical help_content mobile_vertically_centered">
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        1.
                    </div>
                    <div className="flex_vertical">
                        <h2>Before You Get Started</h2>
                        <div>
                            For the best experience possible, we recommend using: A relatively new laptop or desktop computer
                            with a reliable internet connection The latest Firefox browser. While the virtual rooms work with
                            most devices and web browsers, including Google Chrome and Safari, using low-powered devices such
                            as mobile phones, tablets, and laptops (2015 and older) is not recommended.
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        2.
                    </div>
                    <div className="flex_vertical">
                        <h2>Find A Room</h2>
                        <div>
                            You can watch the keynote in any of the rooms marked below Keynote header.
                            Each room can hold up to 20 people. All of the rooms will see the same content,
                            but you will only be able to interact with people in the same room as you. Simply hit “Join” to enter any of the rooms.
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        3.
                    </div>
                    <div className="flex_vertical">
                        <h2>Entering the Virtual Room</h2>
                        <div>
                          You will then be introduced to the <b>Lobby</b> of the room where you will have several options to gain access.
                          <br/><br/>
                          If you are using a VR Headset select the <b>“Enter on Stand Alone VR Headset.”</b><br/>
                          If you merely wish to spectate the room you can select <b>“Watch from Lobby”</b><br/>
                          If you are entering from a normal browser or web device you can select <b>“Enter Room”</b>
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        4.
                    </div>
                    <div className="flex_vertical">
                        <h2>Creating A Name & Avatar</h2>
                        <div>
                          Once inside your room, you will be asked to enter your name and choose your avatar,
                          both of which will be visible to others in the room. To see available avatar options,
                          click “Browse Avatars” and click on your desired choice. We encourage you to use your
                          real name and company to facilitate networking.
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        5.
                    </div>
                    <div className="flex_vertical">
                        <h2>Setting Up Communication</h2>
                        <div>
                          Once you have created a name and chosen an avatar, click on <b>“Enter on Screen”</b> (or <b>“Connect VR Headset”</b>
                          for VR headset users). You will then be asked to grant mic permissions.
                          <br/><br/>
                          To grant mic permissions, click <b>“Allow”</b> on the pop up in the left hand corner of your browser,
                          (Clicking <b>“Block”</b> will prevent you from using your microphone to communicate to others in the room).
                          <br/><br/>
                          Then click <b>“Next”</b>. If you have multiple microphones, this screen will allow you to choose
                          which one to use. If you don’t know what to select, simply continue with <b>“Default”</b>.
                          If your microphone is working, you should see a blue level indicator inside the microphone
                          icon when you speak. Click the speaker to test your speakers or headphones. When you are done, click <b>“Enter Now”</b>.
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        6.
                    </div>
                    <div className="flex_vertical">
                        <h2>Moving Around</h2>
                        <div>
                          Once you are in a virtual room, use the controls below to move around the room.
                          <br/><br/>
                          <b>Laptop / Desktop Controls:</b><br/>
                          -To walk, use W-A-S-D keys<br/>
                          (W moves forward, A moves left, S moves backward, D moves right.)<br/>
                          -To move faster, hold down SHIFT as you move.<br/>
                          -To look left, right, up and down, CLICK AND DRAG using the LEFT MOUSE BUTTON.
                          <br/><br/>
                          <b>Mobile Controls:</b><br/>
                          -To walk, use two fingers to MAKE A PINCH OPEN GESTURE<br/>
                          -To look left, right, up, and down, SWIPE AROUND the screen with ONE FINGER<br/>
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        7.
                    </div>
                    <div className="flex_vertical">
                        <h2>Communicating With Others</h2>
                        <div>
                          Once inside a room, you can communicate with other individuals as if you were in a real space.
                          To talk to others via text chat, type in the translucent text bar at the bottom of the screen
                          and press the <b>“ENTER KEY”</b>. Your message will then be displayed in the main chat window to the rest of the room.
                          <br/><br/>
                          To Adjust the volume of the video, hover your mouse over the middle screen and click on the “+” and “-“ buttons
                          <br/><br/>
                          To adjust your Name and Avatar Preferences (and additional settings),
                          click on the Menu button in the top left corner of your window.
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        8.
                    </div>
                    <div className="flex_vertical">
                        <h2>Changing And Leaving Rooms</h2>
                        <div>
                          To move to the Networking rooms once the Keynote is over to, simply navigate back to this page,
                          by either hitting the back button, or by going to hubs-cbinsights.com, and select “Join” another room.
                          <br/><br/>
                          To leave the room and experience simply close the tab or window in your browser.
                        </div>
                    </div>
                </div>
                <div className="flex_horizontal mobile_vertical help_dotpoint_container mobile_vertically_centered">
                    <div className="help_dotpoint_num">
                        9.
                    </div>
                    <div className="flex_vertical">
                        <h2>Support And Reporting Conduct</h2>
                        <div>
                            If you are having trouble, try refreshing the page and re-entering the room.
                            If you are still having trouble, you can chat with us at subvrsive.com/miami-university
                            or by emailing <i>events@cbinsights.com</i>
                        </div>
                    </div>
                </div>
            </div>
            {/* End of Body */}

        </div>
      </Page>
    </>
  );
}
