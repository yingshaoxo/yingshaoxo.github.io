import React, { Component } from 'react';
import './App.scss';

import { Dialog, Text, Avatar, Paragraph, Pane } from 'evergreen-ui'
import { Tablist, Button, toaster } from 'evergreen-ui'
import { TextInput, Autocomplete } from 'evergreen-ui'
import { SideSheet } from 'evergreen-ui'

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import SwipeableViews from 'react-swipeable-views';

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
                confirmLabel="Nice to see you, too"
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
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: "column",
                    height: '70vh'
                }}
            >
                {
                this.state.show_sheet && 
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
                    Some introduction
                </SideSheet>
                }

                <Pane
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    margin={24}
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

class Foot_Buttons extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sheet: null,
            tab_size: 20
        }

        this.return_sheet_content = this.return_sheet_content.bind(this)
    }

    return_sheet_content(sheet_name) {
        if (sheet_name == "books") {
            return (
                <Paragraph margin={40}>books</Paragraph>
            )
        } else if (sheet_name == "introduction") {
            return (
                <Paragraph margin={40}>introduction</Paragraph>
            )
        } else if (sheet_name == "projects") {
            return (
                <Paragraph margin={40}>projects</Paragraph>
            )
        }
        return null
    }

    render() {
        return (
            <div>
                {
                this.state.sheet && 
                <SideSheet
                    isShown={() => {
                        if (this.state.sheet) {
                            return true
                        } else {
                            return false
                        }
                    }}
                    onCloseComplete={() => {
                        this.setState({ 
                            sheet: null
                        })
                    }}
                >
                    {this.return_sheet_content(this.state.sheet)}
                </SideSheet>
                }

                <Tablist
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "row",
                        height: '20vh'
                    }}
                >
                    <Tab
                        size={this.state.tab_size}
                        onClick={() => {
                            this.setState({
                                sheet: "books"
                            })
                        }}
                    >
                        My Books
                    </Tab>
                    <Tab
                        size={this.state.tab_size}
                        onClick={() => {
                            this.setState({
                                sheet: "introduction"
                            })
                        }}
                    >
                        My Introduction
                    </Tab>
                    <Tab
                        size={this.state.tab_size}
                        onClick={() => {
                            this.setState({
                                sheet: "projects"
                            })
                        }}
                    >
                        My Projects
                    </Tab>
                </Tablist>
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
    backgroundColor: '#FEA900',
  },
  slide2: {
    backgroundColor: '#B3DC4A',
  },
  slide3: {
    backgroundColor: '#6AC0FF',
  },
};

class My_Tabs extends React.Component {
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
                    */
                }

                <Search_Bar></Search_Bar>

                <Page_Center></Page_Center>

                <Foot_Buttons></Foot_Buttons>
            </div>
          </div>
          <div style={Object.assign({}, styles.slide, styles.slide3)}>slide n°3</div>
        </SwipeableViews>
      </div>
    );
  }
}

class App extends Component {
    render() {
        return (
            <My_Tabs></My_Tabs>
        )
    }
}

export default App;
