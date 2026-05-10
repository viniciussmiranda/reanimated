import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CartaoArrastavel from './components/CartaoArrastavel';

const ITENS = [
  { id: '1', rotulo: 'Brócolis' },
  { id: '2', rotulo: 'Pizza' },
  { id: '3', rotulo: 'Chuva' },
  { id: '4', rotulo: 'Praia' },
  { id: '5', rotulo: 'Dormir' },
  { id: '6', rotulo: 'Estudar' },
];

export type StatusCartao = 'pendente' | 'gosto' | 'naoGosto';

export default function App() {
  const [statusCartoes, setStatusCartoes] = useState<Record<string, StatusCartao>>(
    () => Object.fromEntries(ITENS.map((item) => [item.id, 'pendente']))
  );

  const refColunaEsquerda = useRef<View>(null);
  const refColunaDireita = useRef<View>(null);
  const [zonaEsquerda, setZonaEsquerda] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [zonaDireita, setZonaDireita] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const medirZonas = () => {
    refColunaEsquerda.current?.measureInWindow((x, y, width, height) => {
      setZonaEsquerda({ x, y, width, height });
    });
    refColunaDireita.current?.measureInWindow((x, y, width, height) => {
      setZonaDireita({ x, y, width, height });
    });
  };

  const aoSoltar = (id: string, px: number, py: number): StatusCartao => {
    const naEsquerda =
      px >= zonaEsquerda.x &&
      px <= zonaEsquerda.x + zonaEsquerda.width &&
      py >= zonaEsquerda.y &&
      py <= zonaEsquerda.y + zonaEsquerda.height;

    const naDireita =
      px >= zonaDireita.x &&
      px <= zonaDireita.x + zonaDireita.width &&
      py >= zonaDireita.y &&
      py <= zonaDireita.y + zonaDireita.height;

    if (naEsquerda) {
      setStatusCartoes((prev) => ({ ...prev, [id]: 'naoGosto' }));
      return 'naoGosto';
    } else if (naDireita) {
      setStatusCartoes((prev) => ({ ...prev, [id]: 'gosto' }));
      return 'gosto';
    }
    return 'pendente';
  };

  const resetar = () => {
    setStatusCartoes(Object.fromEntries(ITENS.map((item) => [item.id, 'pendente'])));
  };

  const itensPendentes = ITENS.filter((i) => statusCartoes[i.id] === 'pendente');
  const itensGosto = ITENS.filter((i) => statusCartoes[i.id] === 'gosto');
  const itensNaoGosto = ITENS.filter((i) => statusCartoes[i.id] === 'naoGosto');

  return (
    <GestureHandlerRootView style={estilos.raiz}>
      <View style={estilos.container} onLayout={medirZonas}>
        <Text style={estilos.titulo}>Arraste o que você{'\n'}Gosta / Não Gosta</Text>

        <View style={estilos.filhaZonas}>
          <View ref={refColunaEsquerda} style={[estilos.zona, estilos.zonaNaoGosto]}>
            <Text style={estilos.zonaRotulo}>NÃO{'\n'}GOSTO</Text>
            {itensNaoGosto.map((item) => (
              <View key={item.id} style={estilos.cartaoSolto}>
                <Text style={estilos.textoCartaoSolto}>{item.rotulo}</Text>
              </View>
            ))}
          </View>

          <View ref={refColunaDireita} style={[estilos.zona, estilos.zonaGosto]}>
            <Text style={estilos.zonaRotulo}>GOSTO</Text>
            {itensGosto.map((item) => (
              <View key={item.id} style={estilos.cartaoSolto}>
                <Text style={estilos.textoCartaoSolto}>{item.rotulo}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={estilos.areaCartoes}>
          <Text style={estilos.dica}>
            {itensPendentes.length > 0 ? 'Arraste os cartões acima' : 'Todos classificados!'}
          </Text>
          <View style={estilos.filhaCartoes}>
            {itensPendentes.map((item) => (
              <CartaoArrastavel
                key={item.id}
                id={item.id}
                rotulo={item.rotulo}
                aoSoltar={aoSoltar}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity style={estilos.botaoReset} onPress={resetar}>
          <Text style={estilos.textoBotaoReset}>Resetar</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: '#0f0f14',
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 12,
  },
  titulo: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  filhaZonas: {
    flexDirection: 'row',
    gap: 10,
    height: 280,
  },
  zona: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    padding: 10,
    alignItems: 'center',
    minHeight: 280,
  },
  zonaNaoGosto: {
    backgroundColor: '#1a0a0a',
    borderColor: '#ff4757',
    borderStyle: 'dashed',
  },
  zonaGosto: {
    backgroundColor: '#0a1a0f',
    borderColor: '#2ed573',
    borderStyle: 'dashed',
  },
  zonaRotulo: {
    color: '#aaaaaa',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  cartaoSolto: {
    backgroundColor: '#2a2a35',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 6,
    width: '90%',
    alignItems: 'center',
  },
  textoCartaoSolto: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  areaCartoes: {
    marginTop: 24,
    alignItems: 'center',
  },
  dica: {
    color: '#666680',
    fontSize: 13,
    marginBottom: 16,
  },
  filhaCartoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  botaoReset: {
    marginTop: 24,
    alignSelf: 'center',
    backgroundColor: '#2a2a3e',
    borderRadius: 10,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#555570',
  },
  textoBotaoReset: {
    color: '#aaaacc',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});