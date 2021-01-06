import React, { Component } from 'react';
import { Button, toaster, Dialog, Pane, Avatar } from 'evergreen-ui'
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

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import { Quotes } from './Quotes'
import { Introduction } from "./Introduction"

class Page_Center extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show_sheet: false,
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.show_sheet &&
                    <div>
                        <BrowserView>
                            <SideSheet
                                isShown={
                                    this.state.show_sheet
                                }
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

                <Pane>
                    <Avatar
                        src="me.jpg"
                        name="yingshaoxo"
                        size={200}
                    />

                    <Quotes>
                    </Quotes>

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
                    <Button
                        appearance="minimal"
                        intent="danger"
                        onClick={() => {
                            toaster.danger("That's OK.", {
                                duration: 2
                            })
                            setTimeout(() => {
                                window.open("https://yingshaoxo.xyz/legacy_index.html", '_self');
                            }, 2000)
                        }}
                    >
                        Disagree
                    </Button>
                </Pane>
            </div>
        )
    }
}


class My_Card extends Component {
    render() {
        return (
            <Card
                style={{
                    width: "75vw",
                }}
            >
                <CardActionArea
                    onClick={() => {
                        //toaster.success("hi")
                        window.open(this.props.item.url, "_blank")
                    }}
                >
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.props.item.title}
                        </Typography>
                        <Typography component="p">
                            {this.props.item.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>

                <CardActions>
                </CardActions>
            </Card>
        )
    }
}

class My_List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
        }
    }

    render() {
        return (
            <List
                style={{
                    height: "250px",
                    overflow: 'hidden',
                    overflowY: 'scroll'
                }}
            >
                {
                    this.state.data.map((item, index) => {
                        return (
                            <ListItem button
                                key={index}
                            >
                                <My_Card
                                    item={item}
                                >
                                </My_Card>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }
}



const styles = {
    tabs: {
        background: '#fff',
        display: "flex",
        justifyContent: "center",
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
                <Tabs value={index} centered onChange={this.handleChange} style={styles.tabs}>
                    <Tab label="My Books" />
                    <Tab label="My Introduction" />
                    <Tab label="My Projects" />
                </Tabs>

                <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
                    <div style={Object.assign({}, styles.slide, styles.slide1)}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: "column",
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
                                width: '100%',
                            }}
                        >
                            <My_List
                                data={[
                                    {
                                        "title": "use-python-to-build-a-modern-communication-system",
                                        "description": "This the first Ebook and first thesis I published.",
                                        "url": "https://leanpub.com/usepythontobuildamoderncommunicationsystem",
                                    },
                                    {
                                        "title": "AI for Idiots",
                                        "description": "I'm a idiot, but I want to learn AI even before I getting start programming",
                                        "url": "https://yingshaoxo.xyz/books/artificial-intelligence-for-idiots",
                                    },
                                    {
                                        "title": "University Notes",
                                        "description": "Some notes made by myself",
                                        "url": "https://yingshaoxo.xyz/books/University_Notes",
                                    },
                                    {
                                        "title": "Go tutorial for Pythoner",
                                        "description": "Help Python programmer to learn Go.",
                                        "url": "https://yingshaoxo.xyz/books/Go_tutorial_for_Pythoner",
                                    },
                                    {
                                        "title": "C/C++ tutorial for Pythoner",
                                        "description": "Make C/C++ simpler for learning.",
                                        "url": "https://yingshaoxo.gitbook.io/c-c-tutorial-for-pythoner/",
                                    },
                                    {
                                        "title": "物质与思想",
                                        "description": "初中积淀，高中完成，包含我所有价值观、世界观",
                                        "url": "https://medium.com/@yingshaoxo/material-and-thoughts-8b22c6cc12ab",
                                    },
                                ]}
                            ></My_List>
                        </div>
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
                                width: '100%',
                            }}
                        >
                            <Page_Center></Page_Center>
                        </div>
                    </div>

                    <div style={Object.assign({}, styles.slide, styles.slide3)}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: "column",
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
                                width: '100%',
                            }}
                        >
                            <My_List
                                data={[
                                    {
                                        "title": "Github",
                                        "description": "You know, I'm a open-minded person",
                                        "url": "https://github.com/yingshaoxo",
                                    },
                                    {
                                        "title": "Youtube",
                                        "description": "If I could show you something magic, I will",
                                        "url": "https://www.youtube.com/channel/UCbT9GDmkqf555ATReJor6ag",
                                    },
                                    {
                                        "title": "Blogger",
                                        "description": "I wrote tech posts here",
                                        "url": "https://yingshaoxo.blogspot.com/",
                                    },
                                ]}
                            ></My_List>
                        </div>
                    </div>
                </SwipeableViews>
            </div>
        );
    }
}


export { Top_Tabs }