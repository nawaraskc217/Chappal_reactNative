import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet, Image, Switch } from 'react-native';
import Sound from 'react-native-sound'; // Use react-native-sound for audio

const { width, height } = Dimensions.get('window');

export default function App() {
  const [sonPosition, setSonPosition] = useState({ x: width / 2, y: height / 3 });
  const [sandalPosition] = useState(new Animated.ValueXY({ x: width / 2, y: height - 100 }));
  const [score, setScore] = useState(0);
  const [throwing, setThrowing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false); // New state to track pause/resume

  useEffect(() => {
    let interval: any;
    if (!isPaused) {
      const moveSon = () => {
        setSonPosition((prev) => ({
          x: Math.min(Math.max(prev.x + (Math.random() * 50 - 25), 0), width - 50),
          y: Math.min(Math.max(prev.y + (Math.random() * 50 - 25), 0), height - 200),
        }));
      };
      interval = setInterval(moveSon, 1000);
    }

    return () => clearInterval(interval);
  }, [isPaused]);

  const throwSandal = async () => {
    if (throwing || isPaused) return; // Prevent throwing when paused
    setThrowing(true);

    if (soundEnabled) {
      const sound = new Sound('./assets/throw.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load sound', error);
          return;
        }
        sound.play();
      });
    }

    const missChance = Math.random(); // 80% chance to miss
    const randomOffsetX = missChance < 0.8 ? Math.random() * 200 - 100 : Math.random() * 100 - 50;
    const randomOffsetY = missChance < 0.8 ? Math.random() * 200 - 100 : Math.random() * 100 - 50;
    const targetX = sonPosition.x + randomOffsetX;
    const targetY = sonPosition.y + randomOffsetY;

    Animated.timing(sandalPosition, {
      toValue: { x: targetX, y: targetY },
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      // Calculate the Euclidean distance between the sandal and the son
      const distance = Math.sqrt(
        Math.pow(targetX - sonPosition.x, 2) + Math.pow(targetY - sonPosition.y, 2)
      );

      // If the sandal is close enough to the son and the random chance allows a hit, increase the score
      if (missChance >= 0.8 && distance < 50) {
        setScore(score + 1);
      }

      // Reset the sandal position after the throw
      sandalPosition.setValue({ x: width / 2, y: height - 100 });
      setThrowing(false);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <TouchableOpacity
        style={[styles.son, { left: sonPosition.x, top: sonPosition.y }]}
        onPress={() => setScore(score + 1)}
      >
        <Image source={require('./assets/son.png')} style={styles.image} />
      </TouchableOpacity>
      <Animated.View style={[styles.sandal, { left: sandalPosition.x, top: sandalPosition.y }]}>
        <Image source={require('./assets/slippers.png')} style={styles.image} />
      </Animated.View>
      <TouchableOpacity style={styles.throwButton} onPress={throwSandal}>
        <Text style={styles.buttonText}>Throw Sandal</Text>
      </TouchableOpacity>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Sound</Text>
        <Switch value={soundEnabled} onValueChange={setSoundEnabled} trackColor={{ true: '#81b0ff', false: '#767577' }} />
      </View>
      <View style={styles.pauseSwitchContainer}>
        <Text style={styles.switchText}>Pause</Text>
        <Switch value={isPaused} onValueChange={setIsPaused} trackColor={{ true: '#81b0ff', false: '#767577' }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    backgroundColor: 'linear-gradient(45deg, #6a11cb, #2575fc)',
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    position: 'absolute',
    top: 40,
  },
  son: {
    position: 'absolute',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    transform: [{ scale: 1.1 }],
    transition: 'transform 0.3s ease-in-out',
  },
  sandal: {
    position: 'absolute',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
  },
  throwButton: {
    position: 'absolute',
    bottom: 50,
    padding: 20,
    backgroundColor: '#ff4081',
    borderRadius: 30,
    shadowColor: '#ff4081',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 5,
    transform: [{ scale: 1.1 }],
    transition: 'transform 0.3s ease-in-out',
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  switchContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pauseSwitchContainer: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 20,
    color: '#fff',
    marginRight: 10,
    fontFamily: 'sans-serif-condensed',
  },
});
