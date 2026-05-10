import React, { useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { StatusCartao } from '../App';

interface Props {
  id: string;
  rotulo: string;
  aoSoltar: (id: string, px: number, py: number) => StatusCartao;
}

const configSpring = {
  damping: 15,
  stiffness: 200,
  mass: 0.8,
};

export default function CartaoArrastavel({ id, rotulo, aoSoltar }: Props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const escala = useSharedValue(1);
  const origemX = useSharedValue(0);
  const origemY = useSharedValue(0);

  const chamarAoSoltar = useCallback(
    (px: number, py: number) => {
      aoSoltar(id, px, py);
    },
    [id, aoSoltar]
  );

  const gesto = Gesture.Pan()
    .onStart(() => {
      origemX.value = translateX.value;
      origemY.value = translateY.value;
      escala.value = withSpring(1.08, configSpring);
    })
    .onUpdate((evento) => {
      translateX.value = origemX.value + evento.translationX;
      translateY.value = origemY.value + evento.translationY;
    })
    .onEnd((evento) => {
      escala.value = withSpring(1, configSpring);
      runOnJS(chamarAoSoltar)(evento.absoluteX, evento.absoluteY);
      translateX.value = withSpring(0, configSpring);
      translateY.value = withSpring(0, configSpring);
    });

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: escala.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesto}>
      <Animated.View style={[estilos.cartao, estiloAnimado]}>
        <Text style={estilos.rotulo}>{rotulo}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: '#1e1e2e',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#3a3a55',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  rotulo: {
    color: '#e0e0ff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
