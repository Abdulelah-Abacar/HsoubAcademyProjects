import {
  ArrowUpIcon,
  Box,
  Icon,
  KeyboardAvoidingView,
  Text,
  View,
} from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import { withChatContext } from "../context/ChatProvider";
import { ChatHeader } from "../components";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { Moment, Strings } from "../config";
import styles from "./style/chat";

const Chat = ({ chat, navigation }) => {
  const [message, setMessage] = useState("");
  const [lastType, setLastType] = useState(false);

  const { account, contact } = chat;
  const status = chat.status();
  const messages = chat.messages.filter(
    (e) => e.sender === contact.id || e.receiver === contact.id
  );

  useEffect(() => {
    return () => chat.setCurrentContact({});
  }, []);

  const onBackClick = () => navigation.goBack(null);

  const onProfileClick = () => {
    navigation.navigate("Profile");
  };

  const onSend = () => {
    let content = message.trim();
    if (!content) return;
    setMessage("");
    setLastType(false);
    chat.sendMessage(content);
  };

  const onMessageChange = (message) => {
    setMessage(message);
    if (!lastType || Moment() - lastType > 2000) {
      setLastType(Moment());
      chat.sendType();
    }
  };

  const renderInputToolbar = (props) => {
    props.placeholder = Strings.WRITE_YOUR_MESSAGE;
    props.textInputStyle = styles.input;
    props.renderSend = renderSend;
    return <InputToolbar {...props} />;
  };

  const renderSend = () => (
    <Icon as={ArrowUpIcon} onPress={onSend} style={styles.send} />
  );

  return (
    <Box>
      <ChatHeader
        contact={contact}
        onBack={onBackClick}
        onProfile={onProfileClick}
        status={status}
      />
      <View style={styles.aa}>
        <GiftedChat
          user={{ _id: account.id }}
          messages={messages.reverse()}
          renderInputToolbar={renderInputToolbar}
          text={message}
          onInputTextChanged={onMessageChange}
          renderAvatar={null}
        />
        <KeyboardAvoidingView behavior="padding" />
      </View>
    </Box>
  );
};

export default withChatContext(Chat);
