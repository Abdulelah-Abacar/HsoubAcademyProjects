import React, { useEffect, useState } from "react";
import strings from "../config/strings";
import { View } from "@gluestack-ui/themed";
import { Contact, HomeHeader } from "../components";
import { withChatContext } from "../context/ChatProvider";

const dataDb = {
  user: { id: "1", name: "Ahemd" },
  messages: [
    { sender: "1", receiver: "2", content: "hello how are you" },
    { sender: "1", receiver: "2", content: "hello how are you" },
    { sender: "3", receiver: "1", content: "hello how are you" },
    { sender: "1", receiver: "3", content: "hello how are you" },
    { sender: "2", receiver: "3", content: "hello how are you" },
    { sender: "3", receiver: "2", content: "hello how are you" },
    { sender: "1", receiver: "2", content: "hello how are you" },
    { sender: "1", receiver: "2", content: "hello how are you" },
    { sender: "1", receiver: "2", content: "hello how are you" },
    { sender: "1", receiver: "2", content: "hello how are you" },
  ],
  contacts: [
    { id: "1", name: "Contact 1" },
    { id: "2", name: "Contact 2" },
    { id: "3", name: "Contact 3" },
  ],
  contact: { id: "1", name: "Contact 1" },
};
const Home = ({ chat, navigation, route }) => {
  const [search, setSearch] = useState("");
  const { setUser } = route.params;

  const onContactClick = (contact) => {
    chat.setCurrentContact(contact);
    navigation.navigate("Chat");
  };

  const onMenuClick = () => {
    navigation.navigate("EditProfile");
  };

  const setMessageAndCounter = (contact) => {
    let messages = chat.messages.filter(
      (e) => e.sender === contact.id || e.receiver === contact.id
    );
    contact.lastMessage = messages[messages.length - 1];
    contact.counter = messages.filter(
      (e) => !e.seen && e.sender === contact.id
    ).length;

    return contact;
  };

  const renderContact = (contact, i) => {
    if (!contact.name.includes(search)) return null;
    contact = setMessageAndCounter(contact);

    return <Contact key={i} contact={contact} onClick={onContactClick} />;
  };

  const _init = async () => {
    let socket = await chat.connect();
    socket.on("error", onSocketError);
    chat.loadUserAccount();
  };

  const onSocketError = async (error) => {
    if (error === "auth_error") {
      await Auth.logout();
      setUser(null);
    }
  };

  useEffect(() => {
    _init();
  }, []);

  const onSearchChange = (value) => setSearch(value);
  return (
    <View flex={1}>
      <HomeHeader
        onSearchChange={onSearchChange}
        search={search}
        title={strings.TITLE_CONTACTS}
        onClick={onMenuClick}
      />
      {chat.contacts.map((contact, i) => renderContact(contact, i))}
    </View>
  );
};

export default withChatContext(Home);
