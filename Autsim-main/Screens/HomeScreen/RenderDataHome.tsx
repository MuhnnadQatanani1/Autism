import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import { ImageSourcePropType } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface Props {
  name: string;
  Icon: ImageSourcePropType;
  onPressItem: (screen: string) => void;
}

const RenderDataHome = ({ Icon, name, onPressItem }: Props) => {
  return (
    <TouchableOpacity onPress={() => onPressItem(name)}>
      <View style={{ overflow: "hidden", margin: 10, borderRadius: 20 }}>
        <ImageBackground style={{ height: hp("20%") }} source={Icon}>
          <View
            style={{
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                backgroundColor: "#449E8B",
                padding: 10,
                width: "60%",
                alignItems: "center",
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: hp("1.8%"),
                }}
              >
                {name}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

export default RenderDataHome;
