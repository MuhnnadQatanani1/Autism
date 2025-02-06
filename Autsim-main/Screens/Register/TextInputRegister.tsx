import { View, Text, TextInput } from "react-native";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { FormSchemaType } from "./Register";

interface TextInputRegisterProps {
  name: keyof FormSchemaType;
  control: Control<FormSchemaType>;
  placholder: string;
  emoji: string;
  error?: string | undefined;
  secureTextEntry?: boolean;
}

const TextInputRegister: React.FC<TextInputRegisterProps> = ({
  name,
  control,
  placholder,
  emoji,
  error,
  secureTextEntry
}) => {
  return (
    <View style={{ marginHorizontal: 20 }}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#F5F5F5",
                padding: 10,
                borderRadius: 8,
                alignItems: "center",
                borderWidth: error ? 1 : 0,
                borderColor: error ? "red" : undefined,
              }}
            >
              <Text style={{ marginRight: 10 }}>{emoji}</Text>
              <TextInput
                placeholder={placholder}
                value={value}
                onChangeText={onChange}
                style={{ flex: 1 }}
                secureTextEntry={secureTextEntry}
              />
            </View>
            {error ? (
              <Text style={{ color: "red", fontSize: 12, marginTop: 4, marginLeft: 4 }}>
                {error}
              </Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

export default TextInputRegister;