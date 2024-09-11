import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity  } from 'react-native';
import { useUser } from "../context/UserContext";
import { FB_AUTH, FB_DB } from "../firebaseconfig";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Button from '../component/Reusable/Button';
import Header from '../component/Reusable/Header';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, { Easing, interpolate, useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ProfileScreen() {
  const { profile } = useUser();
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0); // la progression en pourcentage (0 à 1)
  const progressAnimated = useSharedValue(0);

  const handleSignOut = () => {
    signOut(FB_AUTH)
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Auth" }],
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion:", error);
      });
  };

  useEffect(() => {
    // Anime la progression du cercle lorsqu'on coche la case
    progressAnimated.value = withTiming(progress, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [progress]);

  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  // Remplir le cercle
  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference - (circumference * progressAnimated.value),
    };
  });

  return (
      <View style={styles.body}>
        <Header title={`${profile.FirstName} ${profile.LastName}`}/>
        <View style={styles.container}>
        <Text style={styles.subtitle}>Mes Statistiques</Text>
        <Text style={styles.subtitle}>Mes Badges</Text>
        <Svg height="120" width="120" viewBox="0 0 120 120">
        <G transform={`rotate(-90, 60, 60)`}>
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx="60"
          cy="60"
          r={radius}
          stroke="#0049AC"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="none"
        />
        </G>
      </Svg>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setProgress((prev) => (prev < 1 ? prev + 0.25 : 0))} // Simule une case cochée changez la valeur 0.25 en fonction du nombre de tâches
      >
        <View style={styles.checkbox}>
          <View style={[styles.checkboxIndicator, progress >= 1 && styles.checked]} />
        </View>
      </TouchableOpacity>
        <Button title="Déconnexion" onPress={handleSignOut} />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#FCF8F5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  button: {
    marginTop: 20,
  },
  checkbox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxIndicator: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
  },
  checked: {
    backgroundColor: 'green',
  },
});
