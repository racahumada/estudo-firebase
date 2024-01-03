import {
  View,
  ScrollView,
  PermissionsAndroid,
  Alert,
  Linking,
} from "react-native";
import { useEffect, useState } from "react";
import { Cabecalho } from "../../componentes/Cabecalho";
import { CartaoInfo } from "../../componentes/CartaoInfo";
import { NovoPostBotao } from "../../componentes/NovoPostBotao";
import { pegarPostsTempoReal, salvarToken } from "../../servicos/firestore";
import estilos from "./estilos";
import { logout } from "../../servicos/auth";
import messaging from "@react-native-firebase/messaging";
import { auth } from "../../config/firebase";

export default function Principal({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    pegarPostsTempoReal(setPosts);
    PermissionRequest();
    pegarToken();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("Olhas mensagem", JSON.stringify(remoteMessage));
      console.log("Olhas mensagem", JSON.stringify(remoteMessage));
    });

    messaging().onNotificationOpenedApp(async (mensagem) => {
      if (!mensagem.appOpen) {
        console.log("mensgem em background", mensagem);
        Alert.alert("Olhas mensagem", JSON.stringify(mensagem));
        Linking.openURL("com.reactnative.spaceapp://");
      }
    });

    return unsubscribe;
  }, []);

  async function pegarToken() {
    const token = await messaging().getToken();
    const userID = auth.currentUser.uid;
    await salvarToken({
      userId: userID,
      token: token,
    });
    console.log(token);
  }

  function PermissionRequest() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
  }

  function mostrarNotificacoes() {
    navigation.navigate("Notificacoes", { notificacoes: notifications });
    setNotifications([]);
  }

  return (
    <View style={estilos.container}>
      <Cabecalho
        quantidadeNotificacoes={notifications.length}
        onPress={mostrarNotificacoes}
        logout={() => {
          logout();
          navigation.replace("Login");
        }}
      />

      <ScrollView style={estilos.scroll} showsVerticalScrollIndicator={false}>
        {posts?.map((item) => (
          <CartaoInfo
            key={item.id}
            titulo={item.titulo}
            fonte={item.fonte}
            descricao={item.descricao}
            imagem={item.imagemUrl}
            acao={() => navigation.navigate("Post", { item })}
          />
        ))}
      </ScrollView>

      <NovoPostBotao acao={() => navigation.navigate("Post")} />
    </View>
  );
}
