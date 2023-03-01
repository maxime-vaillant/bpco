import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import CircledIcon from "../../../components/CircledIcon";
import { answers as emojis } from "../utils";

export const Smiley = ({
  indicator,
  value,
  onValueChanged,
  order = "DESC",
}) => {
  return (
    <View
      className="flex flex-row justify-center gap-8"
      style={[styles.emojisContainer]}
    >
      {emojis
        .map((emoji, i) => {
          let _emoji = {};
          if ((indicator.order || order) === "DESC") {
            _emoji = emojis[emojis.length - 1 - i];
          } else {
            Object.assign(_emoji, emoji);
          }
          _emoji.score = i + 1;
          return _emoji;
        })
        .map((emoji, i) => {
          const active = value === emoji.score;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => {
                const nextValue = emoji?.score;
                console.log("✍️  nextValue", nextValue);
                onValueChanged?.({ indicator, value: nextValue });
              }}
            >
              <View
                style={[
                  styles.selectionContainer,
                  active && styles.activeSelectionContainer,
                ]}
              >
                <CircledIcon
                  color={emoji.backgroundColor}
                  borderColor={emoji.borderColor}
                  iconColor={emoji.iconColor}
                  icon={emoji.icon}
                  iconContainerStyle={{ marginRight: 0 }}
                  iconWidth={32}
                  iconHeight={32}
                />
                {/* <Text>{emoji?.score}</Text> */}
              </View>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    marginVertical: 8,
  },
  contentContainer: {
    padding: 16,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 16,
    fontFamily: "Karla",
    fontWeight: "400",
    textAlign: "left",
    color: "#26387C",
    flexShrink: 1,
    marginLeft: 8,
    paddingTop: 3,
  },
  emojisContainer: {
    display: "flex",
    // flexDirection: "row",
    // justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  selectionContainer: {
    padding: 22,
    backgroundColor: "white",
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 8,
  },
  activeSelectionContainer: {
    backgroundColor: "#1FC6D5",
  },
});
