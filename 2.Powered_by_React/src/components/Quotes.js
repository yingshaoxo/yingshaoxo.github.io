import React, { Component } from "react";
import { Paragraph } from "evergreen-ui";

class Quotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  get_random_one = () => {
    const default_one = (
      <Paragraph fontFamily="ui" size={500} marginTop={20}></Paragraph>
    );
    if (this.state.text) {
      const array = this.state.text.split(/\n/);
      let paragraphs = [];
      array.forEach((t, index) => {
        paragraphs.push(
          <Paragraph fontFamily="ui" size={500} marginTop={20} key={index}>
            {t}
          </Paragraph>
        );
      });
      return (
        <div
          style={{
            maxHeight: "40vh",
            overflowY: "auto",
          }}
        >
          {paragraphs}
        </div>
      );
    } else {
      return default_one;
    }
  };

  componentDidMount() {
    let theList = [
      "What you think is what you are.",
      "You can never defeat a person who never gives up.",
      `School is not a place for smart people.
                            --- Rick and Morty`,
      `You know what, the difference between man and man is that some of them keep their promise, while others not. I'm the first kind.`,
    ];
    let randomElement = theList[Math.floor(Math.random() * theList.length)];
    this.setState({
      text: randomElement,
    });
    // fetch('data/mine.json')
    //     .then(response => response.json())
    //     .then(data => {
    //         let storage_today = localStorage.getItem("today")
    //         let this_day = new Date().toLocaleDateString()

    //         let is_english = (str) => {
    //             try {
    //                 var string = str.replace(/[\n– »’`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
    //                 var en = string.match(/[a-z]/ig)
    //                 var cn = string.match(/[^ -~]/g)

    //                 var en_length = en.length
    //                 var cn_length = cn.length

    //                 if (en_length / string.length > 0.3) {
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             }
    //             catch (err) {
    //                 return false;
    //             }
    //         }

    //         let final_string = ""
    //         while (1) {
    //             let randomIndex = Math.floor(Math.random() * data.length)
    //             final_string = `${data[randomIndex][0]}

    //             ${data[randomIndex][2]}`
    //             if (is_english(final_string)) {
    //                 break
    //             }
    //         }

    //         if (storage_today == null) {
    //             localStorage.setItem("today", this_day)
    //             this.setState({
    //                 text: final_string
    //             })
    //         } else {
    //             if (this_day != storage_today) {
    //                 this.setState({
    //                     text: final_string
    //                 })
    //                 localStorage.setItem("today", this_day)
    //             } else {
    //                 let theList = [
    //                     "What you think is what you are.",
    //                     "You can never defeat a person who never gives up.",
    //                     `School is not a place for smart people.
    //                     --- Rick and Morty`,
    //                     `You know what, the difference between man and man is that some of them keep their promise, while others not. I'm the first kind.`,
    //                 ]
    //                 let randomElement = theList[Math.floor(Math.random() * theList.length)]
    //                 this.setState({
    //                     text: randomElement
    //                 })
    //             }
    //         }
    //     });
  }

  render() {
    return this.get_random_one();
  }
}

export { Quotes };
