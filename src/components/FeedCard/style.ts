import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    fontFamily: "Arial",
    fontSize: 14,
    width: "100%",
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 16,
  },
  topDescription: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  userThumbnail: {},
  userImage: {
    backgroundColor: "blue",
    height: 48,
    width: 48,
    borderRadius: 48,
  },
  userName: {
    color: "#000000e6",
    fontWeight: "600",
  },
  userRole: {
    color: "#00000099",
    fontWeight: "400",
    fontSize: 12,
  },
  date: {
    color: "#00000099",
    fontWeight: "400",
    fontSize: 12,
  },
  headerDescription: {},
  image: {
    width: "100%",
    height: 400,
  },
  footer: {
    paddingTop: 4,
    paddingRight: 10,
    paddingLeft: 10,
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    width: "100%",
    color: "#000000b3",
    borderBottomWidth: 1,
    borderBottomColor: "#0000001a",
  },
  statsText: {
    color: "#000000b3",
  },
  footerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  footerActionContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    padding: 8,
  },
  footerIcon: {
    width: 16,
    height: 16,
  },
  footerActionText: {
    color: "#000000b3",
    fontSize: 12,
  },
});
