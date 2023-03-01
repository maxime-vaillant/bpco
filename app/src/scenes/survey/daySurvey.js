import React, { useEffect, useState, useContext, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import {
  beforeToday,
  formatDay,
  formatRelativeDate,
} from "../../utils/date/helpers";
import { computeNewSurveyAvailable } from "../../utils";
import { DiaryDataContext } from "../../context/diaryData";
import { useFocusEffect } from "@react-navigation/native";
import ArrowUpSvg from "../../../assets/ArrowUp";
import { Screen } from "../../components/Screen";
import { Button2 } from "../../components/Button2";
import { Card } from "../../components/Card";
import { IndicatorSurveyItem } from "./components/IndicatorSurveyItem";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { questions } from "../../utils/constants";
import { computeHasOxygen } from "../../utils";
import { computeResult } from "./utils";
import { ReloadInstructions } from "react-native/Libraries/NewAppScreen";

const DaySurvey = ({ navigation, route }) => {
  const initSurvey = route?.params?.currentSurvey ?? {
    date: formatDay(beforeToday(0)),
    answers: {},
  };

  const [diaryData, setDiaryData] = useContext(DiaryDataContext);
  const [hasOxygen, setHasOxygen] = useState(true);
  const [answers, setAnswers] = useState({});

  // useEffect(() => {
  //   (async () => {
  //     const onboardingStep = await localStorage.getOnboardingStep();
  //     const onboardingIsDone = await localStorage.getOnboardingDone();

  //     //if ONBOARDING_DONE is true, do nothing

  //     if (onboardingIsDone) {
  //       return;
  //     } else {
  //       const isFirstAppLaunch = await localStorage.getIsFirstAppLaunch();
  //       if (isFirstAppLaunch !== "false") {
  //         navigation.reset({
  //           routes: [
  //             {
  //               name: "onboarding",
  //               params: { screen: onboardingStep || "OnboardingPresentation" },
  //             },
  //           ],
  //         });
  //       }
  //     }
  //   })();
  // }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const userHasOxygen = await computeHasOxygen();
        setHasOxygen(userHasOxygen);
      })();
    }, [])
  );
  // const scrollRef = useRef();

  const toggleAnswer = async ({ key, value }) => {
    setAnswers((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const submitDay = async () => {
    const yesterdayDiaryData = diaryData[formatDay(beforeToday(1))];
    const { score, alert } = await computeResult(answers, yesterdayDiaryData);
    const answersAndResult = {
      ...answers,
      ...{ score, alert },
    };
    const prevCurrentSurvey = initSurvey;
    const currentSurvey = {
      date: prevCurrentSurvey?.date,
      answers: { ...prevCurrentSurvey.answers, ...answersAndResult },
    };
    setDiaryData(currentSurvey);
    return navigation.push("day-survey-result", { alert });
  };

  const renderTodayDate = () => {
    return (
      dayjs().locale("fr").format("dddd").charAt(0).toUpperCase() +
      dayjs().locale("fr").format("dddd").slice(1) +
      " " +
      dayjs().locale("fr").format("DD MMMM YYYY")
    );
  };

  if (
    Object.entries(answers).length === 0 &&
    !computeNewSurveyAvailable(diaryData)
  ) {
    // should not happen
    // came to this screen but survey is not available (was already done today)
    console.log("ERROR - survey already done");
    navigation.navigate("tabs");
  }

  return (
    <Screen
      containerStyle={{ marginBottom: 15 }}
      header={{
        title: "Mon suivi",
        preventGoBack: true,
      }}
      bottomChildren={
        <Button2
          disabled={
            Object.entries(answers).length <
            questions.filter((ind) =>
              hasOxygen ? true : ind.disabledWithoutOxygen === false
            ).length
          }
          fill
          title="Valider"
          onPress={submitDay}
        />
      }
      scrollProps={{
        onScrollBeginDrag: Keyboard.dismiss,
      }}
      contentContainerStyle={{ alignItems: "stretch" }}
      // scrollRef={scrollRef}
    >
      <View>
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.date}>{renderTodayDate()}</Text>
          <Text style={styles.title}>Par rapport à hier, avez-vous...</Text>
          {questions
            .filter((ind) => ind.category === "1")
            .map((ind) => (
              <IndicatorSurveyItem
                key={ind?.uuid}
                indicator={ind}
                value={answers?.[ind?.uuid]}
                onValueChanged={({ indicator, value }) =>
                  toggleAnswer({ key: indicator?.uuid, value })
                }
              />
            ))}
          <Text style={styles.title}>Par rapport à hier, utilisez-vous...</Text>
          {questions
            .filter((ind) => ind.category === "2")
            .filter((ind) => (hasOxygen ? true : !ind.disabledWithoutOxygen))
            .map((ind) => (
              <IndicatorSurveyItem
                key={ind?.uuid}
                indicator={ind}
                value={answers?.[ind?.uuid]}
                onValueChanged={({ indicator, value }) =>
                  toggleAnswer({ key: indicator?.uuid, value })
                }
              />
            ))}
          <Text style={styles.title}>Par rapport à hier,</Text>
          {questions
            .filter((ind) => ind.category === "3")
            .map((ind) => (
              <IndicatorSurveyItem
                key={ind?.uuid}
                indicator={ind}
                value={answers?.[ind?.uuid]}
                onValueChanged={({ indicator, value }) =>
                  toggleAnswer({ key: indicator?.uuid, value })
                }
              />
            ))}
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  date: {
    textAlign: "center",
    color: colors.BLUE,
    fontSize: 16,
  },
  title: {
    fontFamily: "Karla-Bold",
    color: colors.DARK_BLUE,
    fontSize: 20,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  spacing: {
    marginVertical: 8,
  },
  textArea: {
    backgroundColor: "#F4FCFD",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    marginHorizontal: 15,
  },
  selectionContainer: {
    padding: 3,
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 10,
  },
  selectionYesNoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 99999,
  },
  activeSelectionContainer: {
    backgroundColor: colors.LIGHT_BLUE,
  },
  activeLabel: {
    color: "#fff",
    fontFamily: "Karla-Bold",
  },
  arrowDown: {
    transform: [{ rotate: "180deg" }],
  },
  arrowUp: {
    transform: [{ rotate: "0deg" }],
  },

  buttonValidate: {
    width: "100%",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,183,200, .09)",
    marginTop: 20,
    marginBottom: 10,
    width: "100%",
    alignSelf: "center",
  },
  spacer: {
    height: 120,
  },

  questionContainer: {
    display: "flex",
  },
  questionHeaderContainer: {
    backgroundColor: "#F4FCFD",
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  questionHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionInfo: {
    marginTop: 15,
  },
  questionPoint: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: colors.LIGHT_BLUE,
  },
  questionTitle: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Karla-Bold",
  },
  answerContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    marginLeft: 18, // padding of the header question container + half of the dot size => 10 + 8 = 18
    display: "flex",
    justifyContent: "space-around",
  },
  answersContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 15,
  },
  leftFileAriane: {
    borderLeftColor: "#DEF4F5",
    borderLeftWidth: 2,
  },
  safe: {
    ...(Platform.OS === "android" && {
      paddingTop: (StatusBar.currentHeight || 24) + 10,
    }),
    flex: 1,
    backgroundColor: "white",
  },
  question: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 25,
    backgroundColor: "#F4FCFD",
    borderColor: "#DEF4F5",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingVertical: 20,
  },
  questionTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  questionText: {
    color: colors.BLUE,
    fontSize: 22,
    fontFamily: "Karla-Bold",
  },
  linkContainer: {
    backgroundColor: "rgba(31,198,213,0.2)",
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 0.5,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    paddingRight: 20,
  },
  linkTextContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  linkTitle: {
    color: colors.BLUE,
    fontSize: 14,
    fontFamily: "Karla-Bold",
    flex: 1,
    marginBottom: 5,
  },
  linkText: {
    color: colors.BLUE,
    fontSize: 14,
    flex: 1,
  },
  linkButtonContainer: {
    borderRadius: 20,
    backgroundColor: colors.LIGHT_BLUE,
    height: 40,
    width: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    transform: [{ rotate: "90deg" }],
    margin: 7,
  },
  subtitleTop: {
    flex: 1,
    color: colors.LIGHT_BLUE,
    fontSize: 18,
    fontFamily: "Karla-Bold",
    marginTop: 15,
    textAlign: "center",
  },
  subtitle: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    fontWeight: "normal",
    textAlign: "center",
  },
  answer: {
    backgroundColor: "#F4FCFD",
    borderColor: "#D4F0F2",
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  answerLabel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "600",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 0,
  },
  backButton: {
    fontFamily: "Karla-Bold",
    textDecorationLine: "underline",
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
  ValidationButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  ValidationButtonText: {
    color: "#fff",
    fontFamily: "Karla-Bold",
    fontSize: 19,
  },
  textInput: {
    fontSize: 20,
  },
  bottom: {
    justifyContent: "flex-end",
    marginBottom: 36,
  },
});

export default DaySurvey;
