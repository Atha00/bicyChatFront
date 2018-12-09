import React from "react";
import { GiftedChat, MessageText } from "react-native-gifted-chat";
import axios from "axios";
import { View, Text } from "react-native";

class App extends React.Component {
  state = {
    messages: []
  };

  componentDidMount() {
    axios
      .get("http://localhost:2001/messages/5c0d3b4e4ccb172a762877b0")
      .then(response => {
        this.setState({ messages: response.data });
      });

    this.ws = new WebSocket("ws://localhost:3000");

    this.ws.onmessage = e => {
      const message = JSON.parse(e.data);

      this.setState({
        messages: GiftedChat.append(this.state.messages, message)
      });
    };
  }

  onSend(messages = []) {
    this.ws.send(
      JSON.stringify({
        text: messages[0].text,
        name: "Safi",
        firstName: "Farid",
        thread: "5c0d3b4e4ccb172a762877b0"
      })
    );
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
  }

  render() {
    return (
      <GiftedChat
        user={{ _id: "5c0d3b4e4ccb172a762877ad" }}
        renderMessageText={props => {
          console.log(props.currentMessage);
          if (
            props.currentMessage.isRequest === true &&
            props.currentMessage.thread.bike.user === "5c0d3b4e4ccb172a762877ad" // Est-ce que je suis le propriétaire du vélo ?
          ) {
            return (
              <React.Fragment>
                <MessageText {...props} />
                <View>
                  <Text>Vélo à louer</Text>
                </View>
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment>
                <MessageText {...props} />
              </React.Fragment>
            );
          }
        }}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
      />
    );
  }
}

export default App;
