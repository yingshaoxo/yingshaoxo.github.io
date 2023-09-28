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

import anime from 'animejs/lib/anime.es.js';
import $ from "jquery";

class Page_Center extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show_sheet: false,
            headRef: React.createRef(),
        }
    }

    componentDidMount() {
        let theNode = this.state.headRef.current

        // Given an object in Cartesian coordinates { x: …, y: … }
        // compute its Polar coordiantes { r: …, theta: … } 
        function cartesian_to_polar({ x, y }) {
            return {
                r: Math.sqrt(x * x + y * y),
                theta: Math.atan2(y, x)
            };
        }

        // Given an object in Polar coordiantes { r: …, theta: … } 
        // compute its Cartesian coordinates { x: …, y: … }
        function polar_to_cartesian({ r, theta }) {
            return {
                x: r * Math.cos(theta),
                y: r * Math.sin(theta)
            };
        }

        let centerX = $(document).width() / 2 * 0.985
        let centerY = $(document).height() / 2 * 0.97

        var demoContentEl = theNode
        var fragment = document.createDocumentFragment();

        var tl = anime.timeline({
            easing: 'easeOutExpo',
            loop: false,
        });
        let lines = [];

        function createEasingDemo(length, i) {
            var demoEl = document.createElement('div');
            demoEl.classList.add('line');
            let startPoint = { x: 100, y: 0 }
            let polarPoint = cartesian_to_polar(startPoint)
            polarPoint.theta = i * (360 / length)
            let targetPoint = polar_to_cartesian(polarPoint)
            setTimeout(() => {
                $(demoEl).css({
                    'transform': `rotate(${i * (360 / length)}deg)`,
                    'position': 'absolute',
                    'top': `${centerY}px`,
                    'left': `${centerX}px`,
                })

                tl.add({
                    targets: demoEl,
                    translateX: [-0.2 * centerX, 0.2 * centerX],
                    direction: 'alternate',
                    rotate: i * (360 / length),
                    scaleX: 5,
                    duration: 150,
                    delay: 50,
                    endDelay: 50,
                })
            }, 10);
            lines.push(demoEl);
            fragment.appendChild(demoEl);
        }

        let numOfElements = 20
        for (let i = 0; i < numOfElements; i++) {
            createEasingDemo(numOfElements, i);
        }

        //demoContentEl.innerHTML = '';
        //demoContentEl.appendChild(fragment);
        document.body.appendChild(fragment);

        setTimeout(() => {
            let length = lines.length
            lines.forEach((v, i) => {
                tl.add({
                    targets: v,
                    direction: 'alternate',
                    rotate: -i * (360 / length),
                    scaleX: 10,
                    translateX: [0, 0.1 * centerX],
                    translateY: [0, 0.1 * centerX],
                    duration: 1,
                    delay: 1,
                    endDelay: 50,
                })
            })
        }, 100);

        setTimeout(() => {
            tl.add({
                targets: ".line",
                translateX: [-0.2 * centerX, 0.2 * centerX],
                direction: 'alternate',
                rotate: 360 * 2,
                scaleX: 20,
                duration: 3000,
                delay: 50,
                endDelay: 100,
                opacity: .0,
            })
        }, 200);
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
                        ref={this.state.headRef}
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
                                        "title": "AI for Idiots",
                                        "description": "I'm a idiot, but I want to learn AI even before I getting start programming",
                                        "url": "https://yingshaoxo.xyz/books/artificial-intelligence-for-idiots/",
                                    },
                                    {
                                        "title": "Go tutorial for Pythoner",
                                        "description": "Help Python programmer to learn Go.",
                                        "url": "https://yingshaoxo.xyz/books/Go_tutorial_for_Pythoner/",
                                    },
                                    {
                                        "title": "University Notes",
                                        "description": "Some notes made by myself",
                                        "url": "https://yingshaoxo.xyz/books/University_Notes/",
                                    },
                                    {
                                        "title": "C/C++ tutorial for Pythoner",
                                        "description": "Make C/C++ simpler for learning.",
                                        "url": "https://yingshaoxo.gitbook.io/c-c-tutorial-for-pythoner/",
                                    },
                                    {
                                        "title": "use-python-to-build-a-modern-communication-system",
                                        "description": "This the first Ebook and first thesis I published.",
                                        "url": "https://leanpub.com/usepythontobuildamoderncommunicationsystem",
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