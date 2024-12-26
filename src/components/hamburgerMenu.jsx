import { useEffect, useState, useRef } from "react";
import "../hamburger.css";

const HamburgerMenu = (props) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const setMenuItem = (itemName) => {
    props.menuItem(itemName);
  };

  return (
    <div>
      <nav role="navigation">
        <div id="menuToggle">
          {/* 
          A fake / hidden checkbox is used as click receiver,
          so you can use the :checked selector on it.
          */}
          <input type="checkbox" id="menuCheckbox" />

          {/* 
          Some spans to act as a hamburger.
          
          They are acting like a real hamburger,
          not that McDonald's stuff.
          */}
          <span></span>
          <span></span>
          <span></span>
          {/* 
          Too bad the menu has to be inside of the button
          but hey, it's pure CSS magic.
          */}
          <ul id="menu">
            {/* 
            We can use a label here to close upon click (when doing same page navigation), this
            does require a slight bit of JS.
            */}
            <li>
              <label
                htmlFor="menuCheckbox"
                onClick={(e) => {
                  setMenuItem("exterior");
                  e.target.parentNode.click();
                }}
              >
                <a>Exterior</a>
              </label>
            </li>
            <li>
              <label
                htmlFor="menuCheckbox"
                onClick={(e) => {
                  setMenuItem("interior_1");
                  e.target.parentNode.click();
                }}
              >
                <a>Interior 1</a>
              </label>
            </li>

            {/* These just close the menu */}
            <li>
              <label
                htmlFor="menuCheckbox"
                onClick={(e) => {
                  setMenuItem("interior_2");
                  e.target.parentNode.click();
                }}
              >
                <a>Interior 2</a>
              </label>
            </li>
            <li>
              <label
                htmlFor="menuCheckbox"
                onClick={(e) => {
                  setMenuItem("interior_3");
                  e.target.parentNode.click();
                }}
              >
                <a>Interior 3</a>
              </label>
            </li>
            <li>
              <label
                onClick={(e) => {
                  setMenuItem("contact_us");
                  e.target.parentNode.click();
                }}
              >
                <a>Contact Us</a>
              </label>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default HamburgerMenu;
