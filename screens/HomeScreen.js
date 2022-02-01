import * as React from "react";
import { Layout, Text, Card, List } from "@ui-kitten/components";
import db from "../firebaseConfig";
import { StyleSheet, Image, ScrollView, View } from "react-native";

export default function HomeScreen({ route, navigation }) {
  const [category, setCategory] = React.useState(new Array(0));
  const [login, setLogin] = React.useState();

  const getData = () => {
    console.log("getData:");
    db.collection("category")
      .get()
      .then((querySnapshot) => {
        let temp = new Array(0);
        querySnapshot.forEach((doc) => {
          temp[doc.data().pos] = {
            id: doc.id,
            name: doc.data().name,
            url: doc.data().img,
          };
        });
        setCategory([...temp]);
      });
  };

  console.log(category);

  React.useLayoutEffect(() => {
    getData();
  }, []);

  const styles = StyleSheet.create({});

  const renderCard = (param) => {
    return (
      <Card
        key={param.item.id}
        status={"basic"}
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          marginBottom: 10,
          minWidth: "70%",
          justifyContent: "flex-start",
        }}
        onPress={() =>
          navigation.navigate("Menu", { navigation, ...param.item })
        }
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          <Image
            style={{
              height: 100,
              width: 100,
              marginRight: 25,
            }}
            source={{
              uri:
                param.item.url ||
                "https://media.istockphoto.com/photos/assorted-south-indian-breakfast-foods-on-wooden-background-ghee-dosa-picture-id1292563627?b=1&k=20&m=1292563627&s=170667a&w=0&h=4DxcYQ2CACloQiFhgWW620pAvY859OhzyOEdAT8PbCY=",
            }}
          />
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {param.item.name}
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <ScrollView>
      <Layout
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Text
          onPress={getData}
          style={{ fontSize: 26, fontWeight: "bold", marginVertical: 20 }}
        >
          Home Screen
        </Text>
        {category.map((item) => renderCard({ item: item }))}
      </Layout>
    </ScrollView>
  );
}
