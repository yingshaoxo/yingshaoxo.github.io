import React, { Component } from 'react';
import './App.scss';

import { Dialog, Text, Avatar, Paragraph, Pane } from 'evergreen-ui'
import { Button, toaster } from 'evergreen-ui'
import { TextInput, Autocomplete } from 'evergreen-ui'
import { SideSheet } from 'evergreen-ui'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';

import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";

import {
    TwitterIcon,
    TelegramIcon,
    EmailIcon,
} from 'react-share';

import { Link } from 'evergreen-ui'

class Hello_Component extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShown: true,
        }
    }

    render() {
        return (
            <div
                style={{
                    display: 'flex',  
                    justifyContent:'center', 
                    alignItems:'center', 
                    height: '10vh'
                }}
            >
                <Dialog
                isShown={this.state.isShown}
                title="A msg from yingshaoxo"
                onCloseComplete={() => this.setState({ isShown: false })}
                confirmLabel="Nice to see you"
                hasCancel={false}
                >
                    <Text size={900}>Hello, welcome to my world!</Text>
                </Dialog>
            </div>
        )
    }
}

class Search_Bar extends Component {
    render() {
        return (
            <div>
                <Autocomplete
                title="Fruits"
                onChange={(changedItem) => console.log(changedItem)}
                items={['Diary', 'Posts', 'QQ Number']}
                >
                {(props) => {
                    const { getInputProps, getRef, inputValue } = props
                    return (
                    <TextInput
                        height={32}
                        width="30vw"
                        placeholder="Tweets"
                        value={inputValue}
                        innerRef={getRef}
                        {...getInputProps()}
                    />
                    )
                }}
                </Autocomplete>
            </div>
        )
    }
}


class My_Paragraph extends Component {
    constructor(props) {
        super(props)

        this.state = {
            children: this.props.children,
        }
    }

    render() {
        return (
            <Paragraph
                size = {200}
                marginBottom = {30}
            >
                {this.state.children}
            </Paragraph>
        )
    }
}

class Icon_Container extends Component {
    render() {
        return (
            <div
                style={{
                    margin:15
                }}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </div>
        )
    }
}

class Introduction extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: 'center',
                    alignItems: this.props.alignItems,
                    height: this.props.height,
                }}
            >
                <My_Paragraph>
                    Born in 1998, University Student Maybe.
                </My_Paragraph>
                <My_Paragraph>
                    Interested in almost EVERYTHING about IT and AI.
                </My_Paragraph>
                <My_Paragraph>
                    A So-called GEEK.
                </My_Paragraph>
                <My_Paragraph>
                    Want to make some friends sharing the SAME interests.
                </My_Paragraph>
                <My_Paragraph>
                    Superhero fan.
                </My_Paragraph>
                <My_Paragraph>
                    Favourite Character is Captain America ←
                </My_Paragraph>
                <My_Paragraph>
                    Dream about building a great AI to make the world a better place.
                </My_Paragraph>
                <My_Paragraph>
                    Exciting!
                </My_Paragraph>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: 'center',
                        alignItems: "center",
                    }}
                >
                    <Icon_Container
                        onClick={() => {
                            window.open("https://twitter.com/yingshaoxo", "_blank")
                        }}
                    >
                        <TwitterIcon></TwitterIcon>
                    </Icon_Container>
                    <Icon_Container
                        onClick={() => {
                            toaster.success('yingshaoxo@gmail.com', {
                                duration: 10 
                            })
                        }}
                    >
                        <EmailIcon></EmailIcon>
                    </Icon_Container>
                    <Icon_Container
                        onClick={() => {
                            window.open("https://t.me/EasyProgrammingLanguage", "_blank")
                        }}
                    >
                        <TelegramIcon></TelegramIcon>
                    </Icon_Container>
                </div>
            </div>
        )
    }
}

