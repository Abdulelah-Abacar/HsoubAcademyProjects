import { Box, HStack, Text, View } from "@gluestack-ui/themed";
import { Avatar, Header } from "../components";
import { withChatContext } from "../context/ChatProvider";
import { Strings } from "../config";
import styles from "./style/profile";

const Profile = ({ chat }) => {
  const contact = chat.contact;
  const status = chat.status();

  return (
    <Box>
      <Header title={Strings.TITLE_PROFILE} />
      <Box>
        <View style={styles.avatarContainer}>
          <View>
            <HStack alignSelf="center">
              <Avatar source={contact.avatar} type="profile" />
            </HStack>
            <Text style={styles.name}>{contact.name}</Text>
            <Text note style={styles.status}>
              {status}
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.about}>
            {contact.about || Strings.DEFAULT_STATUS_MESSAGE}
          </Text>
        </View>
      </Box>
    </Box>
  );
};

export default withChatContext(Profile);
