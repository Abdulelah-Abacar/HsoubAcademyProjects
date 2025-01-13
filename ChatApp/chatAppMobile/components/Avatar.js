import { StyleSheet } from "react-native";
import { Avatar, AvatarBadge, AvatarImage } from "@gluestack-ui/themed";
import { Urls } from "../config";
import avatar from "../assets/images/avatar.png";

export default ({ source, type, status }) => {
  let uri = source instanceof Object ? source.uri : Urls.AVATARS + source;

  source = source ? { uri: uri } : avatar;

  let size;
  if (type === "profile") {
    size = "2xl";
  } else if (type === "header") {
    size = "md";
  } else {
    size = "lg";
  }
  return (
    <Avatar size={size}>
      <AvatarImage source={source} alt="avatar" />
      {status && <AvatarBadge $dark-borderColor="$black" />}
    </Avatar>
  );
};

const styles = StyleSheet.create({
  profile: {
    alignSelf: "center",
    width: 200,
    height: 200,
    borderRadius: 200,
    marginBottom: 20,
  },
  list: {
    alignSelf: "center",
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  header: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
});
