import * as React from "react";
import { StyleSheet, View } from "react-native";
import db from "../firebaseConfig";
import {
  Layout,
  Text,
  List,
  ListItem,
  Button,
  ButtonGroup,
} from "@ui-kitten/components";

export default function OrderViewScreen({ navigation, route }) {
  const [param, setParam] = React.useState(route.params);
  const [order, setOrder] = React.useState(null);

  React.useEffect(() => {
    console.log(order);
  }, [order]);

  React.useLayoutEffect(() => {
    console.log(param);
    setOrder({
      cart: JSON.parse(param.id.item.data.cart),
      date: param.id.item.data.datetime,
      seat: param.id.item.data.location,
      name: param.id.item.data.name,
      status: param.id.item.data.status,
      total: param.id.item.data.total,
    });
  }, []);

  const getStatus = (status) => {
    switch (status) {
      case 0:
        return "Accepted";
        break;
      case 1:
        return "Preparing";
      case 2:
        return "Out for delivery";
      case 3:
        return "Delivered";
    }
  };

  const styles = StyleSheet.create({
    card: { flex: 1, alignItems: "center", flexGrow: 1 },
    layout: { flex: 1, justifyContent: "center", alignItems: "center" },
    list: { flexGrow: 0, marginTop: 50, width: "80%", height: "60%" },
    container: {
      flexGrow: 1,
      justifyContent: "space-evenly",
      alignItems: "stretch",
    },
  });

  const renderCard = (param) => {
    console.log(param.item);
    return (
      <ListItem
        disabled={true}
        title={param.item.item_name}
        description={`Quantity: ${param.item.qty}`}
        accessoryRight={(props) => {
          const prop = props;
          delete prop.style.height;
          delete prop.style.width;
          return <Text>₹{param.item.cost}</Text>;
        }}
      />
    );
  };

  return (
    <Layout
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
    >
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 50 }}>
        Order Details
      </Text>
      {order && (
        <>
          <View>
            <Text>Customer Name: {order.name}</Text>
            <Text>Date: {order.date.toDate().toLocaleString()}</Text>
            <Text>Train Number: {order.seat.train_num}</Text>
            <Text>Seat Number: {order.seat.seat_location}</Text>
            <Text style={{ marginBottom: 20 }}>
              Order Status: {getStatus(order.status)}
            </Text>
            {order && order.cart.length > 0 && (
              <>
                <List
                  style={{ flexGrow: 0 }}
                  scrollEnabled={false}
                  contentContainerStyle={{
                    flexGrow: 0,
                    justifyContent: "center",
                    alignItems: "stretch",
                  }}
                  data={order.cart}
                  renderItem={renderCard}
                />
              </>
            )}
          </View>
          <Text style={{ marginBottom: 30 }}>Total Amount: ₹{order.total}</Text>
        </>
      )}
    </Layout>
  );
}
