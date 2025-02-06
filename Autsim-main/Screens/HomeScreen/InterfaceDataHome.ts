import { ImageSourcePropType } from "react-native";

export interface DataArray {
    id: number;
    name: string;
    Icon: ImageSourcePropType;
  }
  
  export const data: DataArray[] = [
    {
      id: 1,
      name: "Communication",
      Icon: require("../../assets/89696861ccb444fdc97b7286b9915c39.jpeg"),
    },

    {
      id: 2,
      name: "Services",
      Icon: require("../../assets/f20368c0a017098de95142df2d20f19d.jpeg"),
    },
    {
      id: 3,
      name: "Events",
      Icon: require("../../assets/3f3baed0a7dde6555f737e7f02181509.jpeg"),
    },
  ];