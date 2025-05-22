import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalMedia: {
    height: "100%",
    width: "100%",
  },
  userImage: {
    backgroundColor: "blue",
    height: 30,
    width: 30,
    borderRadius: 48,
  },
  userName: {
    color: "#fff",
    fontWeight: "600",
  },
  userRole: {
    color: "#fffdfdad",
    fontWeight: "400",
    fontSize: 12,
  },
  mediaDescription: {
    color: "#fff",
    marginTop: 8,
    fontSize: 12,
  },
  footerActions: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 10,
    zIndex: 2,
  },
  footerActionContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    padding: 8,
  },
  footerIcon: {
    width: 24,
    height: 24,
  },
  footerActionText: {
    color: "#fff",
    fontSize: 12,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    height: 400,
    width: "100%",
    zIndex: 1,
  },
});
