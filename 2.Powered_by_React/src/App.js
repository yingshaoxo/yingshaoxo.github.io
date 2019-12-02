import React, { Component } from 'react';
import './App.scss';

import { Dialog, Text, Avatar, Paragraph, Pane } from 'evergreen-ui'
import { Button, toaster } from 'evergreen-ui'
import { TextInput, Autocomplete } from 'evergreen-ui'
import { SideSheet } from 'evergreen-ui'
import { Table } from 'evergreen-ui'

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

import { Helmet } from 'react-helmet'


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


var request = require('request');


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
            <div>
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

                <Pane>
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
                        我需要3个月的实习机会(2020.2.1前有效)，remote或local都可以，南京、成都、上海优先。
                    </Paragraph>
                    <Paragraph
                        fontFamily='ui'
                        size={800}
                        marginTop={10}
                    >
                        你能帮助我完成实习并顺利毕业吗？
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
        return(
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


class WorkingTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: 0,
            tabs: ['1', '2', '3'],
            data: null,
        }
    }

    componentDidMount() {
        fetch("http://127.0.0.1:5000/WorkingTable")
          .then(res => res.json())
          .then(
            (result) => {
                this.setState({
                    data: JSON.parse(result)
                }) 
            },
          )
    }

    render() {
        return(
            <div
                style={{
                    width: '100%',
                    height: '100vh',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: "column",
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                {
                    (!this.state.data)? null: 
                    <Table>
                        <Table.Head>
                            <Table.TextHeaderCell flexBasis={"44vw"} flexShrink={0} flexGrow={0}>
                                day
                            </Table.TextHeaderCell>
                            <Table.TextHeaderCell>
                                state
                            </Table.TextHeaderCell>
                        </Table.Head>
                        <Table.Body height={"80vh"} width={"50vw"}>
                            {
                                this.state.data.map((item, index) => (
                                    (item['state'] == 'idle')?
                                        <Table.Row>
                                            <Table.TextCell flexBasis={"44vw"} flexShrink={0} flexGrow={0}>
                                                <h4 style={{color: 'red'}}>{item['day']}</h4>
                                            </Table.TextCell>
                                            <Table.TextCell>{item['state']}</Table.TextCell>
                                        </Table.Row>
                                    :
                                        <Table.Row>
                                            <Table.TextCell flexBasis={"44vw"} flexShrink={0} flexGrow={0}>
                                                <h4 style={{color: 'black'}}>{item['day']}</h4>
                                            </Table.TextCell>
                                            <Table.TextCell>{item['state']}</Table.TextCell>
                                        </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table>
                }
                </div>
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
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: "column",
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
                            }}
                        >
                            <My_List
                                data={[
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
                                        "title": "AI for Idiots",
                                        "description": "I'm a idiot, but I want to learn AI even before I getting start programming",
                                        "url": "https://yingshaoxo.xyz/books/artificial-intelligence-for-idiots",
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
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: "column",
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
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
                                        "title": "AI tools",
                                        "description": "This is a 10 year project",
                                        "url": "https://ai-tools.xyz",
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


class App extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>yingshaoxo | 技术宅</title>
                    <meta name="author" content="yingshaoxo" />
                    <meta name="description" content="yingshaoxo, born in 1998, love IT and AI. Want to be a great ML engineer. So I just keep learning and practice everyday." />
                    <meta name="keywords" content="yingshaoxo, YS, 胡英杰, Python, AI, Keras, Tensorflow, React, Javascript, Kotlin, C++" />
                </Helmet>

                <Top_Tabs></Top_Tabs>
            </div>
        )
    }
}

export default App;
