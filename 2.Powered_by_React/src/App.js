import anime from 'animejs/lib/anime.es.js';

import ReactGA from 'react-ga';
import React, { Component } from 'react';
import './App.scss';

import Sound from 'react-sound';

import { Icon, Dialog, Text, Avatar, Paragraph, Pane } from 'evergreen-ui'

import Iframe from 'react-iframe'

import { Top_Tabs } from "./components/Top_Tabs"

import { Helmet } from 'react-helmet'


if (window.location.host == "yingshaoxo.xyz") {
    ReactGA.initialize('UA-157005302-3');
    ReactGA.pageview(window.location.pathname + window.location.search);
}


class App extends Component {
    state = {
        show_down_icon: true,
        show_blog: false,
        music_status: Sound.status.STOPPED,
    };

    componentDidMount() {
        let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        if (isChrome) {
            this.setState({ show_blog: true })
        }


        window.addEventListener('scroll', () => {
            if (this.state.show_down_icon == true) {
                //let visual_height_of_our_page = window.innerHeight
                let current_y = window.scrollY
                if (current_y > 0) {
                    this.setState({
                        show_down_icon: false,
                    })
                }
            }
        })
    }

    render() {
        return (
            <div
                ref={this.state.darkdom}
            >
                <Helmet>
                    <title>yingshaoxo | Hero Hu</title>
                    <meta name="author" content="yingshaoxo" />
                    <meta name="description" content="yingshaoxo, born in 1998, love IT and AI. Want to be a great ML engineer. So I just keep learning and practice everyday." />
                    <meta name="keywords" content="yingshaoxo, YS, 胡英杰, Hero Hu, Python, AI, Keras, Tensorflow, React, Javascript, Kotlin, C++" />
                </Helmet>

                <Sound
                    url="chosen.mp3"
                    playStatus={this.state.music_status}
                    autoLoad={true}
                    volume={10}
                >
                </Sound>

                <Top_Tabs
                    className="section"
                    ref={(tabs) => { this.tabs_element = tabs }}
                ></Top_Tabs>

                {
                    (!this.state.show_blog) ? null :
                        <Iframe
                            className="section"
                            url="https://blog.ai-tools-online.xyz"
                            width="100%"
                            height="100%"
                            id="my_blog"
                            display="initial"
                            position="realtive" />
                }

                {
                    (!this.state.show_down_icon) ? null :
                        <div style={{
                            width: "100vw",
                            display: "flex",
                            justifyContent: "center",
                        }}>
                            <Icon icon="chevron-down" color="selected" size={36}
                                onClick={() => {
                                    let visual_height_of_our_page = window.innerHeight
                                    let current_y = window.scrollY
                                    //this.setState({show_down_icon: false})
                                    window.scrollTo(0, visual_height_of_our_page * 4)

                                    this.setState({
                                        music_status: Sound.status.PLAYING
                                    })
                                }}
                                className="floating-icon"
                            />
                        </div>
                }
            </div>
        )
    }
}

export default App;
