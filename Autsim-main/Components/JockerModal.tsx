import { useColorScheme, View, Text, TouchableOpacity } from "react-native";
import { DefaultTheme, Dialog, Divider, Portal } from "react-native-paper";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface Props {
  onClose?: () => void;
  title: string;
  isVisable: boolean;
  isDissmiss: boolean;
  onPress: () => void;
}

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    surface: "white",
    onSurface: "black",
  },
};

const JockerModal = ({
  onClose,
  isVisable,
  title,
  isDissmiss,
  onPress,
}: Props) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? lightTheme : lightTheme;

  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: lightTheme.colors.surface }}
        visible={isVisable}
        onDismiss={onClose}
        dismissable={isDissmiss}
        theme={theme}
      >
        <Dialog.Title
          allowFontScaling={false}
          style={{
            textAlign: "center",
            fontFamily: "Fullship Regular.ttf",
            color: theme.colors.onSurface,
          }}
        >
          {title}
        </Dialog.Title>
        <Divider style={{ height: 2 }} />

        <Dialog.Content>
          <Text
            style={{
              textAlign: "center",
              fontSize: hp("1.7%"),
              marginTop: hp("1%"),
            }}
          >
            Are You Sure You Want To Logout ?
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              gap: "5%",
              marginTop: 10,
            }}
          >
            <TouchableOpacity onPress={onClose} style={{ width: "25%" }}>
              <View
                style={{
                  backgroundColor: "#4CAF50",
                  padding: 10,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: hp("1.7%") }}>No</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPress} style={{ width: "25%" }}>
              <View
                style={{
                  backgroundColor: "#4CAF50",
                  padding: 10,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: hp("1.7%") }}>
                  Yes
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default JockerModal;
