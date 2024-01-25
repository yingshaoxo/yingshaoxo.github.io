import React, { Component } from "react";
import "./App.scss";

import Sound from "react-sound";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga";

import { Top_Tabs } from "./components/Top_Tabs";

if (window.location.host == "yingshaoxo.xyz") {
  ReactGA.initialize("UA-157005302-3");
  ReactGA.pageview(window.location.pathname + window.location.search);
}

class App extends Component {
  state = {
    show_down_icon: true,
    show_blog: false,
    music_status: Sound.status.STOPPED,
  };

  componentDidMount() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // true for mobile device
      console.log("mobile");
    } else {
      // false for not mobile device
      // I'd love to redirect those people who use desktop browser to a different page
      console.log("desktop");
      window.location.replace("http://yingshaoxo.xyz/legacy_index.html");
    }

    let isChrome =
      !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    if (isChrome) {
      this.setState({ show_blog: true });
    }

    window.addEventListener("scroll", () => {
      if (this.state.show_down_icon == true) {
        //let visual_height_of_our_page = window.innerHeight
        let current_y = window.scrollY;
        if (current_y > 0) {
          this.setState({
            show_down_icon: false,
          });
        }
      }
    });
  }

  render() {
    return (
      <div ref={this.state.darkdom}>
        <Helmet>
          <title>yingshaoxo | Hero Hu</title>
          <meta name="author" content="yingshaoxo" />
          <meta
            name="description"
            content="yingshaoxo, born in 1998, love IT and AI. Want to be a great ML engineer. So I just keep learning and practice everyday."
          />
          <meta
            name="keywords"
            content="yingshaoxo, YS, 胡英杰, Hero Hu, Python, AI, Keras, Tensorflow, React, Javascript, Kotlin, C++"
          />
        </Helmet>

        <Sound
          url="chosen.mp3"
          playStatus={this.state.music_status}
          autoLoad={true}
          volume={10}
        ></Sound>

        <Top_Tabs
          className="section"
          ref={(tabs) => {
            this.tabs_element = tabs;
          }}
        ></Top_Tabs>
      </div>
    );
  }
}

export default App;
