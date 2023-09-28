import React, { Component } from 'react';
import { Paragraph, toaster } from 'evergreen-ui'


import {
    TwitterIcon,
    TelegramIcon,
    EmailIcon,
} from 'react-share';



class Icon_Container extends Component {
    render() {
        return (
            <div
                style={{
                    margin: 15
                }}
                onClick={this.props.onClick}
            >
                {this.props.children}
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
                size={500}
                marginBottom={30}
            >
                {this.state.children}
            </Paragraph>
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
                    Born in 1998, a developer.
                </My_Paragraph>
                <My_Paragraph>
                    Interested in almost EVERYTHING about how human thinks.
                </My_Paragraph>
                <My_Paragraph>
                    Open mind.
                </My_Paragraph>
                <My_Paragraph>
                    Dream about do something great to make the world a better place.
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
                            window.open("https://t.me/contact_yingshaoxo", "_blank")
                        }}
                    >
                        <TelegramIcon></TelegramIcon>
                    </Icon_Container>
                </div>
            </div>
        )
    }
}

export { Introduction }