class Page_Center extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show_sheet: false,
        }
    }

    render() {
        return (
            <div
                style={{
                    /*
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: "column",
                    height: '100vh'
                    */
                }}
            >
                {
                    this.state.show_sheet && 
                    <div>
                        <BrowserView>
                            <SideSheet
                                isShown={() => {
                                    if (this.state.show_sheet) {
                                        return true
                                    } else {
                                        return false
                                    }
                                }}
                                onCloseComplete={() => {
                                    this.setState({ 
                                        show_sheet: false
                                    })
                                }}
                            >
                                <Introduction 
                                    alignItems="center"
                                    height='100vh'
                                ></Introduction>
                            </SideSheet>
                        </BrowserView>
                        <MobileView>
                            <Dialog
                                isShown={() => {
                                    if (this.state.show_sheet) {
                                        return true
                                    } else {
                                        return false
                                    }
                                }}
                                title="About yingshaoxo"
                                onCloseComplete={() => {
                                    this.setState({ 
                                        show_sheet: false
                                    })
                                }}
                                confirmLabel="You are genius"
                                hasCancel={false}
                            >
                                <Introduction 
                                    alignItems="left"
                                    height=''
                                ></Introduction>
                            </Dialog>
                        </MobileView>
                    </div>
                }

                <Pane
                    /*
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    */
                >
                    <Avatar
                        src="https://avatars0.githubusercontent.com/u/17190829?s=460&v=4"
                        name="yingshaoxo"
                        size={200}
                    />

                    <Paragraph
                        fontFamily='ui'
                        size={800}
                        marginTop={20}
                    >
                        yingshaoxo thought he was the greatest man in this world.
                    </Paragraph>
                    <Paragraph
                        fontFamily='ui'
                        size={800}
                        marginTop={10}
                    >
                        How do you think?
                    </Paragraph>
                    <Button
                        appearance="minimal"
                        intent="success"
                        onClick={() => {
                            toaster.success('Thank you!', {
                                duration: 2
                            })
                            setTimeout(() => {
                                this.setState({
                                    show_sheet: true
                                })
                            }, 2000)
                        }}
                    >
                        Agree
                    </Button>
                </Pane>
            </div>
        )
    }
}


const styles = {
    tabs: {
        background: '#fff',
    },
    slide: {
        padding: 15,
        minHeight: 100,
        color: '#fff',
    },
    slide1: {
        backgroundColor: '#B3DC4A',
    },
    slide2: {
        backgroundColor: '#6AC0FF',
    },
    slide3: {
        backgroundColor: '#FEA900',
    },
};

class Top_Tabs extends React.Component {
    state = {
        index: 1,
    };

    handleChange = (event, value) => {
        this.setState({
            index: value,
        });
    };

    handleChangeIndex = index => {
        this.setState({
            index,
        });
    };

    render() {
        const { index } = this.state;

        return (
            <div>
                <Tabs value={index} fullWidth onChange={this.handleChange} style={styles.tabs}>
                    <Tab label="My Books" />
                    <Tab label="My Introduction" />
                    <Tab label="My Projects" />
                </Tabs>

                <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
                    <div style={Object.assign({}, styles.slide, styles.slide1)}>
                        Coming soon...
                    </div>

                    <div style={Object.assign({}, styles.slide, styles.slide2)}>
                        <div
                            className="App"
                            style={{
                                display: 'flex',
                                flexDirection: "column",
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
                            }}
                        >
                            {
                                /* 
                                <Hello_Component>
                                </Hello_Component>

                                <Search_Bar></Search_Bar>
                                */
                            }

                            <Page_Center></Page_Center>
                        </div>
                    </div>

                    <div style={Object.assign({}, styles.slide, styles.slide3)}>
                        Coming soon...
                    </div>
                </SwipeableViews>
            </div>
        );
    }
}


class App extends Component {
    render() {
        return (
            <Top_Tabs></Top_Tabs>
        )
    }
}

export default App;
